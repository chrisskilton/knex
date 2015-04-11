import {FROM}     from '../../sql/keywords'
import {map, iterSymbol} from 'transduce'
import {ClauseIterable} from './abstract'
import {identifier as i} from '../../sql/identifier'
import {knexFlatten} from '../../helpers'

export class FromIterable extends ClauseIterable {
  
  constructor(value) {
    super()
    this.idx            = 0
    this.value          = [FROM, knexFlatten(map(v => i(v)), value)]
    this.distinct       = false
    this.alias          = undefined
    this.complete       = !!value
    this['@@knex/hook'] = 'clause:from'
  }
  
}
