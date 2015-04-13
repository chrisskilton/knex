'use strict';

var _IIterable;

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;

var _isNull$isArray$isString$isNumber = require('lodash/lang');

var _QueryIterable$InsertIterable$DeleteIterable$UpdateIterable = require('../iterables');

var _camelCase = require('lodash/string/camelCase');

var _camelCase2 = _interopRequireWildcard(_camelCase);

var _isIterable$isIterator$filter$iterSymbol$lazySeq$interpose$into$map$Transducer$transducer$iterator$compose$protocols$FlattenIterator = require('transduce');

var _protocols$transducer = _isIterable$isIterator$filter$iterSymbol$lazySeq$interpose$into$map$Transducer$transducer$iterator$compose$protocols$FlattenIterator.protocols.transducer;
var tStep = _protocols$transducer.step;
var tResult = _protocols$transducer.result;
var IIterable = (_IIterable = {}, _IIterable[Symbol.iterator] = function () {
  return compileFrom(this);
}, _IIterable);

exports.IIterable = IIterable;
function compileFrom(builder) {
  var container = builder.container;

  var hooks = builder.hooks;
  var iter = builder.__iterator ? builder.__iterator() : _isIterable$isIterator$filter$iterSymbol$lazySeq$interpose$into$map$Transducer$transducer$iterator$compose$protocols$FlattenIterator.iterator(compileTarget(container));
  return sqlSeq(hooks, iter);
}

function compileTarget(container) {
  switch (container.last('statementType')) {
    case 'select':
      return new _QueryIterable$InsertIterable$DeleteIterable$UpdateIterable.QueryIterable(container);
    case 'update':
      return new _QueryIterable$InsertIterable$DeleteIterable$UpdateIterable.UpdateIterable(container);
    case 'delete':
      return new _QueryIterable$InsertIterable$DeleteIterable$UpdateIterable.DeleteIterable(container);
    case 'insert':
      return new _QueryIterable$InsertIterable$DeleteIterable$UpdateIterable.InsertIterable(container);
  }
}

// The root seq takes a "transducer",
// and returns a lazy iterator.
function sqlSeq(hooks, iterator) {
  return _isIterable$isIterator$filter$iterSymbol$lazySeq$interpose$into$map$Transducer$transducer$iterator$compose$protocols$FlattenIterator.lazySeq(pipeline(hooks), new RootIterator(hooks, iterator));
}

var RootIterator = (function (_FlattenIterator) {
  function RootIterator(hooks, iterator) {
    _classCallCheck(this, RootIterator);

    _FlattenIterator.call(this, iterator);
    this.hooks = hooks || new Map();
  }

  _inherits(RootIterator, _FlattenIterator);

  RootIterator.prototype.__next = function __next(value) {
    if (value && value['@@knex/hook']) {
      var hookName = value['@@knex/hook'];
      var name = _camelCase2['default'](hookName);
      if (this.hooks.has(name)) {
        var hookToRun = this.hooks.get(name);
        var otherHooks = this.hooks.rest(name);
        value = hookToRun(value, otherHooks);
      }
    }
    return _FlattenIterator.prototype.__next.call(this, value);
  };

  return RootIterator;
})(_isIterable$isIterator$filter$iterSymbol$lazySeq$interpose$into$map$Transducer$transducer$iterator$compose$protocols$FlattenIterator.FlattenIterator);

var buffer = function buffer(n) {
  return function (xf) {
    return new Buffered(n, xf);
  };
};

var Buffered = (function (_Transducer) {
  function Buffered(n, xf) {
    _classCallCheck(this, Buffered);

    _Transducer.call(this, xf);
    this.n = n;
    this.buffer = [];
  }

  _inherits(Buffered, _Transducer);

  Buffered.prototype[tStep] = function (result, value) {
    this.buffer.push(value);
    if (this.buffer.length === 3) {
      return this.xfStep(result, this.buffer);
    }
    return result;
  };

  Buffered.prototype[tResult] = function (result) {
    while (this.buffer.length > 0) {
      result = this.xfStep(result, this.buffer);
    }
    return this.xfResult(result);
  };

  return Buffered;
})(_isIterable$isIterator$filter$iterSymbol$lazySeq$interpose$into$map$Transducer$transducer$iterator$compose$protocols$FlattenIterator.Transducer);

var AddSpaces = (function (_Transducer2) {
  function AddSpaces(xf) {
    _classCallCheck(this, AddSpaces);

    _Transducer2.call(this, xf);
    this.started = false;
    this.pendingSpace = false;
  }

  _inherits(AddSpaces, _Transducer2);

  AddSpaces.prototype[tStep] = function (result, value) {
    var a = value[0];
    var b = value[1];

    var pendingSpace = this.pendingSpace;
    this.pendingSpace = false;
    if (pendingSpace) {
      result = this.xfStep(result, ' ');
    }
    if (value.length > 1 && a['@@knex/spacing'] !== 'OMIT_FOLLOWING' && b['@@knex/spacing'] !== 'OMIT_PRECEDING') {
      this.pendingSpace = true;
    }
    return this.xfStep(result, value.shift());
  };

  return AddSpaces;
})(_isIterable$isIterator$filter$iterSymbol$lazySeq$interpose$into$map$Transducer$transducer$iterator$compose$protocols$FlattenIterator.Transducer);

var addSpaces = _isIterable$isIterator$filter$iterSymbol$lazySeq$interpose$into$map$Transducer$transducer$iterator$compose$protocols$FlattenIterator.compose(buffer(3), function (xf) {
  return new AddSpaces(xf);
});

var undef = function undef(val) {
  return val !== undefined;
};

function flattenIterator() {}

function hook(name, hooks) {
  if (hooks.has(name)) {
    var _ret = (function () {
      var hookToRun = hooks.get(name);
      var otherHooks = hooks.rest(name);
      return {
        v: _isIterable$isIterator$filter$iterSymbol$lazySeq$interpose$into$map$Transducer$transducer$iterator$compose$protocols$FlattenIterator.map(function (val) {
          return hookToRun(val, otherHooks);
        })
      };
    })();

    if (typeof _ret === 'object') {
      return _ret.v;
    }
  }
}

function pipeline(hooks) {

  var toCompose = [_isIterable$isIterator$filter$iterSymbol$lazySeq$interpose$into$map$Transducer$transducer$iterator$compose$protocols$FlattenIterator.filter(undef), hook('beforeSpace', hooks), addSpaces, hook('afterSpace', hooks), _isIterable$isIterator$filter$iterSymbol$lazySeq$interpose$into$map$Transducer$transducer$iterator$compose$protocols$FlattenIterator.map(function (val) {
    if (val['@@knex/value']) {
      return val['@@knex/value'];
    }
    return val;
  })];

  return _isIterable$isIterator$filter$iterSymbol$lazySeq$interpose$into$map$Transducer$transducer$iterator$compose$protocols$FlattenIterator.compose.apply(undefined, toCompose.filter(undef));
}