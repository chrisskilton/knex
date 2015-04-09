import {ORDER_BY} from '../../sql/keywords'
import {iterSymbol, iterator, iterdone} from 'transduce'

export class OrderingIterable {

  constructor(value) {
    this.value = value
    this['@@knex/hook'] = 'clause:order'
  }

  [iterSymbol]() {
    if (!this.value) return iterdone
    return iterator([ORDER_BY, value])
  }

}