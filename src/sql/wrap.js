import {LEFT_PAREN, RIGHT_PAREN} from './keywords'

class Wrapped {
  constructor(value, prefix, suffix) {
    this.prefix = prefix
    this.value  = value
    this.suffix = suffix
    this.type   = 'wrapped'
  }
  compile() {
    return [this.prefix, this.value, this.suffix]
  }
}
export function wrap(value, prefix = LEFT_PAREN, suffix = RIGHT_PAREN) {
  return new Wrapped(value, prefix, suffix)
}
