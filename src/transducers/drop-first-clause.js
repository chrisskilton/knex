import {Transducer, drop, lazySeq} from 'transduce'

class DropFirst extends Transducer {

  constructor(val) {
    this.val  = val
    this.type = val.type
  }

  compile() {
    return lazySeq(drop(1), this.val)
  }

}

export const dropFirstClause(Ctor, prefix, values) {
  var seen;
  return lazySeq(transducer((step, value, input) => {
    if (input && !seen) {
      seen = true
      return step(value, [prefix, new DropFirst(new Ctor(input))])
    } else if (input) {
      return step(value, new Ctor(input))
    }
    return value
  }), values)
}
