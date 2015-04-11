import {SubQueryBuilder} from '../builders/query'

class Identifier {
  constructor(value) {
    this['@@knex/value'] = value.trim()
    this['@@knex/hook']  = 'identifier'
  }
}

export function identifier(value) {
  if (typeof value === 'function') {
    var qb  = new SubQueryBuilder()
    var val = value.call(qb, qb) // TODO: check return val for builders
    return qb
  }
  if (typeof value !== 'string') {
    return value
  }
  return new Identifier(value)
}