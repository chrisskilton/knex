// TRUNCATE [ TABLE ] [ ONLY ] name [ * ] [, ... ]
//     [ RESTART IDENTITY | CONTINUE IDENTITY ] [ CASCADE | RESTRICT ]

import {TRUNCATE}  from '../sql/keywords'
import {iterator, iterSymbol}  from 'transduce'

class TruncateIterable {

  constructor(elements) {
    this.elements = elements
    this['@@knex/hook'] = 'statement:truncate'
  }

  [iterSymbol]() {
    let {table}  = this.elements.single
    return iterator([TRUNCATE, table])
  }

}
