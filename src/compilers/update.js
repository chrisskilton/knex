import {UPDATE}        from '../sql/keywords'
import {WhereCompiler} from './clauses/where'
import {iterator, iterSymbol}      from 'transduce'

class UpdateCompiler {

  constructor(elements) {
    this.elements = elements
    this.type     = 'updateStatement'
  }

  [iterSymbol]() {
    return iterator([UPDATE, table, new WhereCompiler(wheres)])
  }

}
