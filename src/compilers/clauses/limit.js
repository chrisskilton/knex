import {LIMIT} from '../../sql/keywords'

export class LimitCompiler {

  constructor(value) {
    this.value = value
    this.type  = 'clause:limit'
  }

  compile() {
    if (!this.value) return
    return [LIMIT, this.value]
  }

}
