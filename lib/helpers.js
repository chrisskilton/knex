'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;
exports.knexFlatten = knexFlatten;
exports.columnize = columnize;
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
exports.clause = clause;

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _filter$interpose$map$compose$iterator$lazySeq$FlattenIterator = require('transduce');

var _COMMA = require('./sql/delimiters');

var _AS = require('./sql/keywords');

var _identifier = require('./sql/identifier');

var _parameter = require('./sql');

function knexFlatten(transducer, target) {
  return _filter$interpose$map$compose$iterator$lazySeq$FlattenIterator.lazySeq(transducer, new _filter$interpose$map$compose$iterator$lazySeq$FlattenIterator.FlattenIterator(_filter$interpose$map$compose$iterator$lazySeq$FlattenIterator.iterator(target), function (val) {
    return val && val['@@knex/hook'];
  }));
}

function commaSeparated(wrappingValue) {
  return _filter$interpose$map$compose$iterator$lazySeq$FlattenIterator.compose(_filter$interpose$map$compose$iterator$lazySeq$FlattenIterator.map(extractAlias), _filter$interpose$map$compose$iterator$lazySeq$FlattenIterator.map(function (value) {
    return wrappingValue(value);
  }), _filter$interpose$map$compose$iterator$lazySeq$FlattenIterator.filter(function (value) {
    return value !== undefined;
  }), _filter$interpose$map$compose$iterator$lazySeq$FlattenIterator.interpose(_COMMA.COMMA));
}

function columnize(values, shallow) {
  var pipeline = commaSeparated(_identifier.identifier);
  return shallow ? _filter$interpose$map$compose$iterator$lazySeq$FlattenIterator.lazySeq(pipeline, values) : knexFlatten(pipeline, values);
}

function parameterize(values, shallow) {
  var pipeline = commaSeparated(_parameter.parameter);
  return shallow ? _filter$interpose$map$compose$iterator$lazySeq$FlattenIterator.lazySeq(pipeline, values) : knexFlatten(pipeline, values);
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

function clause(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    _iterator = _isArray = _i = _iterator = _ref = item = undefined;
    _again = false;
    var builder = _x,
        element = _x2,
        single = _x3;

    builder.__cache = false;

    if (element === undefined) {
      builder.__notFlag = false;
      builder.__boolFlag = false;
      return builder;
    }

    if (builder.__notFlag) {
      builder.__notFlag = false;
      _x = builder;
      _x2 = not(element);
      _again = true;
      continue _function;
    }

    if (builder.__boolFlag) {
      builder.__boolFlag = false;
      _x = builder;
      _x2 = or(element);
      _again = true;
      continue _function;
    }

    if (single) {
      builder.elements.single[element.grouping] = element;
    } else if (Array.isArray(element)) {
      for (var _iterator = element, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var item = _ref;

        builder = clause(builder, item);
      }
    } else {
      builder.elements[element.grouping].push(element);
    }

    return builder;
  }
}