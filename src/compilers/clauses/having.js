import {LEFT_PAREN, RIGHT_PAREN}  from '../../sql/delimiters'

export class HavingCompiler {

  compile() {
    
  }

}

export class GroupedHavingCompiler extends HavingCompiler {

  compile() {
    return [LEFT_PAREN, dropFirstClause(HavingCompiler, this.havings), RIGHT_PAREN]
  }

}
