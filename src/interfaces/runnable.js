import {reduce, iterator} from 'transduce'
import {escapeParam} from '../sql/string'

export const IRunnable = {

  addHook(name, fn) {
    this.hooks.addHook(name, fn)
    return this
  },

  removeHook(name) {
    this.hooks.removeHook(name)
    return this
  },

  addHooks(obj) {
    for (let [k, v] of iterator(obj)) {
      this.addHook(k, v)
    }
    return this
  },

  withHook(name, fn, toRun) {
    this.hooks.addHook(name, fn)
    var val = toRun()
    this.hooks.removeHook(name)
    return val
  },

  transacting(trx) {
    this._transacting = trx
    return this
  },

  debug(bool = true) {
    return clauses(this, modifier('debug', bool), true)
  },

  options(opts) {
    this.container.set('options', opts)
    return this
  },

  // "Then" interface only works when there's an "engine" specified.
  then() {
    if (!this.engine) {
      throw new Error('Cannot call "then" on a builder without an engine')
    }

    // Eventually this will become the value of the promise,
    // for now it's used to signal a warning when we've tried using a
    // clause as both a promise and later as a value.
    if (!this._promise) {
      this._promise = true
    }

    var running = this.engine.run(this)
    return running.then.apply(running, arguments)
  },

  // Functional: 

  map(...args) {
    return this.then().map(...args)
  },

  reduce(...args) {
    return this.then().reduce(...args)
  },

  // Promises:

  bind() {
    return this.then().bind(...arguments)
  },

  spread() {
    return this.then().spread(...arguments)
  },
  
  tap() {
    return this.then().tap(...arguments)
  },

  yield() {
    deprecated('yield', 'return')
    return this.return(...arguments)
  },

  thenReturn() {
    return this.return(...arguments)
  },

  return() {
    return this.then().return(...arguments)
  },

  otherwise() {
    deprecated('otherwise', 'catch')
    return this.catch(...arguments)
  },

  catch() {
    return this.then().catch(...arguments)
  },

  ensure() {
    deprecated('ensure', 'finally')
    return this.finally(...arguments)
  },

  finally() {
    return this.then().finally(...arguments)
  },

  // Callbacks:

  exec() {
    console.log('Knex: .exec is deprecated, please use .asCallback')
  },

  asCallback(cb) {
    return this.then().asCallback(cb)
  },

  nodeify(cb) {
    deprecate('nodeify', 'asCallback')
    return this.asCallback(cb)
  },

  // Streams:

  toStream() {
    return engine(this, 'toStream').toStream()
  },

  toString() {
    var beforeSpace = (val) => {
      if (val && val['@@knex/hook'] === 'parameter') {
        return escapeParam(val['@@knex/value'])
      }
      return val
    }
    var sql = ''
    this.withHook('beforeSpace', beforeSpace, () => {
      for (let val of this) {
        sql += val
      }
    })
    return sql
  },

  pipe() {
    
  },

  toQuery() {
    return this.toString()
  },

  toSQL() {
    if (!this.engine) {
      throw new Error('.toSQL cannot be run without an "engine')
    }
    return this.engine.builderToSQL(this)
  }

}
