
class Identifier {
  constructor(value) {
    this['@@knex/value'] = value
    this['@@knex/hook']  = 'identifier'
  }
}

export function identifier(value) {
  if (typeof value !== 'string') {
    return value
  }
  return new Identifier(value)
}