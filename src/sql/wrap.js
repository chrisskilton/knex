import {LEFT_PAREN, RIGHT_PAREN} from './delimiters'
import {iterSymbol, iterator} from 'duce'

class Wrapped {
  constructor(value, prefix, suffix) {
    this.prefix = prefix
    this.value  = value
    this.suffix = suffix
    this['@@knex/hook'] = 'wrappedValue'
  }
  [iterSymbol]() {
    return iterator([this.prefix, this.value, this.suffix])
  }
}
export function wrap(value, prefix = LEFT_PAREN, suffix = RIGHT_PAREN) {
  return new Wrapped(value, prefix, suffix)
}
