'use strict';

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

var _extractAlias3 = require('../helpers');

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

    return this.__clause('from', args);
  },

  // Sets the `tableName` on the query.
  // Alias to "from" for select and "into" for insert clauses
  // e.g. builder.insert({a: value}).into('tableName')
  table: (function (_table) {
    function table(_x) {
      return _table.apply(this, arguments);
    }

    table.toString = function () {
      return _table.toString();
    };

    return table;
  })(function (tableName) {
    var _extractAlias = _extractAlias3.extractAlias(tableName);

    var tbl = _extractAlias[0];
    var aliased = _extractAlias[1];

    tbl = table(tbl);
    if (aliased) tbl = aliasAs(tbl, aliased);
    return this.__clause('table', tbl);
  }),

  // Adds a `distinct` clause to the query.
  distinct: function distinct() {
    var _clause;

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return (_clause = this.__clause('distinct', true)).select.apply(_clause, args);
  },

  // JOIN(s)

  join: function join() {
    return this.__clause('joins', innerJoin.apply(undefined, arguments));
  },

  innerJoin: (function (_innerJoin) {
    function innerJoin() {
      return _innerJoin.apply(this, arguments);
    }

    innerJoin.toString = function () {
      return _innerJoin.toString();
    };

    return innerJoin;
  })(function () {
    return this.__clause('joins', innerJoin.apply(undefined, arguments));
  }),

  leftJoin: (function (_leftJoin) {
    function leftJoin() {
      return _leftJoin.apply(this, arguments);
    }

    leftJoin.toString = function () {
      return _leftJoin.toString();
    };

    return leftJoin;
  })(function () {
    return this.__clause('joins', leftJoin.apply(undefined, arguments));
  }),

  leftOuterJoin: (function (_leftOuterJoin) {
    function leftOuterJoin() {
      return _leftOuterJoin.apply(this, arguments);
    }

    leftOuterJoin.toString = function () {
      return _leftOuterJoin.toString();
    };

    return leftOuterJoin;
  })(function () {
    return this.__clause('joins', leftOuterJoin.apply(undefined, arguments));
  }),

  rightJoin: (function (_rightJoin) {
    function rightJoin() {
      return _rightJoin.apply(this, arguments);
    }

    rightJoin.toString = function () {
      return _rightJoin.toString();
    };

    return rightJoin;
  })(function () {
    return this.__clause('joins', rightJoin.apply(undefined, arguments));
  }),

  rightOuterJoin: (function (_rightOuterJoin) {
    function rightOuterJoin() {
      return _rightOuterJoin.apply(this, arguments);
    }

    rightOuterJoin.toString = function () {
      return _rightOuterJoin.toString();
    };

    return rightOuterJoin;
  })(function () {
    return this.__clause('joins', rightOuterJoin.apply(undefined, arguments));
  }),

  outerJoin: (function (_outerJoin) {
    function outerJoin() {
      return _outerJoin.apply(this, arguments);
    }

    outerJoin.toString = function () {
      return _outerJoin.toString();
    };

    return outerJoin;
  })(function () {
    return this.__clause('joins', outerJoin.apply(undefined, arguments));
  }),

  fullOuterJoin: (function (_fullOuterJoin) {
    function fullOuterJoin() {
      return _fullOuterJoin.apply(this, arguments);
    }

    fullOuterJoin.toString = function () {
      return _fullOuterJoin.toString();
    };

    return fullOuterJoin;
  })(function () {
    return this.__clause('joins', fullOuterJoin.apply(undefined, arguments));
  }),

  crossJoin: (function (_crossJoin) {
    function crossJoin() {
      return _crossJoin.apply(this, arguments);
    }

    crossJoin.toString = function () {
      return _crossJoin.toString();
    };

    return crossJoin;
  })(function () {
    return this.__clause('joins', crossJoin.apply(undefined, arguments));
  }),

  joinRaw: (function (_joinRaw) {
    function joinRaw() {
      return _joinRaw.apply(this, arguments);
    }

    joinRaw.toString = function () {
      return _joinRaw.toString();
    };

    return joinRaw;
  })(function () {
    return this.__clause('joins', joinRaw.apply(undefined, arguments));
  }),

  // GROUP BY ${col}

  groupBy: (function (_groupBy) {
    function groupBy(_x2) {
      return _groupBy.apply(this, arguments);
    }

    groupBy.toString = function () {
      return _groupBy.toString();
    };

    return groupBy;
  })(function (item) {
    return this.__clause(groupBy(item));
  }),

  groupByRaw: function groupByRaw(sql, bindings) {
    return this.__clause(groupBy(raw(sql, bindings)));
  },

  // ORDER BY ${col}

  orderBy: function orderBy(column, direction) {
    return this.__clause('orderings', [column, direction]);
  },

  orderByRaw: function orderByRaw(sql, bindings) {
    return this.__clause('orderings', raw(sql, bindings));
  },

  // UNION [ALL] ${col}

  union: (function (_union) {
    function union(_x3, _x4) {
      return _union.apply(this, arguments);
    }

    union.toString = function () {
      return _union.toString();
    };

    return union;
  })(function (value, wrap) {
    if (wrap) return this.__clause(wrap(union(value)));
    return this.__clause(union(value));
  }),

  unionAll: (function (_unionAll) {
    function unionAll(_x5, _x6) {
      return _unionAll.apply(this, arguments);
    }

    unionAll.toString = function () {
      return _unionAll.toString();
    };

    return unionAll;
  })(function (value, wrap) {
    if (wrap) return this.__clause(wrap(unionAll(value)));
    return this.__clause(unionAll(value));
  }),

  // LIMIT ${n}

  limit: (function (_limit) {
    function limit(_x7) {
      return _limit.apply(this, arguments);
    }

    limit.toString = function () {
      return _limit.toString();
    };

    return limit;
  })(function (value) {
    return this.__clause(limit(value));
  }),

  // OFFSET ${n}

  offset: (function (_offset) {
    function offset(_x8) {
      return _offset.apply(this, arguments);
    }

    offset.toString = function () {
      return _offset.toString();
    };

    return offset;
  })(function (value) {
    return this.__clause(offset(value));
  }),

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
    return this.addHook('onResult', function (rows) {
      return rows && rows[0];
    });
  },

  pluck: (function (_pluck) {
    function pluck(_x9) {
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
  var _extractAlias2 = _extractAlias3.extractAlias(column);

  var ident = _extractAlias2[0];
  var aliased = _extractAlias2[1];

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