// Raw
// -------
import {iterSymbol, iterator} from 'duce'
import {AbstractBuilder}      from './abstract'
import {raw}                  from '../sql'
import {mixin}                from '../helpers'
import {IRunnable, IIterable} from '../interfaces'
import {HookContainer}        from '../containers/hooks'

export class RawBuilder extends AbstractBuilder {

  constructor(engine) {
    super(engine)
    this.hooks = new HookContainer()
  }

  set() {
    this.raw = raw(...arguments)
    return this
  }

  // Wraps the current sql with `before` and `after`.
  wrap(prefix, suffix) {
    this.prefix = prefix
    this.suffix = suffix
    return this
  }

  __iterator() {
    return iterator([this.prefix, iterator(this.raw), this.suffix])
  }

}
mixin(RawBuilder, IIterable)
mixin(RawBuilder, IRunnable)