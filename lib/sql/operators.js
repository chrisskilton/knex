'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.__esModule = true;
exports.between = between;
exports.any = any;
exports.some = some;

// Comparison

// =
exports.eq = eq;

// !=, <>
exports.notEq = notEq;

// <
exports.lt = lt;

// >
exports.gt = gt;

// <=
exports.lte = lte;

// >=
exports.gte = gte;

// Mathematical

// +
exports.add = add;

// -
exports.subtract = subtract;

// *
exports.multiply = multiply;

// /
exports.divided = divided;

// %
exports.modulo = modulo;

// ^
exports.exponent = exponent;

// |/
exports.sqrt = sqrt;

// ||/
exports.cubeRoot = cubeRoot;

// !
exports.factorial = factorial;

// !!
exports.factorialPrefix = factorialPrefix;

// @
exports.abs = abs;

// &
exports.bitwiseAnd = bitwiseAnd;

// |
exports.bitwiseOr = bitwiseOr;

// #
exports.xor = xor;

// ~
exports.bitwiseNot = bitwiseNot;

// <<
exports.rightShift = rightShift;

// <<
exports.leftShift = leftShift;

// IS NULL
exports.isNull = isNull;
exports.like = like;
exports.ilike = ilike;
exports.rlike = rlike;
exports.regexp = regexp;

var _import = require('./keywords');

var kwd = _interopRequireWildcard(_import);

var _p = require('./index');

var _i = require('./identifier');

var Operator = (function () {
  function Operator() {
    _classCallCheck(this, Operator);
  }

  _createClass(Operator, [{
    key: 'grouping',
    get: function () {
      return this.statement.grouping;
    }
  }]);

  return Operator;
})();

var AllOperator = (function () {
  function AllOperator(expression, comparison, subquery) {
    _classCallCheck(this, AllOperator);

    this.expression = expression;
    this.comparison = comparison;
    this.subquery = subquery;
    this.type = 'AllOperator';
  }

  AllOperator.prototype.nodes = function nodes() {
    return [this.value, this.statement];
  };

  return AllOperator;
})();

function all(fn) {}

// <, >, <=, >=, =, <>, !=, BETWEEN

var ComparisonOperator = (function () {
  function ComparisonOperator(operator, lhs, rhs) {
    _classCallCheck(this, ComparisonOperator);

    this.lhs = lhs;
    this.rhs = rhs;
    this.operator = operator;
    this.type = 'ComparisonOperator';
  }

  ComparisonOperator.prototype.nodes = function nodes() {
    return [_i.identifier(this.lhs), this.operator, _p.parameter(this.rhs)];
  };

  return ComparisonOperator;
})();

var BetweenOperator = (function () {
  function BetweenOperator() {
    _classCallCheck(this, BetweenOperator);
  }

  BetweenOperator.prototype.nodes = function nodes() {
    return [this.operator, _p.parameter(this.lhs), kwd.AND, _p.parameter(this.rhs)];
  };

  return BetweenOperator;
})();

// +, -, *, /, %, ^, |/, ||/, !, !!, @, &, |, #, ~, <<, >>

var ArithmeticOperator = (function () {
  function ArithmeticOperator() {
    _classCallCheck(this, ArithmeticOperator);

    this.type = 'ArithmeticOperator';
  }

  ArithmeticOperator.prototype.nodes = function nodes() {};

  return ArithmeticOperator;
})();

function between(a, b) {
  return new BetweenOperator(kwd.BETWEEN, a, b);
}

function any(subquery) {}

function some(subquery) {}

function eq() {}

function notEq() {}

function lt() {}

function gt() {}

function lte() {}

function gte() {}

function add(a, b) {}

function subtract() {}

function multiply() {}

function divided() {}

function modulo() {}

function exponent() {}

function sqrt() {}

function cubeRoot() {}

function factorial() {}

function factorialPrefix() {}

function abs() {}

function bitwiseAnd() {}

function bitwiseOr() {}

function xor() {}

function bitwiseNot() {}

function rightShift() {}

function leftShift() {}

function isNull() {}

function like() {}

function ilike() {}

function rlike() {}

function regexp() {}

// // MySQL:
// '=', '<', '>', '<=', '>=', '<>', '!=',
// 'like', 'not like', 'between', 'ilike',
// '&', '|', '^', '<<', '>>',
// 'rlike', 'regexp', 'not regexp'

// // Oracle:
// '=', '<', '>', '<=', '>=', '<>', '!=',
// 'like', 'not like', 'between', 'ilike',
// '&', '|', '^', '<<', '>>',
// 'rlike', 'regexp', 'not regexp'

// // PG:
// '=', '<', '>', '<=', '>=', '<>', '!=',
// 'like', 'not like', 'between', 'ilike', '~', '~*', '!~', '!~*',
// '&', '|', '#', '<<', '>>', '&&', '^', '@>', '<@', '||'

// // Baseline:
// '=', '<', '>', '<=', '>=', '<>', '!=',
// 'like', 'not like', 'between', 'ilike',
// '&', '|', '^', '<<', '>>',
// 'rlike', 'regexp', 'not regexp'

// // SQLite3:
// '=', '<', '>', '<=', '>=', '<>', '!=',
// 'like', 'not like', 'between', 'ilike',
// '&', '|', '<<', '>>'