import {UPDATE}        from '../sql/keywords'
import {WhereIterable} from './clauses/where'
import {iterator, iterSymbol}      from 'transduce'

class UpdateIterable {

  constructor(elements) {
    this.elements       = elements
    this['@@knex/hook'] = 'statement:update'
  }

  [iterSymbol]() {
    return iterator([UPDATE, table, new WhereIterable(wheres)])
  }

}
