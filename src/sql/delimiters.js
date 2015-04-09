
class Delimiter {
  constructor(value, spacing) {
    this['@@knex/hook']    = 'delimiter'
    this['@@knex/value']   = value
    this['@@knex/spacing'] = spacing
  }
}

function delimiter(value, spacing) {
  return new Delimiter(value, spacing)
}

export var COMMA       = delimiter(',', 'OMIT_PRECEDING')
export var SEMICOLON   = delimiter(';', 'OMIT_PRECEDING')
export var LEFT_PAREN  = delimiter('(', 'OMIT_FOLLOWING')
export var RIGHT_PAREN = delimiter(')', 'OMIT_PRECEDING')