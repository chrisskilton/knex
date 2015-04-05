
class Parameter {
  constructor(value) {
    this.value = value
    this.type = 'parameter'
  }
  compile() {
    return this.value
  }
}

export function parameter(value) {
  return new Parameter(value)
}
