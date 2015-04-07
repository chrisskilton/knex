// Raw
// -------
import {EventEmitter} from 'events'
import _              from 'lodash'
import {raw}          from './sql'
import {IRunnable}    from './interfaces/runnable'
import {mixin}        from './helpers'
import {wrap}         from './sql/wrap'

export default class Raw extends EventEmitter {
  
  constructor(engine) {
    super()
    this.engine = engine
    this.sql    = null
  }

  set(sql, bindings) {
    this.sql = raw(sql, bindings)
    return this
  }

  // Wraps the current sql with `before` and `after`.
  wrap(prefix, suffix) {
    this.sql = wrap(this.sql, prefix, suffix)
    return this
  }

}

mixin(Raw, IRunnable)