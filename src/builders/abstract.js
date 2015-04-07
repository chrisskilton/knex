import forEach from 'lodash/collection/forEach'
import isArray from 'lodash/lang/isArray'
import {into}  from 'transduce'
import TokenContainer from '../container'
import {EventEmitter} from 'events'

export class AbstractBuilder extends EventEmitter {

  constructor(engine) {
    super()
    this.engine    = engine
    this.container = new TokenContainer()

    // Internal flags used in the builder.
    this.__boolFlag = false  // false === and, true === or
    this.__notFlag  = false  // true  === not
    this.__cache    = false
  }

  compile() {
    if (this._promise) {
      warn(`Future versions of Knex will use .then properly to make an A+ compliant promise`)
    }
    if (this.__cache) return this.__cache
    this.__cache = []

    for (var item of this.elements) {
      this.__cache.push(item)
    }
    return this.__cache
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

  // Deprecated:

  // Create a shallow clone of the current query builder.
  clone() {
    console.log('Builder.clone is deprecated, you can now compose queries using the knex.sql functions')
    var cloned = new this.constructor()
    cloned._method      = this._method
    cloned._transacting = this._transacting
    return cloned
  }

}
