import _       from 'lodash'
import {protocols, filter, interpose, map, compose, iterator, lazySeq, 
  Transducer, FlattenIterator} from 'duce'
import {COMMA, RIGHT_PAREN, LEFT_PAREN} from './sql/delimiters'
import {AS} from './sql/keywords'
import {identifier} from './sql'
import {parameter} from './sql'
import forEach from 'lodash/collection/forEach'

const {transducer: {step: tStep, result: tResult}} = protocols

export function knexFlatten(transducer, target) {
  return lazySeq(transducer, new FlattenIterator(iterator(target), (val) => {
    return val && val['@@knex/hook']
  }))
}

export function isBuilder(obj) {
  return obj && obj['@@__KNEX_BUILDER__@@']
}

export function isKeyword(val) {
  return val && val['@@knex/hook'] === 'keyword'
}

var columnizePipeline = compose(
  map(extractAlias),
  map((value) => identifier(value)),
  filter((value) => value !== undefined),
  interpose(COMMA)
)

export function columnize(columns) {
  return knexFlatten(columnizePipeline, columns)
}

export function commaDelimit(values) {
  return lazySeq(compose(
    filter((value) => value !== undefined),
    interpose(COMMA)
  ), values)
}

function commaSeparated(wrappingValue) {
  return compose(
    map(extractAlias),
    map((value) => wrappingValue(value)),
    filter((value) => value !== undefined),
    interpose(COMMA)
  )
}

export function parameterize(values, shallow) {
  var pipeline = commaSeparated(parameter)
  return shallow
    ? lazySeq(pipeline, values)
    : knexFlatten(pipeline, values)
}

export function or(obj) {
  if (Array.isArray(obj)) return obj.map((val) => or(val))
  obj.__or = true
  return obj
}

export function not(obj) {
  if (Array.isArray(obj)) return obj.map((val) => not(val))
  obj.__negated = true
  return obj
}

export function mixin(Class, methods) {
  var keyCopier = key => { Class.prototype[key] = methods[key]; };
  Object.keys(methods).forEach(keyCopier);
  Object.getOwnPropertySymbols &&
    Object.getOwnPropertySymbols(methods).forEach(keyCopier);
  return Class
}

// Pick off the attributes from only the current layer of the object.
export function skim(data) {
  return _.map(data, function(obj) {
    return _.pick(obj, _.keys(obj));
  });
}

// Used to signify deprecated functionality.
export function deprecate(msg) {
  this.warn(msg);
}

// Used to warn about incorrect use, without error'ing
export function warn(msg) {
  if (typeof console !== "undefined" && console !== null &&
    typeof console.warn === "function") {
    console.warn("Knex: " + msg);
  }
}

export function extractAlias(val) {
  if (typeof val !== 'string') return val;
  var asIndex = val.toLowerCase().indexOf(' as ')
  if (asIndex !== -1) {
    return [identifier(val.slice(0, asIndex)), AS, identifier(val.slice(asIndex + 4))]
  }
  return val
}

class Wrapping extends Transducer {

  constructor(xf) {
    super(xf)
    this.buffered = []
  }

  [tStep](result, value) {
    this.buffered.push(value)
    return result
  }

  [tResult](result) {
    if (this.buffered.length > 0) {
      result = this.xfStep(result, LEFT_PAREN)
      forEach(this.buffered, (val) => {
        result = this.xfStep(result, val)
      })
      result = this.xfStep(result, RIGHT_PAREN)
    }
    return this.xfResult(result)
  }

}

export const wrap = (xf) => {
  return new Wrapping(xf)
}

