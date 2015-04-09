import {INSERT_INTO} from '../sql/keywords'
import {iterator, iterSymbol}    from 'transduce'

export class InsertIterable {

  constructor(elements) {
    this.elements       = elements
    this['@@knex/hook'] = 'expression:insert'
  }

  [iterSymbol]() {
    let {table} = this.elements.single
    return iterator([INSERT_INTO, new TableIterable(table)])
  }

}
