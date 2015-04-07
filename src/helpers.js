import _       from 'lodash'
import isArray from 'lodash/lang/isArray'
import {alias} from './sql'

export function or(obj) {
  if (isArray(obj)) return obj.map((val) => or(val))
  obj.__or = true
  return obj
}

export function not(obj) {
  if (isArray(obj)) return obj.map((val) => not(val))
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
    return [val.slice(0, asIndex), val.slice(asIndex + 4)]
  }
  return [val]
}

export function clause(builder, element, single) {
  
  builder.__cache = false
  
  if (element === undefined) {
    builder.__notFlag = false
    builder.__boolFlag = false
    return builder
  }
  
  if (builder.__notFlag) {
    builder.__notFlag = false
    return clause(builder, not(element))
  }
  
  if (builder.__boolFlag) {
    builder.__boolFlag = false
    return clause(builder, or(element))
  }
  
  if (single) {
    builder.elements.single[element.grouping] = element
  } else if (isArray(element)) {
    for (let item of element) {
      builder = clause(builder, item)
    }
  } else {
    builder.elements[element.grouping].push(element)  
  }

  return builder
}
