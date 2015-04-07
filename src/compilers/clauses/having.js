import {LEFT_PAREN, RIGHT_PAREN}  from '../../sql/delimiters'

export class HavingCompiler {

  ['@@knex/compile']() {
    
  }

}

export class GroupedHavingCompiler extends HavingCompiler {

  ['@@knex/compile']() {
    return [LEFT_PAREN, dropFirstClause(HavingCompiler, this.havings), RIGHT_PAREN]
  }

}
