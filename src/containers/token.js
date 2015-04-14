import each   from 'lodash/collection/each'
import last   from 'lodash/array/last'
import {into, iterSymbol} from 'duce'

export default class TokenContainer {

  // This map contains things like:
  // wheres, joins, columns, unions, havings, orders, groupings, 
  // updates, options, hooks
  constructor() {
    this.tokens = Object.create(null)
    this.tokens.statementType = ['select']
  }

  has(key) {
    return !!this.tokens[key]
  }

  get(key) {
    return this.tokens[key]
  }

  add(key, value) {
    if (Array.isArray(value)) {
      each(value, (val) => this.add(key, val))
    } else {
      if (!this.has(key)) {
        this.tokens[key] = []
      }
      this.tokens[key].push(value)      
    }
    return this
  }

  last(key) {
    if (!this.has(key)) return
    return last(this.tokens[key])
  }

  toJS() {
    return into({}, this.tokens)
  }

}
