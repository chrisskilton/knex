import {QueryIterable}  from '../iterables/query'
import {InsertIterable} from '../iterables/insert'
import {DeleteIterable} from '../iterables/delete'
import {UpdateIterable} from '../iterables/update'
import camelCase        from 'lodash/string/camelCase'

import {isIterable, isIterator, filter, iterSymbol, lazySeq, interpose, 
  into, map, Transducer, transducer, iterator, compose, 
  protocols, FlattenIterator
} from 'transduce'

const {step: tStep, result: tResult} = protocols.transducer

import {isNull, isArray, isString, isNumber} from 'lodash/lang'

export const IIterable = {
  [Symbol.iterator]() {
    return compileFrom(this)
  }
}

function compileFrom(builder) {
  let {container} = builder
  let hooks       = container.get('hooks')
  return sqlSeq(hooks, iterator(compileTarget(container)))
}

function compileTarget(container) {
  switch (container.last('statementType')) {
    case 'select': return new QueryIterable(container)
    case 'update': return new UpdateIterable(container)
    case 'delete': return new DeleteIterable(container)
    case 'insert': return new InsertIterable(container)
  }
}

const COMPLETED = {}
const DONE      = {done: true,  value: undefined}
const SPACE     = {done: false, value: ' '}

// The root seq takes a "transducer",
// and returns a lazy iterator.
function sqlSeq(hooks, iterator) {
  return lazySeq(pipeline, new RootIterator(hooks, iterator))
}


class RootIterator extends FlattenIterator {

  constructor(hooks, iterator) {
    super(iterator)
    this.hooks = hooks || new Map()
  }

  __next(value) {
    if (value && value['@@knex/hook']) {
      var hookName  = value['@@knex/hook']
      var camelized = camelCase(hookName)
      if (this.hooks.has(camelized)) {
        var hook = first(hooks.get(camelized))
      }
    }
    return super.__next(value)
  }

}

const buffer = n => xf => new Buffer(n, xf)

class Buffer extends Transducer {

  constructor(n, xf) {
    super(xf)
    this.n      = n
    this.buffer = []
  }

  [tStep](result, value) {
    this.buffer.push(value)
    if (this.buffer.length === 3) {
      return this.xfStep(result, this.buffer)
    }
    return result
  }

  [tResult](result) {
    if (this.buffer.length > 0) {
      var buffer  = this.buffer
      this.buffer = []
      result = this.xfStep(result, buffer)
    }
    return this.xfResult(result)
  }

}

class AddSpaces extends Transducer {

  constructor(xf) {
    super(xf)
    this.started      = false
    this.pendingSpace = false
  }

  [tStep](result, value) {
    let [a, b] = value
    let pendingSpace  = this.pendingSpace
    this.pendingSpace = false
    if (pendingSpace) {
      result = this.xfStep(result, ' ')
    }
    if (a['@@knex/spacing'] !== 'OMIT_FOLLOWING' && 
        b['@@knex/spacing'] !== 'OMIT_PRECEDING') {
      this.pendingSpace = true
    }
    return this.xfStep(result, value.shift())
  }

}

const addSpaces = compose(
  buffer(3),
  (xf) => new AddSpaces(xf)
)

const pipeline = compose(

  filter((val) => val !== undefined),
  
  addSpaces,

  map((val) => {
    if (val['@@knex/value']) {
      return val['@@knex/value']
    }
    return val
  })

)
