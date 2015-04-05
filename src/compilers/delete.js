import {TRUNCATE}  from '../../sql/constants'

export class DeleteCompiler {

  constructor(elements) {
    this.elements = elements
    this.type     = 'deleteStatement'
  }

  compile() {
    let {table} = this.elements.single
    return [DELETE_FROM, table]
  }

}
