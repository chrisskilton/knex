'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _JOIN$INNER$LEFT$LEFT_OUTER$RIGHT$RIGHT_OUTER$OUTER$FULL_OUTER$CROSS = require('../sql/keywords');

var IJoin = {

  // Adds an "on" clause to the current join object.
  on: function on(first, operator, second) {
    if (typeof first === 'function') {
      return new JoinBuilder();
    }
    switch (arguments.length) {
      case 1:
        data = ['on', this._bool(), first];break;
      case 2:
        data = ['on', this._bool(), first, '=', operator];break;
      default:
        data = ['on', this._bool(), first, operator, second];
    }
    this.clauses.push(data);
    return this;
  },

  // Adds a "using" clause to the current join.
  using: (function (_using) {
    function using() {
      return _using.apply(this, arguments);
    }

    using.toString = function () {
      return _using.toString();
    };

    return using;
  })(function () {
    return using.apply(undefined, arguments);
  }),

  orUsing: function orUsing() {
    return or(usingDispatch.apply(undefined, arguments));
  },

  // Adds an "or on" clause to the current join object.
  orOn: function orOn(first, operator, second) {
    return or(onDispatch.apply(undefined, arguments));
  },

  // Explicitly set the type of join, useful within a function when creating a grouped join.
  type: (function (_type) {
    function type(_x) {
      return _type.apply(this, arguments);
    }

    type.toString = function () {
      return _type.toString();
    };

    return type;
  })(function (type) {
    this.joinType = type;
    return this;
  })

};

exports.IJoin = IJoin;
IJoin.andOn = IJoin.on;

function onDispatch() {
  return new JoinExpression();
}

function usingDispatch() {}

var JoinExpression = function JoinExpression() {
  _classCallCheck(this, JoinExpression);
};

var JoinClause = (function () {
  function JoinClause(joinType, a) {
    _classCallCheck(this, JoinClause);

    this.joinType = joinType;
    this.column = column;
    this.value = value;
    this['@@knex/hook'] = 'join';
  }

  JoinClause.prototype.compile = function compile() {
    var joinType = this.joinType;
    var column = this.column;
    var value = this.value;

    return [joinType, _JOIN$INNER$LEFT$LEFT_OUTER$RIGHT$RIGHT_OUTER$OUTER$FULL_OUTER$CROSS.JOIN, column, value];
  };

  return JoinClause;
})();

var OnClause = function OnClause() {
  _classCallCheck(this, OnClause);
};

var UsingClause = function UsingClause() {
  _classCallCheck(this, UsingClause);
};

// var joins = this.grouped.join;
// if (!joins) return '';
// var sql = _.reduce(joins, function(acc, join) {
//   if (join.joinType === 'raw') {
//     acc.push(this.formatter.checkRaw(join.table));
//   } else {
//     acc.push(join.joinType + ' join ' + this.formatter.wrap(join.table));
//     _.each(join.clauses, function(clause, i) {
//       acc.push(i > 0 ? clause[1] : clause[0]);
//       acc.push(this.formatter.wrap(clause[2]));
//       if (clause[3]) acc.push(this.formatter.operator(clause[3]));
//       if (clause[4]) acc.push(this.formatter.wrap(clause[4]));
//     }, this);
//   }
//   return acc;
// }, [], this);
// return sql.length > 0 ? sql.join(' ') : '';