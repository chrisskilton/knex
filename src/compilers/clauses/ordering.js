import {ORDER_BY} from '../../sql/keywords'

export class OrderingCompiler {

  constructor(value) {
    this.value = value
    this.type  = 'clause:order'
  }

  ['@@knex/compile']() {
    if (!this.value) return
    return [ORDER_BY, value]
  }

}