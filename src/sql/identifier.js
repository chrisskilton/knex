
class Identifier {
  constructor(value) {
    this.value = value
    this.type  = 'identifier'
  }
  compile() {
    return "'" + this.value + "'"
  }
}

export function identifier(value) {
  return new Identifier(value)
}