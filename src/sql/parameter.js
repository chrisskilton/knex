
class Parameter {
  constructor(value) {
    this['@@knex/value'] = value
    this['@@knex/hook']  = 'parameter'
  }
}

export function parameter(value) {
  if (value === undefined) {
    return value
  }
  return new Parameter(value)
}
