import {whereIter}   from '../iterators'
import {INSERT_INTO} from '../../sql/constants'

export class InsertCompiler {

  constructor(elements) {
    this.elements = elements
    this.type     = 'insertStatement'
  }

  compile() {
    let {table} = this.elements.single
    return [INSERT_INTO, new TableCompiler(table)]
  }

}
