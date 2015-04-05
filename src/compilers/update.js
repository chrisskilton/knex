import {UPDATE}        from '../../sql/constants'
import {whereIter}     from '../iterators'
import {WhereCompiler} from './clauses/where'

class UpdateCompiler {

  constructor(elements) {
    this.elements = elements
    this.type     = 'updateStatement'
  }

  compile() {
    return [UPDATE, table, new WhereCompiler(wheres)]
  }

}