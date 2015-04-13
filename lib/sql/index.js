'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;
exports.parameter = parameter;
exports.identifier = identifier;
exports.fn = fn;
exports.set = set;
exports.values = values;
exports.raw = raw;

var _iterSymbol$isIterator$iterator$lazySeq$transducer = require('transduce');

var _AS$DISTINCT = require('./keywords');

var _isPlainObject = require('lodash/lang');

var _SubQueryBuilder = require('../builders/query');

// ----------------

var Parameter = function Parameter(value) {
  _classCallCheck(this, Parameter);

  this['@@knex/value'] = value;
  this['@@knex/hook'] = 'parameter';
};

function parameter(value) {
  if (value === undefined || _iterSymbol$isIterator$iterator$lazySeq$transducer.isIterator(value) || value && value['@@knex/hook']) {
    return value;
  }
  return new Parameter(value);
}

// ----------------

var Identifier = function Identifier(value) {
  _classCallCheck(this, Identifier);

  this['@@knex/value'] = value.trim();
  this['@@knex/hook'] = 'identifier';
};

function identifier(value) {
  if (typeof value === 'function') {
    var qb = new _SubQueryBuilder.SubQueryBuilder();
    var val = value.call(qb, qb); // TODO: check return val for builders
    return qb;
  }
  if (typeof value !== 'string') {
    return value;
  }
  return new Identifier(value);
}

// class Column {
//   constructor(value) {
//     this.value    = value
//     this.alias    = undefined
//     this.type     = 'column'
//     this.grouping = 'columns'
//   }
//   compile() {
//     return [
//       identifier(this.value),
//       this.alias ? AS : undefined,
//       this.alias ? identifier(this.alias) : undefined
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

var Fn = (function () {
  function Fn(fnName, params) {
    _classCallCheck(this, Fn);

    this.fnName = fnName;
    this.params = params;
  }

  Fn.prototype[_iterSymbol$isIterator$iterator$lazySeq$transducer.iterSymbol] = function () {
    return ['' + fnName + '(', identifier(this.params), ')'];
  };

  return Fn;
})();

function fn(fnName) {
  for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  if (typeof fnName !== 'string') {
    throw new TypeError('The sql.fn takes a function as a string');
  }
  return new Fn(fnName, params);
}

var Alias = (function () {
  function Alias(source, aliased) {
    _classCallCheck(this, Alias);

    this.source = source;
    this.aliased = aliased;
  }

  Alias.prototype.build = function build() {
    return [this.source, _AS$DISTINCT.AS, this.aliased];
  };

  return Alias;
})();

function not(clause) {
  clause.negated = true;
  return clause;
}

function alias(source, aliased) {
  return new Alias(source, aliased);
}

function set(values) {
  if (arguments.length !== 1) {
    throw new TypeError('Set takes an object or iterable');
  }
  if (Array.isArray(values) && values.length > 0) {
    if (!Array.isArray(values[0]) || values[0].length !== 2) {
      throw new TypeError();
    }
    for (var _iterator = values, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var k = _ref[0];
      var v = _ref[1];
    }
  }
}

function values(insertValues) {}

var RawClause = (function () {
  function RawClause(sql, bindings) {
    _classCallCheck(this, RawClause);

    this.sql = sql;
    this.bindings = bindings;
    this['@@knex/hook'] = 'clause:raw';
  }

  RawClause.prototype[_iterSymbol$isIterator$iterator$lazySeq$transducer.iterSymbol] = function () {
    if (typeof this.sql === 'string') {
      if (this.bindings !== undefined) {
        return compileRaw(this.sql, this.bindings);
      }
    }
    return _iterSymbol$isIterator$iterator$lazySeq$transducer.iterator([this.sql]);
  };

  return RawClause;
})();

function raw(sql, bindings) {
  if (arguments.length === 2) {
    if (!Array.isArray(bindings) && !_isPlainObject.isPlainObject(bindings)) {
      throw new Error('The second argument to a knex.raw call must be an array or object');
    }
    return new RawClause(sql, bindings);
  }
  return new RawClause(sql);
}

function compileRaw(sql, bindings) {
  if (Array.isArray(bindings)) {
    var pieces = sql.split('?');
    if (pieces.length - 1 !== bindings.length) {
      throw new Error('Expected raw bindings to have length of ' + (pieces.length - 1) + ', has ' + bindings.length);
    }
    var i = 0;
    return _iterSymbol$isIterator$iterator$lazySeq$transducer.lazySeq(_iterSymbol$isIterator$iterator$lazySeq$transducer.transducer(function (step, value, input) {
      if (input === '') return value;
      return step(step(value, input.trim()), parameter(bindings[i++]));
    }), pieces);
  } else {
    throw new Error('Named raw not yet supported');
  }
}
function compileNamedRaw(sql, obj) {
  var keys = Object.keys(obj)
  // for ()
  ;
}