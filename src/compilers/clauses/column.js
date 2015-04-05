import {isArray} from 'lodash'
import {COMMA} from '../../sql/delimiters'
import {_ALL_} from '../../sql/keywords'
import {identifier as i} from '../../sql/identifier'

import interpose from '../../transducers/interpose'
import sequence from '../../transducers/sequence'
import {compose, map, filter, transducer} from 'transduce'

var pipeline = compose(
  transducer((step, result, value) => {
    
    debugger
    // TODO: This should be easier to construct, 
    // should be able to compose LazyTransformers easier
    if (isArray(value)) {
      for (let val of value) {
        result = step(result, val)
      }
      return result
    }
  
    return step(result, value)
  }),
  map((value) => i(value)),
  filter((value) => value !== undefined),
  interpose(COMMA)
)

export class ColumnCompiler {

  constructor(columns) {
    this.columns = columns
  }

  compile() {
    if (this.columns.length === 0) {
      return _ALL_
    }
    return sequence(pipeline, this.columns)
  }

}