// Raw
// -------
import {AbstractBuilder}   from './abstract'
import {raw}               from '../sql'
import {mixin}             from '../helpers'
import {runnableInterface} from '../interfaces'

export class RawBuilder extends AbstractBuilder {
  
  set(sql, bindings) {
    this.sql = raw(sql, bindings)
  }

  // Wraps the current sql with `before` and `after`.
  wrap(prefix, suffix) {
    this.prefix = prefix
    this.suffix = suffix
    return this
  }

  compile() {
    return [this.prefix, this.sql, this.suffix]
  }

}

mixin(RawBuilder, runnableInterface)
