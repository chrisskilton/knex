import {GROUP_BY} from '../../sql/keywords'
import {iterable, iterSymbol, iterdone} from 'transduce'

export class GroupingIterable {

  constructor(value) {
    this.groupings = value
    this['@@knex/hook'] = 'clause:grouping'
  }

  [iterSymbol]() {
    if (!this.groupings) return iterdone
    return iterable([GROUP_BY, this.groupings])
  }

}
