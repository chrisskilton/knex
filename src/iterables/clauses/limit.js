import {LIMIT} from '../../sql/keywords'
import {iterSymbol, iterator, iterdone} from 'transduce'

export class LimitIterable {

  constructor(value) {
    this.value = value
    this['@@knex/hook'] = 'clause:limit'
  }

  [iterSymbol]() {
    if (!this.value) return iterdone
    return iterator([LIMIT, this.value])
  }

}
