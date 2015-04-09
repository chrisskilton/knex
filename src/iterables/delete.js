import {DELETE_FROM}  from '../sql/keywords'
import {iterator, iterSymbol}     from 'transduce'

export class DeleteIterable {

  constructor(elements) {
    this.elements       = elements
    this['@@knex/type'] = 'statement:delete'
  }

  [iterSymbol]() {
    let {table} = this.elements.single
    return iterator([DELETE_FROM, table])
  }

}
