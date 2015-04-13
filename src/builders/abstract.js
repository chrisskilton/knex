import {not, or} from '../helpers'
import TokenContainer from '../containers/token'
import {EventEmitter} from 'events'
import forEach from 'lodash/collection/forEach'

export class AbstractBuilder extends EventEmitter {

  constructor(engine) {
    super()
    this.engine     = engine
    this.container  = new TokenContainer()

    // Internal flags used in the builder.
    this.__boolFlag = false  // false === and, true === or
    this.__notFlag  = false  // true  === not
    this.__cache    = false
    this['@@knex/hook'] = 'builder'
  }

  // A few getters to make the chain look nice:

  get and() {
    this.__boolFlag = false
    return this
  }
  get or() {
    this.__boolFlag = true
    return this
  }
  get not() {
    this.__notFlag = true
    return this
  }

  // Public API Interfaces:

  toJS() {
    return this.container.toJS()
  }

  fromJS(obj) {
    const keys = Object.keys(obj)
    forEach(keys, (key) => {
      let val = obj[key]
      Array.isArray(val) ? this[key].apply(this, val) : this[key](val)
    })
    return this
  }  

  __clause(type, element) {
    
    this.__cache = false
    
    if (element === undefined) {
      this.__notFlag  = false
      this.__boolFlag = false
      return this
    }
    
    if (this.__notFlag) {
      this.__notFlag = false
      return this.__clause(type, not(element))
    }
    
    if (this.__boolFlag) {
      this.__boolFlag = false
      return this.__clause(type, or(element))
    }

    this.container.add(type, element)

    return this
  }

  // Deprecated: ??

  // Create a shallow clone of the current query builder.
  clone() {
    var cloned = new this.constructor()
    cloned._method      = this._method
    cloned._transacting = this._transacting
    return cloned
  }

}
AbstractBuilder.prototype['@@__KNEX_BUILDER__@@'] = true
