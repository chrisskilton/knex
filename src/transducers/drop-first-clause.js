import sequence from './sequence'
import {transducer, drop} from 'transduce'
import {WHERE}  from '../sql/keywords'

class DropFirst {

  constructor(val) {
    this.val  = val
    this.type = val.type
  }

  compile() {
    return sequence(drop(1), this.val.compile())
  }

}

export function dropFirstClause(Ctor, values) {
  var seen;
  return sequence(transducer((step, value, input) => {
    if (input && !seen) {
      seen = true
      return step(value, [WHERE, new DropFirst(new Ctor(input))])
    } else if (input) {
      return step(value, new Ctor(input))
    }
    return value
  }), values)
}
