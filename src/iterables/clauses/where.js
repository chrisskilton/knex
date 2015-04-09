import isArray from 'lodash/lang/isArray'
import forEach from 'lodash/collection/forEach'
import {map, protocols, Transducer, lazySeq, iterator, iterSymbol} from 'transduce'
import {LEFT_PAREN, RIGHT_PAREN}   from '../../sql/delimiters'
import {AND, OR, NOT, WHERE}       from '../../sql/keywords'
import {identifier as i}           from '../../sql/identifier'
import {parameter as p}            from '../../sql/parameter'
import {WhereHavingIterable}       from './abstract'

const {transducer: {step: tStep, result: tResult}} = protocols

export class WhereClauseIterable {

  constructor(where) {
    this.where = where
    this['@@knex/hook'] = 'clause:where'
  }

  // [WHERE | AND | OR] [NOT] [EXISTS | BETWEEN | IN] value

  [iterSymbol]() {
    let {where} = this
    if (isArray(where)) {
      return lazySeq(map((val) => new WhereClauseIterable(val)), where)
    }
    return iterator([
      where.__or ? OR : AND,
      where.__negated ? NOT : undefined,
      i(where.column),
      where.operator,
      p(where.value)
    ])
  }

}

export class WhereIterable extends WhereHavingIterable {

  constructor(wheres) {
    super(WHERE, WhereClauseIterable)
    this.clauses = wheres
    this['@@knex/hook'] = 'clause:wheres'
  }

}

export class GroupedWhereIterable extends WhereHavingIterable {

  constructor(wheres) {
    super(undefined, WhereClauseIterable)
    this.clauses = wheres
    this['@@knex/hook'] = 'clause:groupedWheres'
  }
  
  [iterSymbol]() {
    return lazySeq(wrap, super[iterSymbol]())
  }

}

class Wrapping extends Transducer {

  constructor(xf) {
    super(xf)
    this.buffered = []
  }

  [tStep](result, value) {
    this.buffered.push(value)
    return result
  }

  [tResult](result) {
    if (this.buffered.length > 0) {
      result = this.xfStep(result, LEFT_PAREN)
      forEach(this.buffered, (val) => {
        result = this.xfStep(result, val)
      })
      result = this.xfStep(result, RIGHT_PAREN)
    }
    return this.xfResult(result)
  }

}

const wrap = (xf) => {
  return new Wrapping(xf)
}
