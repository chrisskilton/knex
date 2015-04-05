import {OFFSET} from '../../sql/keywords'

export class OffsetCompiler {

  constructor(value) {
    this.value = value
    this.type  = 'clause:offset'
  }

  compile() {
    if (!this.value) return
    return [OFFSET, this.value]
  }

}

