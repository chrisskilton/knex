import {FROM}     from '../../sql/keywords'
import {iterator, iterSymbol} from 'transduce'
import {ClauseIterable} from './abstract'

export class FromIterable extends ClauseIterable {
  
  constructor(value) {
    this.idx            = 0
    this.value          = [FROM, value]
    this.distinct       = false
    this.alias          = undefined
    this.complete       = !!value
    this['@@knex/hook'] = 'clause:from'
  }
  
}
