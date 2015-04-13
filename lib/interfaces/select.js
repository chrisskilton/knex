'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;
exports.join = join;
exports.innerJoin = innerJoin;
exports.leftJoin = leftJoin;
exports.leftOuterJoin = leftOuterJoin;
exports.rightJoin = rightJoin;
exports.rightOuterJoin = rightOuterJoin;
exports.outerJoin = outerJoin;
exports.fullOuterJoin = fullOuterJoin;
exports.crossJoin = crossJoin;
exports.joinRaw = joinRaw;
// All of the chainable methods specific to "select"

var _isBuilder$extractAlias$wrap = require('../helpers');

var _OrderByClause$UnionClause = require('../iterables');

var _UnionQueryBuilder = require('../builders/query');

var _isBoolean = require('lodash/lang');

var _last = require('lodash/array/last');

var _last2 = _interopRequireWildcard(_last);

var _raw = require('../sql');

var ISelect = {

  // Allow for the current query to be aliased
  as: function as(ident) {
    return this.__clause(aliasAs(ident));
  },

  // Sets the values for a `select` query,
  // which is the same as specifying the columns.
  select: function select() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    switch (args.length) {
      case 0:
        return this;
      case 1:
        return this.__clause('columns', args[0]);
    }
    return this.__clause('columns', args);
  },

  from: function from() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return this.__clause('table', args);
  },

  // Sets the `tableName` on the query.
  // Alias to "from" for select and "into" for insert clauses
  // e.g. builder.insert({a: value}).into('tableName')
  table: function table() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return this.__clause('table', args);
  },

  // Adds a `distinct` clause to the query.
  distinct: function distinct() {
    var _clause;

    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return (_clause = this.__clause('distinct', true)).select.apply(_clause, args);
  },

  // JOIN(s)

  join: function join() {
    return this.innerJoin.apply(this, arguments);
  },

  innerJoin: (function (_innerJoin) {
    function innerJoin(_x) {
      return _innerJoin.apply(this, arguments);
    }

    innerJoin.toString = function () {
      return _innerJoin.toString();
    };

    return innerJoin;
  })(function () {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return this.__clause('joins', innerJoin(args));
  }),

  leftJoin: (function (_leftJoin) {
    function leftJoin(_x2) {
      return _leftJoin.apply(this, arguments);
    }

    leftJoin.toString = function () {
      return _leftJoin.toString();
    };

    return leftJoin;
  })(function () {
    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    return this.__clause('joins', leftJoin(args));
  }),

  leftOuterJoin: (function (_leftOuterJoin) {
    function leftOuterJoin(_x3) {
      return _leftOuterJoin.apply(this, arguments);
    }

    leftOuterJoin.toString = function () {
      return _leftOuterJoin.toString();
    };

    return leftOuterJoin;
  })(function () {
    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    return this.__clause('joins', leftOuterJoin(args));
  }),

  rightJoin: (function (_rightJoin) {
    function rightJoin(_x4) {
      return _rightJoin.apply(this, arguments);
    }

    rightJoin.toString = function () {
      return _rightJoin.toString();
    };

    return rightJoin;
  })(function () {
    for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    return this.__clause('joins', rightJoin(args));
  }),

  rightOuterJoin: (function (_rightOuterJoin) {
    function rightOuterJoin(_x5) {
      return _rightOuterJoin.apply(this, arguments);
    }

    rightOuterJoin.toString = function () {
      return _rightOuterJoin.toString();
    };

    return rightOuterJoin;
  })(function () {
    for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    return this.__clause('joins', rightOuterJoin(args));
  }),

  outerJoin: (function (_outerJoin) {
    function outerJoin(_x6) {
      return _outerJoin.apply(this, arguments);
    }

    outerJoin.toString = function () {
      return _outerJoin.toString();
    };

    return outerJoin;
  })(function () {
    for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      args[_key10] = arguments[_key10];
    }

    return this.__clause('joins', outerJoin(args));
  }),

  fullOuterJoin: (function (_fullOuterJoin) {
    function fullOuterJoin(_x7) {
      return _fullOuterJoin.apply(this, arguments);
    }

    fullOuterJoin.toString = function () {
      return _fullOuterJoin.toString();
    };

    return fullOuterJoin;
  })(function () {
    for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      args[_key11] = arguments[_key11];
    }

    return this.__clause('joins', fullOuterJoin(args));
  }),

  crossJoin: (function (_crossJoin) {
    function crossJoin(_x8) {
      return _crossJoin.apply(this, arguments);
    }

    crossJoin.toString = function () {
      return _crossJoin.toString();
    };

    return crossJoin;
  })(function () {
    for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
      args[_key12] = arguments[_key12];
    }

    return this.__clause('joins', crossJoin(args));
  }),

  joinRaw: (function (_joinRaw) {
    function joinRaw(_x9) {
      return _joinRaw.apply(this, arguments);
    }

    joinRaw.toString = function () {
      return _joinRaw.toString();
    };

    return joinRaw;
  })(function () {
    for (var _len13 = arguments.length, args = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
      args[_key13] = arguments[_key13];
    }

    return this.__clause('joins', joinRaw(args));
  }),

  // GROUP BY ${col}

  groupBy: function groupBy() {
    for (var _len14 = arguments.length, args = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
      args[_key14] = arguments[_key14];
    }

    return this.__clause('groupings', args);
  },

  groupByRaw: function groupByRaw() {
    return this.__clause('groupings', _raw.raw.apply(undefined, arguments));
  },

  // ORDER BY ${col}

  orderBy: function orderBy(column, direction) {
    if (!Array.isArray(column)) {
      return this.orderBy([column], direction);
    }return this.__clause('orderings', new _OrderByClause$UnionClause.OrderByClause(column, direction));
  },

  orderByRaw: function orderByRaw() {
    return this.__clause('orderings', _raw.raw.apply(undefined, arguments));
  },

  // UNION [ALL] ${col}

  union: function union() {
    for (var _len15 = arguments.length, args = Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
      args[_key15] = arguments[_key15];
    }

    return this.__clause('unions', unionDispatch(args));
  },

  unionAll: function unionAll() {
    for (var _len16 = arguments.length, args = Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
      args[_key16] = arguments[_key16];
    }

    return this.__clause('unions', unionDispatch(args, true));
  },

  // LIMIT ${n}

  limit: function limit(value) {
    return this.__clause('limit', value);
  },

  // OFFSET ${n}

  offset: function offset(value) {
    return this.__clause('offset', value);
  },

  // aggregates:

  count: function count(column) {
    return aggregate(this, 'COUNT', column);
  },

  min: function min(column) {
    return aggregate(this, 'MIN', column);
  },

  max: function max(column) {
    return aggregate(this, 'MAX', column);
  },

  sum: function sum(column) {
    return aggregate(this, 'SUM', column);
  },

  avg: function avg(column) {
    return aggregate(this, 'AVG', column);
  },

  // LOCKS: FOR UPDATE / FOR SHARE

  forUpdate: function forUpdate() {
    return this.__clause(lock('update'));
  },

  forShare: function forShare() {
    return this.__clause(lock('share'));
  },

  // Sugar Helpers: first object / pluck key

  first: function first() {
    // onBeforeBuild -> order by, limit ??
    return this.limit(1).addHook('onResult', function (rows) {
      return rows && rows[0];
    });
  },

  pluck: (function (_pluck) {
    function pluck(_x10) {
      return _pluck.apply(this, arguments);
    }

    pluck.toString = function () {
      return _pluck.toString();
    };

    return pluck;
  })(function (column) {
    return this.addHook('onRow', function (row) {
      return pluck(row, column);
    });
  })

};

exports.ISelect = ISelect;
// Aliases:

ISelect.column = ISelect.select;
ISelect.columns = ISelect.select;

function aggregate(builder, fnName, column) {
  var _extractAlias = _isBuilder$extractAlias$wrap.extractAlias(column);

  var ident = _extractAlias[0];
  var aliased = _extractAlias[1];

  var agg = fn(fnName, ident);
  if (aliased) agg = alias(agg, aliased);
  return agg;
}

function int(val) {
  val = parseInt(val, 10);
  if (isNaN(val)) {
    return 0;
  }return val;
}

function join(joinType, args) {
  switch (args.length) {
    case 1:
      return joinArity1(joinType, args[0]);
    case 2:
      return joinArity2(joinType, args[0], args[1]);
    case 3:
      return joinArity3(joinType, args[0], args[1], args[2]);
  }
  return this;
}

function innerJoin(args) {
  return join(INNER, args);
}

function leftJoin(args) {
  return join(LEFT, args);
}

function leftOuterJoin(args) {
  return join(LEFT_OUTER, args);
}

function rightJoin(args) {
  return join(RIGHT, args);
}

function rightOuterJoin(args) {
  return join(RIGHT_OUTER, args);
}

function outerJoin(args) {
  return join(OUTER, args);
}

function fullOuterJoin(args) {
  return join(FULL_OUTER, args);
}

function crossJoin(args) {
  return join(CROSS, args);
}

function joinRaw(sql, bindings) {
  return new RawExpression('joins', sql, bindings);
}

function unionDispatch(_x12) {
  var _arguments = arguments;
  var _again = true;

  _function: while (_again) {
    all = unions = isWrapped = _iterator = _isArray = _i = _iterator = _ref = u = undefined;
    _again = false;
    var args = _x12;
    var all = _arguments[1] === undefined ? false : _arguments[1];

    if (Array.isArray(args[0])) {
      _arguments = [_x12 = [].concat(args[0], [args[1]]), all];
      _again = true;
      continue _function;
    }
    var unions = [];
    var isWrapped = _isBoolean.isBoolean(_last2['default'](args)) ? _last2['default'](args) : false;
    for (var _iterator = args, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var u = _ref;

      if (typeof u === 'function' || _isBuilder$extractAlias$wrap.isBuilder(u)) {
        unions.push(union(u, all, isWrapped));
      }
    }
    return unions;
  }
}

function union(obj, all, wrapped) {
  if (typeof obj === 'function') {
    var qb = new _UnionQueryBuilder.UnionQueryBuilder();
    obj.call(qb, qb);
    return new _OrderByClause$UnionClause.UnionClause(qb, wrapped, all);
  } else if (_isBuilder$extractAlias$wrap.isBuilder(obj)) {
    var qb = new _UnionQueryBuilder.UnionQueryBuilder();
    qb.container = obj.container; // TODO: Robustify this...
    return new _OrderByClause$UnionClause.UnionClause(qb, wrapped, all);
  }
}