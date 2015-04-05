import sequence from './sequence'
let t = {
  step:   '@@transducer/step',
  init:   '@@transducer/init',
  result: '@@transducer/result'  
}
import {isReduced} from 'transduce'

function Interpose(sep, xform) {
  this.sep = sep;
  this.xform = xform;
  this.started = false;
}

Interpose.prototype[t.init] = function() {
  return this.xform[t.init]();
};

Interpose.prototype[t.result] = function(v) {
  return this.xform[t.result](v);
};

Interpose.prototype[t.step] = function(result, input) {
  if (this.started) {
    var withSep = this.xform[t.step](result, this.sep);
    if (isReduced(withSep)) {
      return withSep;
    } else {
      return this.xform[t.step](withSep, input);
    }
  } else {
    this.started = true;
    return this.xform[t.step](result, input);
  }
};

/**
 * Returns a new collection containing elements of the given
 * collection, separated by the specified separator. Returns a
 * transducer if a collection is not provided.
 */
export default function interpose(coll, separator) {
  if (arguments.length === 1) {
    separator = coll;
    return function(xform) {
      return new Interpose(separator, xform);
    };
  }
  return sequence(coll, interpose(separator));
}
