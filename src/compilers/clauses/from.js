import {FROM}     from '../../sql/keywords'
import {iterable, iterSymbol} from 'transduce'

export class FromCompiler {
  
  constructor(value) {
    this.value          = value
    this.distinct       = false
    this.alias          = undefined
    this['@@knex/hook'] = 'clause:from'
  }
  
  ['@@knex/compile']() {
    return iterable([FROM, this.value])
  }
}
