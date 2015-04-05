import {FROM} from '../../sql/keywords'

export class FromCompiler {
  
  constructor(value) {
    this.value    = value
    this.distinct = false
    this.alias    = undefined
    this.type     = 'column'
  }
  
  compile() {
    return [FROM, this.value]
  }
}

class FromClause {

  

}
