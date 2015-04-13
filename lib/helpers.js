'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;
exports.knexFlatten = knexFlatten;
exports.isBuilder = isBuilder;
exports.isKeyword = isKeyword;
exports.columnize = columnize;
exports.commaDelimit = commaDelimit;
exports.parameterize = parameterize;
exports.or = or;
exports.not = not;
exports.mixin = mixin;

// Pick off the attributes from only the current layer of the object.
exports.skim = skim;

// Used to signify deprecated functionality.
exports.deprecate = deprecate;

// Used to warn about incorrect use, without error'ing
exports.warn = warn;
exports.extractAlias = extractAlias;

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator = require('transduce');

var _COMMA$RIGHT_PAREN$LEFT_PAREN = require('./sql/delimiters');

var _AS = require('./sql/keywords');

var _identifier = require('./sql');

var _forEach = require('lodash/collection/forEach');

var _forEach2 = _interopRequireWildcard(_forEach);

var _protocols$transducer = _protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.protocols.transducer;
var tStep = _protocols$transducer.step;
var tResult = _protocols$transducer.result;

function knexFlatten(transducer, target) {
  return _protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.lazySeq(transducer, new _protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.FlattenIterator(_protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.iterator(target), function (val) {
    return val && val['@@knex/hook'];
  }));
}

function isBuilder(obj) {
  return obj && obj['@@__KNEX_BUILDER__@@'];
}

function isKeyword(val) {
  return val && val['@@knex/hook'] === 'keyword';
}

var columnizePipeline = _protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.compose(_protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.map(extractAlias), _protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.map(function (value) {
  return _identifier.identifier(value);
}), _protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.filter(function (value) {
  return value !== undefined;
}), _protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.interpose(_COMMA$RIGHT_PAREN$LEFT_PAREN.COMMA));

function columnize(columns) {
  return knexFlatten(columnizePipeline, columns);
}

function commaDelimit(values) {
  return _protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.lazySeq(_protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.compose(_protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.filter(function (value) {
    return value !== undefined;
  }), _protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.interpose(_COMMA$RIGHT_PAREN$LEFT_PAREN.COMMA)), values);
}

function commaSeparated(wrappingValue) {
  return _protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.compose(_protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.map(extractAlias), _protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.map(function (value) {
    return wrappingValue(value);
  }), _protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.filter(function (value) {
    return value !== undefined;
  }), _protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.interpose(_COMMA$RIGHT_PAREN$LEFT_PAREN.COMMA));
}

function parameterize(values, shallow) {
  var pipeline = commaSeparated(_identifier.parameter);
  return shallow ? _protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.lazySeq(pipeline, values) : knexFlatten(pipeline, values);
}

function or(obj) {
  if (Array.isArray(obj)) {
    return obj.map(function (val) {
      return or(val);
    });
  }obj.__or = true;
  return obj;
}

function not(obj) {
  if (Array.isArray(obj)) {
    return obj.map(function (val) {
      return not(val);
    });
  }obj.__negated = true;
  return obj;
}

function mixin(Class, methods) {
  var keyCopier = function keyCopier(key) {
    Class.prototype[key] = methods[key];
  };
  Object.keys(methods).forEach(keyCopier);
  Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(methods).forEach(keyCopier);
  return Class;
}

function skim(data) {
  return _import2['default'].map(data, function (obj) {
    return _import2['default'].pick(obj, _import2['default'].keys(obj));
  });
}

function deprecate(msg) {
  this.warn(msg);
}

function warn(msg) {
  if (typeof console !== 'undefined' && console !== null && typeof console.warn === 'function') {
    console.warn('Knex: ' + msg);
  }
}

function extractAlias(val) {
  if (typeof val !== 'string') {
    return val;
  }var asIndex = val.toLowerCase().indexOf(' as ');
  if (asIndex !== -1) {
    return [_identifier.identifier(val.slice(0, asIndex)), _AS.AS, _identifier.identifier(val.slice(asIndex + 4))];
  }
  return val;
}

var Wrapping = (function (_Transducer) {
  function Wrapping(xf) {
    _classCallCheck(this, Wrapping);

    _Transducer.call(this, xf);
    this.buffered = [];
  }

  _inherits(Wrapping, _Transducer);

  Wrapping.prototype[tStep] = function (result, value) {
    this.buffered.push(value);
    return result;
  };

  Wrapping.prototype[tResult] = function (result) {
    var _this = this;

    if (this.buffered.length > 0) {
      result = this.xfStep(result, _COMMA$RIGHT_PAREN$LEFT_PAREN.LEFT_PAREN);
      _forEach2['default'](this.buffered, function (val) {
        result = _this.xfStep(result, val);
      });
      result = this.xfStep(result, _COMMA$RIGHT_PAREN$LEFT_PAREN.RIGHT_PAREN);
    }
    return this.xfResult(result);
  };

  return Wrapping;
})(_protocols$filter$interpose$map$compose$iterator$lazySeq$Transducer$FlattenIterator.Transducer);

var wrap = function wrap(xf) {
  return new Wrapping(xf);
};
exports.wrap = wrap;