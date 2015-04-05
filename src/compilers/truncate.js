// TRUNCATE [ TABLE ] [ ONLY ] name [ * ] [, ... ]
//     [ RESTART IDENTITY | CONTINUE IDENTITY ] [ CASCADE | RESTRICT ]

import {TRUNCATE}  from '../../sql/constants'

class TruncateCompiler {

  constructor(elements) {
    this.elements = elements
    this.type     = 'truncateStatement'
  }

  compile() {
    let {table}  = this.elements.single
    return [
      TRUNCATE, table
    ]
  }

}
