'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;

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

// function joinArity1(join) {
//   if (isClause(join)) {

//   }
//   if (isString(join)) {

//   }
//   if (isFucntion(join)) {

//   }
// }

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

var _Clause2 = require('./clause');

var _Clause3 = _interopRequireWildcard(_Clause2);

var _JOIN = require('./keywords');

var Join = (function (_Clause) {
  function Join(joinType, a) {
    _classCallCheck(this, Join);

    _Clause.call(this);
    this.joinType = joinType;
    this.column = column;
    this.value = value;
    this.grouping = 'joins';
    this.type = 'JoinClause';
  }

  _inherits(Join, _Clause);

  Join.prototype.build = function build(compile) {
    var joinType = this.joinType;
    var column = this.column;
    var value = this.value;

    return [joinType, kwd.JOIN, column, value];
  };

  return Join;
})(_Clause3['default']);

function using() {}

function on() {}
function join(joinType, args) {
  switch (args.length) {
    case 1:
      return joinArity1(joinType, args[0]);
    case 2:
      return joinArity2(joinType, args[0], args[1]);
    case 2:
      return joinArity3(joinType, args[0], args[1]);
  }

  if (_.isFunction(first)) {
    exports.join = join = new Join(table, joinType);
    first.call(join, join);
  } else if (joinType === 'raw') {
    exports.join = join = new Join(new Raw(table, first), 'raw');
  } else {
    exports.join = join = new Join(table, joinType);
    if (arguments.length > 1) {
      join.on.apply(join, Array.toArray(arguments).slice(1));
    }
  }
  this._statements.push(join);
  return this;
}

function innerJoin(args) {
  return join(kwd.INNER, args);
}

function leftJoin(args) {
  return join(kwd.LEFT, args);
}

function leftOuterJoin(args) {
  return join(kwd.LEFT_OUTER, args);
}

function rightJoin(args) {
  return join(kwd.RIGHT, args);
}

function rightOuterJoin(args) {
  return join(kwd.RIGHT_OUTER, args);
}

function outerJoin(args) {
  return join(kwd.OUTER, args);
}

function fullOuterJoin(args) {
  return join(kwd.FULL_OUTER, args);
}

function crossJoin(args) {
  return join(kwd.CROSS, args);
}

function joinRaw(sql, bindings) {
  return new Join(raw(sql, bindings));
}