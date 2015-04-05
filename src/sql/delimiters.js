
class Delimiter {
  constructor(value) {
    this.value = value
    this.type  = 'delimiter'
  }
  compile() {
    return this.value
  }
}

function delimiter(value) {
  return new Delimiter(value)
}

export var COMMA       = delimiter(',')
export var SEMICOLON   = delimiter(';')
export var LEFT_PAREN  = delimiter('(')
export var RIGHT_PAREN = delimiter(')')