import {LEFT_PAREN, RIGHT_PAREN}  from '../../sql/delimiters'
import {iterSymbol, iterdone} from 'transduce'

export class HavingIterable {

  [iterSymbol]() {
    return iterdone
  }

}

export class GroupedHavingIterable extends HavingIterable {

  [iterSymbol]() {
    return [LEFT_PAREN, dropFirstClause(HavingIterable, this.havings), RIGHT_PAREN]
  }

}
