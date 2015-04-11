'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _forEach = require('lodash/collection/forEach');

var _forEach2 = _interopRequireWildcard(_forEach);

var _map$protocols$Transducer$lazySeq$iterator$iterSymbol = require('transduce');

var _LEFT_PAREN$RIGHT_PAREN = require('../../sql/delimiters');

var _AND$OR$NOT$WHERE$isKeyword = require('../../sql/keywords');

var _i = require('../../sql/identifier');

var _p = require('../../sql');

var _WhereHavingIterable3 = require('./abstract');

var _protocols$transducer = _map$protocols$Transducer$lazySeq$iterator$iterSymbol.protocols.transducer;
var tStep = _protocols$transducer.step;
var tResult = _protocols$transducer.result;

var WhereClauseIterable = (function () {
  function WhereClauseIterable(where) {
    _classCallCheck(this, WhereClauseIterable);

    this.where = where;
    this['@@knex/hook'] = 'clause:where';
  }

  // [WHERE | AND | OR] [NOT] [EXISTS | BETWEEN | IN] value

  WhereClauseIterable.prototype[_map$protocols$Transducer$lazySeq$iterator$iterSymbol.iterSymbol] = function () {
    var where = this.where;

    if (Array.isArray(where)) {
      return _map$protocols$Transducer$lazySeq$iterator$iterSymbol.lazySeq(_map$protocols$Transducer$lazySeq$iterator$iterSymbol.map(function (val) {
        return new WhereClauseIterable(val);
      }), where);
    }
    var prefixNot = where.__negated && !_AND$OR$NOT$WHERE$isKeyword.isKeyword(where.operator);
    var suffixNot = where.__negated && _AND$OR$NOT$WHERE$isKeyword.isKeyword(where.operator);
    return _map$protocols$Transducer$lazySeq$iterator$iterSymbol.iterator([where.__or ? _AND$OR$NOT$WHERE$isKeyword.OR : _AND$OR$NOT$WHERE$isKeyword.AND, prefixNot ? _AND$OR$NOT$WHERE$isKeyword.NOT : undefined, _i.identifier(where.column), suffixNot ? _AND$OR$NOT$WHERE$isKeyword.NOT : undefined, where.operator, _p.parameter(where.value)]);
  };

  return WhereClauseIterable;
})();

exports.WhereClauseIterable = WhereClauseIterable;

var WhereIterable = (function (_WhereHavingIterable) {
  function WhereIterable(wheres) {
    _classCallCheck(this, WhereIterable);

    _WhereHavingIterable.call(this, _AND$OR$NOT$WHERE$isKeyword.WHERE, WhereClauseIterable);
    this.clauses = wheres;
    this['@@knex/hook'] = 'clause:wheres';
  }

  _inherits(WhereIterable, _WhereHavingIterable);

  return WhereIterable;
})(_WhereHavingIterable3.WhereHavingIterable);

exports.WhereIterable = WhereIterable;

var GroupedWhereIterable = (function (_WhereHavingIterable2) {
  function GroupedWhereIterable(wheres) {
    _classCallCheck(this, GroupedWhereIterable);

    _WhereHavingIterable2.call(this, undefined, WhereClauseIterable);
    this.clauses = wheres;
    this['@@knex/hook'] = 'clause:groupedWheres';
  }

  _inherits(GroupedWhereIterable, _WhereHavingIterable2);

  GroupedWhereIterable.prototype[_map$protocols$Transducer$lazySeq$iterator$iterSymbol.iterSymbol] = function () {
    return _map$protocols$Transducer$lazySeq$iterator$iterSymbol.lazySeq(wrap, _WhereHavingIterable2.prototype[_map$protocols$Transducer$lazySeq$iterator$iterSymbol.iterSymbol].call(this));
  };

  return GroupedWhereIterable;
})(_WhereHavingIterable3.WhereHavingIterable);

exports.GroupedWhereIterable = GroupedWhereIterable;

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
      result = this.xfStep(result, _LEFT_PAREN$RIGHT_PAREN.LEFT_PAREN);
      _forEach2['default'](this.buffered, function (val) {
        result = _this.xfStep(result, val);
      });
      result = this.xfStep(result, _LEFT_PAREN$RIGHT_PAREN.RIGHT_PAREN);
    }
    return this.xfResult(result);
  };

  return Wrapping;
})(_map$protocols$Transducer$lazySeq$iterator$iterSymbol.Transducer);

var wrap = function wrap(xf) {
  return new Wrapping(xf);
};