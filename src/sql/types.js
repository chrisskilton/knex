
class Type {
  constructor(type, value) {
    this['@@knex/hook']  = `types:${type}`
    this['@@knex/value'] = value
  }
}

export function bool(value) {
  return new Type('boolean', value)
}