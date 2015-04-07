import {GROUP_BY} from '../../sql/keywords'
import {iterable, iterSymbol, itercomplete} from 'transduce'

export class GroupingCompiler {

  constructor(value) {
    this.groupings = value
  }

  [iterSymbol]() {
    if (!this.groupings) return itercomplete
    return iterable([GROUP_BY, this.groupings])
  }

}