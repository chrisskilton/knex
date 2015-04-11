import {OFFSET} from '../../sql/keywords'
import {iterSymbol, iterator, iterdone} from 'transduce'

export class OffsetIterable {

  constructor(value) {
    this.value = value
    this['@@knex/hook'] = 'clause:offset'
  }

  [iterSymbol]() {
    if (!this.value) return iterdone
    return iterator([OFFSET, this.value])
  }

}

