import {isArray} from 'lodash'
import {COMMA} from '../../sql/delimiters'
import {_ALL_} from '../../sql/keywords'
import {identifier as i} from '../../sql/identifier'
import {lazySeq, iterator, compose, map, filter, 
  into, transducer, interpose, iterSymbol, FlattenIterator} from 'transduce'

var pipeline = compose(
  map((value) => i(value)),
  filter((value) => value !== undefined),
  interpose(COMMA)
)

export class ColumnIterable {

  constructor(columns = []) {
    this.columns = columns
    this['@@knex/hook'] = 'columns'
  }

  [iterSymbol]() {
    if (this.columns.length === 0) {
      return iterator([_ALL_])
    }
    return lazySeq(pipeline, new FlattenIterator(iterator(this.columns), () => {
      debugger
    }))
  }

}