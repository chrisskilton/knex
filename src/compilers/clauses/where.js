import {isArray} from 'lodash/lang'
import {LEFT_PAREN, RIGHT_PAREN}  from '../../sql/delimiters'
import {AND, OR, NOT, WHERE} from '../../sql/keywords'
import {identifier as i} from '../../sql/identifier'
import {parameter as p} from '../../sql/parameter'
import {dropFirstClause} from '../../transducers/drop-first-clause'

export class WhereClauseCompiler {

  constructor(where) {
    this.where = where
  }

  // [WHERE | AND | OR] [NOT] [EXISTS | BETWEEN | IN] value

  compile() {
    let {where} = this
    return [
      where.__or ? OR : AND,
      where.__negated ? NOT : undefined,
      i(where.column),
      where.operator,
      p(where.value)
    ]
  }

}


export class WhereCompiler {

  constructor(wheres) {
    this.wheres = wheres
  }

  compile() {
    return dropFirstClause(WhereClauseCompiler, this.wheres)
  }

}

export class GroupedWhereCompiler extends WhereCompiler {


}
