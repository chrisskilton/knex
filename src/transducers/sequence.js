import {isArray, isObject} from 'lodash/lang'
import {isReduced}  from 'transduce'

let step   = '@@transducer/step'
let result = '@@transducer/result'

export default function sequence(xf, val) {
  return new LazyTransformer(xf, val)
}

function iterator(coll) {
  if (isArray(coll)) {
    return new ArrayIterator(coll);
  }
  else if (coll[Symbol.iterator]) {
    return coll[Symbol.iterator]()
  }
  else if (isObject(coll)) {
    return new ObjectIterator(coll);
  }
}

function ArrayIterator(arr) {
  this.arr = arr;
  this.index = 0;
}

ArrayIterator.prototype.next = function() {
  if(this.index < this.arr.length) {
    return {
      value: this.arr[this.index++],
      done: false
    };
  }
  return {
    done: true
  }
};

function ObjectIterator(obj) {
  this.obj = obj;
  this.keys = Object.keys(obj);
  this.index = 0;
}

ObjectIterator.prototype.next = function() {
  if(this.index < this.keys.length) {
    var k = this.keys[this.index++];
    return {
      value: [k, this.obj[k]],
      done: false
    };
  }
  return {
    done: true
  }
};

var stepper = {
  [result](v) {
    return isReduced(v) ? v.value : v;
  },
  [step]: function(lt, x) {
    lt.items.push(x);
    return lt;
  }
}

function Stepper(xform, iter) {
  this.xform = xform(stepper);
  this.iter = iter;
}

Stepper.prototype[step] = function(lt) {
  var len = lt.items.length;
  while(lt.items.length === len) {
    var n = this.iter.next();
    if(n.done || isReduced(n.value)) {
      // finalize
      this.xform[result](this);
      break;
    }

    // step
    this.xform[step](lt, n.value);
  }
}

function LazyTransformer(xform, coll) {
  this.iter  = iterator(coll);
  this.items = [];
  this.stepper = new Stepper(xform, iterator(coll));
}

LazyTransformer.prototype[Symbol.iterator] = function() {
  return this;
}

LazyTransformer.prototype.next = function() {
  this[step]();

  if(this.items.length) {
    return {
      value: this.items.pop(),
      done: false
    }
  }
  else {
    return { done: true };
  }
};

LazyTransformer.prototype[step] = function() {
  if(!this.items.length) {
    this.stepper[step](this);
  }
}