import {isArray} from 'lodash'
import {COMMA} from '../../sql/delimiters'
import {_ALL_} from '../../sql/keywords'
import {identifier as i} from '../../sql/identifier'
import {seq, compose, map, filter, into, transducer, interpose, iterSymbol} from 'transduce'

var pipeline = compose(
  transducer((step, result, value) => {
    if (isArray(value)) return into(result, pipeline, value)
    return step(result, value)
  }),
  map((value) => i(value)),
  filter((value) => value !== undefined),
  interpose(COMMA)
)

export class ColumnCompiler {

  constructor(columns) {
    this.columns = columns
    this['@@knex/hook'] = 'columns'
  }

  [iterSymbol]() {
    if (this.columns.length === 0) {
      return _ALL_
    }
    return seq(pipeline, this.columns)
  }

}