'use strict';

exports.__esModule = true;

var _isPlainObject$isArray$isBoolean$isString = require('lodash/lang');

var _or$not$parameterize = require('../helpers');

var _wrap = require('../sql/wrap');

var _raw = require('../sql');

var _and = require('../sql/operators');

var _map$filter$interpose$into$compose$lazySeq$isIterable$iterator = require('transduce');

var _SubQueryBuilder$GroupedWhereBuilder = require('../builders/query');

var _AND$WHERE$IN$IS$NULL$COMMA$BETWEEN = require('../sql/keywords');

var _WhereClause = require('../iterables');

var IWhere = {

  // [AND | OR] WHERE [NOT]

  where: function where() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return this.__where(whereDispatch(args));
  },

  orWhere: function orWhere() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return this.__where(_or$not$parameterize.or(whereDispatch(args)));
  },

  whereNot: function whereNot() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return this.__where(_or$not$parameterize.not(whereDispatch(args)));
  },

  orWhereNot: function orWhereNot() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return this.__where(_or$not$parameterize.or(_or$not$parameterize.not(whereDispatch(args))));
  },

  whereRaw: function whereRaw() {
    return this.__where(_raw.raw.apply(undefined, arguments));
  },

  orWhereRaw: function orWhereRaw() {
    return this.__where(_or$not$parameterize.or(_raw.raw.apply(undefined, arguments)));
  },

  // [AND | OR] WHERE [NOT] EXISTS (subquery)

  whereExists: (function (_whereExists) {
    function whereExists(_x) {
      return _whereExists.apply(this, arguments);
    }

    whereExists.toString = function () {
      return _whereExists.toString();
    };

    return whereExists;
  })(function (callback) {
    return this.__where(whereExists(callback));
  }),

  orWhereExists: function orWhereExists(callback) {
    return this.__where(_or$not$parameterize.or(whereExists(callback)));
  },

  whereNotExists: function whereNotExists(callback) {
    return this.__where(_or$not$parameterize.not(whereExists(callback)));
  },

  orWhereNotExists: function orWhereNotExists(callback) {
    return this.__where(_or$not$parameterize.or(_or$not$parameterize.not(whereExists(callback))));
  },

  // [AND | OR] WHERE [NOT] IN

  whereIn: (function (_whereIn) {
    function whereIn(_x2, _x3) {
      return _whereIn.apply(this, arguments);
    }

    whereIn.toString = function () {
      return _whereIn.toString();
    };

    return whereIn;
  })(function (column, value) {
    return this.__where(whereIn(column, value));
  }),

  orWhereIn: function orWhereIn(column, value) {
    return this.__where(_or$not$parameterize.or(whereIn(column, value)));
  },

  whereNotIn: function whereNotIn(column, value) {
    return this.__where(_or$not$parameterize.not(whereIn(column, value)));
  },

  orWhereNotIn: function orWhereNotIn(column, value) {
    return this.__where(_or$not$parameterize.or(_or$not$parameterize.not(whereIn(column, value))));
  },

  // [AND | OR] WHERE ${col} IS [NOT] NULL

  whereNull: (function (_whereNull) {
    function whereNull(_x4) {
      return _whereNull.apply(this, arguments);
    }

    whereNull.toString = function () {
      return _whereNull.toString();
    };

    return whereNull;
  })(function (column) {
    return this.__where(whereNull(column));
  }),

  orWhereNull: function orWhereNull(column) {
    return this.__where(_or$not$parameterize.or(whereNull(column)));
  },

  whereNotNull: function whereNotNull(column) {
    return this.__where(_or$not$parameterize.not(whereNull(column)));
  },

  orWhereNotNull: function orWhereNotNull(column) {
    return this.__where(_or$not$parameterize.or(_or$not$parameterize.not(whereNull(column))));
  },

  // [AND | OR] WHERE ${col} [NOT] BETWEEN ${a} AND ${b}

  whereBetween: (function (_whereBetween) {
    function whereBetween(_x5, _x6) {
      return _whereBetween.apply(this, arguments);
    }

    whereBetween.toString = function () {
      return _whereBetween.toString();
    };

    return whereBetween;
  })(function (column, values) {
    return this.__where(whereBetween(column, values));
  }),

  whereNotBetween: function whereNotBetween(column, values) {
    return this.__where(_or$not$parameterize.not(whereBetween(column, values)));
  },

  orWhereBetween: function orWhereBetween(column, values) {
    return this.__where(_or$not$parameterize.or(whereBetween(column, values)));
  },

  orWhereNotBetween: function orWhereNotBetween(column, values) {
    return this.__where(_or$not$parameterize.or(_or$not$parameterize.not(whereBetween(values))));
  },

  __where: function __where(val) {
    return this.__clause('wheres', val);
  },

  // Deprecated:

  andWhere: function andWhere() {
    console.log('andWhere is deprecated, you can just use an additional where statement.');
    return this.where.apply(this, arguments);
  },

  andWhereRaw: function andWhereRaw() {
    console.log('andWhereRaw is deprecated, you can just use an additional whereRaw statement.');
    return this.whereRaw.apply(this, arguments);
  }

};

exports.IWhere = IWhere;
function whereDispatch(args) {
  switch (args.length) {
    case 0:
      return;
    case 1:
      return whereArity1(args[0]);
    case 2:
      return whereArity2(args[0], args[1]);
    case 3:
      return whereArity3(args[0], args[1], args[2]);
  }
}

// e.g. where(raw()), where('col = 2'), where({col: 2, id: 2}), where(fn)
function whereArity1(value) {
  if (typeof value === 'function') {
    var w = new _SubQueryBuilder$GroupedWhereBuilder.GroupedWhereBuilder();
    value.call(w, w);
    return new _WhereClause.WhereClause(w);
  }
  if (_isPlainObject$isArray$isBoolean$isString.isPlainObject(value)) {
    return _map$filter$interpose$into$compose$lazySeq$isIterable$iterator.into([], _map$filter$interpose$into$compose$lazySeq$isIterable$iterator.map(function (_ref) {
      var key = _ref[0];
      var val = _ref[1];
      return whereArity3(key, '=', val);
    }), value);
  }
  if (_isPlainObject$isArray$isBoolean$isString.isBoolean(value)) {
    return new _WhereClause.WhereClause(1, '=', value === true ? 1 : 0);
  }
  if (_isPlainObject$isArray$isBoolean$isString.isString(value)) {
    throw new Error('A string value is not supported as a where clause');
  }
  // TODO: Continue to refine.
  return new _WhereClause.WhereClause(value);
}

function whereArity2(column, value) {
  if (value === null) {
    return whereNull(column);
  }
  return new _WhereClause.WhereClause(column, '=', value);
}

function whereArity3(_x7, _x8, _x9) {
  var _again = true;

  _function: while (_again) {
    qb = undefined;
    _again = false;
    var column = _x7,
        operator = _x8,
        value = _x9;

    if (typeof value === 'function') {
      var qb = new _SubQueryBuilder$GroupedWhereBuilder.SubQueryBuilder();
      value.call(qb, qb);
      _x7 = column;
      _x8 = operator;
      _x9 = qb;
      _again = true;
      continue _function;
    }
    return new _WhereClause.WhereClause(column, operator, value);
  }
}

function whereBetween(col, values) {
  if (!_isPlainObject$isArray$isBoolean$isString.isArray(values) || values.length !== 2) {
    throw new TypeError('You must specify a two value array to the whereBetween clause');
  }
  return new _WhereClause.WhereClause(col, _AND$WHERE$IN$IS$NULL$COMMA$BETWEEN.BETWEEN, _map$filter$interpose$into$compose$lazySeq$isIterable$iterator.iterator([_raw.parameter(values[0]), _AND$WHERE$IN$IS$NULL$COMMA$BETWEEN.AND, _raw.parameter(values[1])]));
}

function whereExists(fn) {
  if (typeof fn === 'function') {} else if (isBuilder(fn)) {}
  return new _WhereClause.WhereClause(undefined, EXISTS, fn);
}

var pipeline = _map$filter$interpose$into$compose$lazySeq$isIterable$iterator.compose(_map$filter$interpose$into$compose$lazySeq$isIterable$iterator.map(function (value) {
  return _raw.parameter(value);
}), _map$filter$interpose$into$compose$lazySeq$isIterable$iterator.filter(function (value) {
  return value !== undefined;
}), _map$filter$interpose$into$compose$lazySeq$isIterable$iterator.interpose(_AND$WHERE$IN$IS$NULL$COMMA$BETWEEN.COMMA));

function whereIn(col, value) {
  if (typeof value === 'function') {
    return whereArity3(col, _AND$WHERE$IN$IS$NULL$COMMA$BETWEEN.IN, value);
  }
  return new _WhereClause.WhereClause(col, _AND$WHERE$IN$IS$NULL$COMMA$BETWEEN.IN, _wrap.wrap(_or$not$parameterize.parameterize(value)));
}

function whereNull(col, value) {
  return new _WhereClause.WhereClause(col, _AND$WHERE$IN$IS$NULL$COMMA$BETWEEN.IS, _AND$WHERE$IN$IS$NULL$COMMA$BETWEEN.NULL);
}

// multiWhereIn(statement) {
//   return '(' + _.map(statement.column, this.formatter.wrap, this.formatter) + ') ' +
//     this._not(statement, 'in ') + '((' +
//     _.map(statement.value, this.formatter.parameterize, this.formatter).join('),(') + '))';
// }