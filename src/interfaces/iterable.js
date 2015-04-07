import {isIterable, iterSymbol, seq, into, map, transducer, iterator, compose} from 'transduce'
import {isNull, isArray, isString, isNumber} from 'lodash/lang'

export const IIterable = {
  [Symbol.iterator]() {
    return compileFrom(this)
  }
}

import {QueryCompiler}  from '../compilers/query'
import {InsertCompiler} from '../compilers/insert'
import {DeleteCompiler} from '../compilers/delete'
import {UpdateCompiler} from '../compilers/update'

function compileFrom(builder) {
  let {container} = builder
  let hooks       = container.get('hooks')
  return seq(
    compose(compiler(hooks), addSpace()),
    iterator(compileTarget(container))
  )
}

function compileTarget(container) {
  switch (container.last('statementType')) {
    case 'select': return new QueryCompiler(container)
    case 'update': return new UpdateCompiler(container)
    case 'delete': return new DeleteCompiler(container)
    case 'insert': return new InsertCompiler(container)
  }
}

const COMPLETED = {}
const DONE      = {done: true,  value: undefined}
const SPACE     = {done: false, value: ' '}

function compiler(hooks) {
  var pipeline = compose(
    transducer((step, result, value) => {
      // Check hooks...
      if (isIterable(value)) {
        debugger
        return into(result, pipeline, iterator(value))
      }
      return step(result, value)
    })
  )
  return pipeline
}

function addSpace() {
  return (xf) => {
    return transducer(
      (step, result, value) => {
        result = step(result, ' ')
        return step(result, value)
      }
    )(xf)
  }
}
