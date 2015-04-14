import {isNull, isArray, isString, isNumber} from 'lodash/lang'

import {QueryIterable, InsertIterable, 
  DeleteIterable, UpdateIterable} from '../iterables'
import camelCase        from 'lodash/string/camelCase'

import {isIterable, isIterator, filter, iterSymbol, lazySeq, interpose, 
  into, map, Transducer, transducer, iterator, compose, 
  protocols, FlattenIterator
} from 'duce'

const {step: tStep, result: tResult} = protocols.transducer

export const IIterable = {
  [iterSymbol]() {
    return compileFrom(this)
  }
}

function compileFrom(builder) {
  let {container} = builder
  let hooks       = builder.hooks
  let iter        = builder.__iterator 
    ? builder.__iterator() 
    : iterator(compileTarget(container))
  return sqlSeq(hooks, iter)
}

function compileTarget(container) {
  switch (container.last('statementType')) {
    case 'select': return new QueryIterable(container)
    case 'update': return new UpdateIterable(container)
    case 'delete': return new DeleteIterable(container)
    case 'insert': return new InsertIterable(container)
  }
}

// The root seq takes a "transducer",
// and returns a lazy iterator.
function sqlSeq(hooks, iterator) {
  return lazySeq(pipeline(hooks), new RootIterator(hooks, iterator))
}

class RootIterator extends FlattenIterator {

  constructor(hooks, iterator) {
    super(iterator)
    this.hooks = hooks || new Map()
  }

  __next(value) {
    if (value && value['@@knex/hook']) {
      var hookName = value['@@knex/hook']
      var name     = camelCase(hookName)
      if (this.hooks.has(name)) {
        let hookToRun  = this.hooks.get(name)
        let otherHooks = this.hooks.rest(name)
        value = hookToRun(value, otherHooks)        
      }
    }
    return super.__next(value)
  }

}

const buffer = n => xf => new Buffered(n, xf)

class Buffered extends Transducer {

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
    while(this.buffer.length > 0) {
      result = this.xfStep(result, this.buffer)
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
    if (value.length > 1 && a['@@knex/spacing'] !== 'OMIT_FOLLOWING' && 
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

const undef = (val) => val !== undefined

function flattenIterator() {

}

function hook(name, hooks) {
  if (hooks.has(name)) {
    let hookToRun  = hooks.get(name)
    let otherHooks = hooks.rest(name)
    return map((val) => {
      return hookToRun(val, otherHooks)
    })
  }
}

function pipeline(hooks) {

  var toCompose = [

    filter(undef),

    hook('beforeSpace', hooks),

    addSpaces,

    hook('afterSpace', hooks),

    map((val) => {
      if (val['@@knex/value']) {
        return val['@@knex/value']
      }
      return val
    })

  ]

  return compose(...toCompose.filter(undef))

}