import {isArray} from 'lodash/lang'
import {LEFT_PAREN, RIGHT_PAREN}   from '../../sql/delimiters'
import {AND, OR, NOT, WHERE}       from '../../sql/keywords'
import {identifier as i}           from '../../sql/identifier'
import {parameter as p}            from '../../sql/parameter'
import {dropFirstClause}           from '../../transducers'
import {map, seq, iterator, iterSymbol} from 'transduce'

export class WhereClauseCompiler {

  constructor(where) {
    this.where = where
    this['@@knex/type'] = 'clause:where'
  }

  // [WHERE | AND | OR] [NOT] [EXISTS | BETWEEN | IN] value

  [iterSymbol]() {
    let {where} = this
    if (isArray(where)) {
      return seq(map((val) => new WhereClauseCompiler(val)), where)
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

export class WhereCompiler {

  constructor(wheres) {
    this.wheres = wheres
  }

  ['@@knex/compile']() {
    return dropFirstClause(WhereClauseCompiler, WHERE, this.wheres)
  }

}

export class GroupedWhereCompiler extends WhereCompiler {

}
