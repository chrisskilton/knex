import {TRUNCATE, INSERT_INTO, SELECT, DISTINCT, DELETE_FROM, UPDATE, _ALL_, FROM, OR, 
  HAVING, WHERE, AND, NOT, ASC, ORDER_BY, UNION,
  GROUP_BY, UNION_ALL, LIMIT, OFFSET} from './sql/keywords'

import {map, drop, lazySeq, iterSymbol, 
  iterator, iterdone, lazySeq, interpose, protocols} from 'transduce'
const  {transducer: {step: tStep, result: tResult}} = protocols
import {wrap, knexFlatten, columnize, commaDelimit, isKeyword} from './helpers'
import {COMMA, LEFT_PAREN, RIGHT_PAREN} from './sql/delimiters'
import {identifier, parameter} from './sql'

export class ColumnIterable {

  constructor(columns = []) {
    this.columns = columns
    this['@@knex/hook'] = 'columns'
  }

  [iterSymbol]() {
    if (this.columns.length === 0) {
      return iterator([_ALL_])
    }
    return columnize(this.columns)
  }

}

export class OrderingIterable {

  constructor(orderings) {
    this.orderings = orderings
    this['@@knex/hook'] = 'clause:orderings'
  }

  [iterSymbol]() {
    if (!this.orderings) return iterdone
    return iterator([ORDER_BY, commaDelimit(this.orderings)])
  }

}

export class OrderByClause {

  constructor(value, direction = ASC) {
    this.value = value
    this.direction = direction
    this['@@knex/hook'] = 'clause:order'
  }

  [iterSymbol]() {
    if (!this.value) return iterdone
    return iterator([columnize(this.value), this.direction])
  }

}

export class UnionsIterable {

  constructor(unions) {
    this.unions = unions
    this['@@knex/hook'] = 'clause:unions'
  }

  [iterSymbol]() {
    if (!this.unions) return iterdone
    return iterator(this.unions)
  }

}

export class UnionClause {

  constructor(value, wrapped, all) {
    this.wrapped = wrapped
    this.value   = value
    this.all     = all
    this['@@knex/hook'] = 'clause:union'
  }

  [iterSymbol]() {
    return iterator([
      this.wrapped ? LEFT_PAREN : undefined,
      this.all ? UNION_ALL : UNION,
      this.value,
      this.wrapped ? RIGHT_PAREN : undefined,
    ])
  }

}

export class WhereClause {
  
  constructor(column, operator, value) {
    this.column     = column
    this.operator   = operator
    this.value      = value
    this.__negated  = false
    this.__or       = false
    this['@@knex/hook'] = 'clause:where'
  }

  // [WHERE | AND | OR] [NOT] [EXISTS | BETWEEN | IN] value

  [iterSymbol]() {
    var prefixNot = this.__negated && !isKeyword(this.operator)
    var suffixNot = this.__negated && isKeyword(this.operator) 
      && this.operator['@@knex/value'] !== 'IS'
    var opNot     = this.__negated && isKeyword(this.operator) 
      && this.operator['@@knex/value'] === 'IS'
    return iterator([
      this.__or ? OR : AND,
      prefixNot ? NOT : undefined,
      identifier(this.column),
      suffixNot ? NOT : undefined,
      this.operator,
      opNot ? NOT : undefined,
      parameter(this.value)
    ])
  }

}

export class WhereIterable {
  constructor(wheres) {
    this.clauses = wheres
    this['@@knex/hook'] = 'clause:wheres'
  }
  [iterSymbol]() {
    return new WhereHavingIterator(this.clauses, WHERE)
  }
}

export class GroupedWhereIterable {
  constructor(wheres) {
    this.clauses = wheres
    this['@@knex/hook'] = 'clause:groupedWheres'
  }
  [iterSymbol]() {
    return lazySeq(wrap, new WhereHavingIterator(this.clauses))
  }
}

export class HavingClause {

  constructor(column, operator, value) {
    this.column         = column
    this.operator       = operator
    this.value          = value
    this.__negated      = false
    this.__or           = false
    this.wrapped        = false
    this['@@knex/hook'] = 'clause:having'
  }

  [iterSymbol]() {
    return iterator([
      this.__or ? OR : AND,
      this.__negated ? NOT : undefined,
      identifier(this.column),
      this.operator,
      parameter(this.value)      
    ])
  }

}

export class HavingIterable {
  constructor(havings) {
    this.clauses = havings
    this['@@knex/hook'] = 'clause:havings'
  }
  [iterSymbol]() {
    return new WhereHavingIterator(this.clauses, HAVING)
  }
}

export class GroupedHavingIterable extends HavingIterable {
  [iterSymbol]() {
    return lazySeq(wrap, new WhereHavingIterator(this.clauses))
  }
}

export class GroupingIterable {
  constructor(value) {
    this.groupings = value
    this['@@knex/hook'] = 'clause:grouping'
  }
  [iterSymbol]() {
    if (!this.groupings) return iterdone
    return iterator([GROUP_BY, columnize(this.groupings)])
  }
}

export class JoinIterable {
  [iterSymbol]() {
    return iterator([])
  }
}

export class GroupedJoinIterable extends JoinIterable {

}


export class LimitIterable {
  constructor(value) {
    this.value = value
    this['@@knex/hook'] = 'clause:limit'
  }
  [iterSymbol]() {
    if (this.value === undefined) return iterdone
    return iterator([LIMIT, parameter(this.value)])
  }
}


class WhereHavingIterator {

  constructor(clauses, keyword) {
    this.clauses = clauses
    this.keyword = keyword
    this.seen    = false
    this.idx     = 0
  }

  next() {
    if (!this.clauses || this.idx >= this.clauses.length) return {done: true, value: undefined}
    if (!this.seen) {
      this.seen = true
      return {done: false, value: [this.keyword, lazySeq(drop(1), this.clauses[this.idx++])]}
    }
    return {done: false, value: this.clauses[this.idx++]}
  }
 
}


class ClauseIterable {

  [iterSymbol]() {
    return new ClauseIterator(this.value)
  }

}

class ClauseIterator {
  
  constructor(value) {
    this.value = value
    this.idx   = 0
  }

  next() {
    if (!this.value || this.idx >= this.value.length) return {done: true, value: undefined}
    return {done: false, value: this.value[this.idx++]}
  }

}

export class FromIterable extends ClauseIterable {
  
  constructor(value) {
    super()
    if (value === undefined) {
      throw new Error('Missing "from" clause in Query Statement')
    }
    this.idx            = 0
    this.value          = [FROM, knexFlatten(map(v => identifier(v)), value)]
    this.distinct       = false
    this.alias          = undefined
    this.complete       = !!value
    this['@@knex/hook'] = 'clause:from'
  }
  
}

export class OffsetIterable {

  constructor(value) {
    this.value = value
    this['@@knex/hook'] = 'clause:offset'
  }

  [iterSymbol]() {
    if (!this.value) return iterdone
    return iterator([OFFSET, parameter(this.value)])
  }

}

export class QueryIterable {

  constructor(container) {
    this.container      = container
    this['@@knex/hook'] = 'statement:select'
  }

  [iterSymbol]() {
    let t = this.container
    return iterator([
      SELECT,
      t.has('distinct') ? DISTINCT : undefined,
      new ColumnIterable(t.get('columns')),
      new FromIterable(t.get('table')),
      new WhereIterable(t.get('wheres')),
      new JoinIterable(t.get('joins')),
      new UnionsIterable(t.get('unions')),
      new GroupingIterable(t.get('groupings')),
      new HavingIterable(t.get('havings')),
      new OrderingIterable(t.get('orderings')),
      new LimitIterable(t.last('limit')),
      new OffsetIterable(t.last('offset'))
    ])
  }

}

export class SubQueryIterable extends QueryIterable {

  [iterSymbol]() {
    return iterator([LEFT_PAREN, super[iterSymbol](), RIGHT_PAREN])
  }

}

export class UnionQueryIterable extends QueryIterable {

  constructor(container) {
    super(container)
    this['@@knex/hook'] = 'statement:unionQuery'
  }

}

export class DeleteIterable {

  constructor(elements) {
    this.elements       = elements
    this['@@knex/type'] = 'statement:delete'
  }

  [iterSymbol]() {
    let {table} = this.elements.single
    return iterator([DELETE_FROM, table])
  }

}

class UpdateIterable {

  constructor(elements) {
    this.elements       = elements
    this['@@knex/hook'] = 'statement:update'
  }

  [iterSymbol]() {
    return iterator([UPDATE, table, new WhereIterable(wheres)])
  }

}

class TruncateIterable {

  constructor(elements) {
    this.elements = elements
    this['@@knex/hook'] = 'statement:truncate'
  }

  [iterSymbol]() {
    let {table}  = this.elements.single
    return iterator([TRUNCATE, table])
  }

}

export class InsertIterable {

  constructor(elements) {
    this.elements       = elements
    this['@@knex/hook'] = 'expression:insert'
  }

  [iterSymbol]() {
    let {table} = this.elements.single
    return iterator([INSERT_INTO, new TableIterable(table)])
  }

}
