import {transducer, drop, seq} from 'transduce'

class DropFirst {

  constructor(val) {
    this.val  = val
    this.type = val.type
  }

  compile() {
    return sequence(drop(1), this.val.compile())
  }

}

export function dropFirstClause(Ctor, prefix, values) {
  var seen;
  return seq(transducer((step, value, input) => {
    if (input && !seen) {
      seen = true
      return step(value, [prefix, new DropFirst(new Ctor(input))])
    } else if (input) {
      return step(value, new Ctor(input))
    }
    return value
  }), values)
}
