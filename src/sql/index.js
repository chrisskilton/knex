import {iterSymbol, isIterator, iterator, lazySeq, transducer} from 'transduce'
import {identifier as i} from './identifier'
import {AS, DISTINCT} from './keywords'
import {isPlainObject} from 'lodash/lang'

// ----------------

class Parameter {
  constructor(value) {
    this['@@knex/value'] = value
    this['@@knex/hook']  = 'parameter'
  }
}
export function parameter(value) {
  if (value === undefined || isIterator(value) || (value && value['@@knex/hook'])) {
    return value
  }
  return new Parameter(value)
}

// ----------------

// class Column {
//   constructor(value) {
//     this.value    = value
//     this.alias    = undefined
//     this.type     = 'column'
//     this.grouping = 'columns'
//   }
//   compile() {
//     return [
//       i(this.value),
//       this.alias ? AS : undefined,
//       this.alias ? i(this.alias) : undefined
//     ]
//   }
// }
// export function column(value) {
//   return new Column(value)
// }
// export function columns(...cols) {
//   return cols.map((val) => new Column(val))
// }

// ----------------

/**
 * Creates a new sql function call
 * @return {Fn} Instance of Fn class
 */
class Fn {
  constructor(fnName, params) {
    this.fnName = fnName
    this.params = params
  }
  [iterSymbol]() {
    return [`${fnName}(`, i(this.params), `)`]
  }
}
export function fn(fnName, ...params) {
  if (typeof fnName !== 'string') {
    throw new TypeError('The sql.fn takes a function as a string')
  }
  return new Fn(fnName, params)
}


class Alias {
  constructor(source, aliased) {
    this.source  = source
    this.aliased = aliased
  }
  build() {
    return [this.source, AS, this.aliased]
  }
}

function not(clause) {
  clause.negated = true
  return clause
}

function alias(source, aliased) {
  return new Alias(source, aliased)
}

export function set(values) {
  if (arguments.length !== 1) {
    throw new TypeError('Set takes an object or iterable')
  }
  if (Array.isArray(values) && values.length > 0) {
    if (!Array.isArray(values[0]) || values[0].length !== 2) {
      throw new TypeError()
    }
    for (var [k, v] of values) {

    }
  }
}

export function values(insertValues) {

}

class RawClause {
  constructor(sql, bindings) {
    this.sql      = sql
    this.bindings = bindings
  }
  [iterSymbol]() {
    if (typeof this.sql === 'string') {
      if (this.bindings !== undefined) {
        return compileRaw(this.sql, this.bindings)
      }
    }
    return iterator(this.sql)
  }
}

export function raw(sql, bindings) {
  if (arguments.length === 2) {
    if (!Array.isArray(bindings) && !isPlainObject(bindings)) {
      throw new Error('The second argument to a knex.raw call must be an array or object')
    }
    return new RawClause(sql, bindings)
  }
  return new RawClause(sql)
}

function compileRaw(sql, bindings) {
  if (Array.isArray(bindings)) {
    var pieces = sql.split('?')
    if (pieces.length - 1 !== bindings.length) {
      throw new Error(`Expected raw bindings to have length of ${pieces.length - 1}, has ${bindings.length}`)
    }
    var i = 0
    return lazySeq(transducer((step, value, input) => {
      if (input === '') return value
      return step(step(value, input.trim()), parameter(bindings[i++]))
    }), pieces)
  } 
  else {
    throw new Error('Named raw not yet supported')
  }
}
function compileNamedRaw(sql, obj) {
  var keys = Object.keys(obj)
  // for ()
}
