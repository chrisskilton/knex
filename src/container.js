import last from 'lodash/array/last'
import {into} from 'transduce'

export default class TokenContainer {

  // This map contains things like:
  // wheres, joins, columns, unions, havings, orders, groupings, 
  // updates, options, hooks
  constructor() {
    this.tokens = new Map([['statementType', ['select']]])
  }

  has(key) {
    return this.tokens.has(key)
  }

  get(key) {
    return this.tokens.get(key)
  }

  add(key, value) {
    if (!this.has(key)) {
      this.tokens.set(key, [])
    }
    this.tokens.get(key).push(value)
    return this
  }

  last(key) {
    if (!this.has(key)) return
    return last(this.tokens.get(key))
  }

  [Symbol.iterator]() {
    return this.tokens[Symbol.iterator]()
  }

  toJS() {
    return into({}, this.tokens)
  }

}
