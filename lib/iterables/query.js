'use strict';

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _SELECT$DISTINCT = require('../sql/keywords');

var _LEFT_PAREN$RIGHT_PAREN = require('../sql/delimiters');

var _iterator$iterSymbol = require('transduce');

var _ColumnIterable$FromIterable$WhereIterable$JoinIterable$GroupingIterable$HavingIterable$OrderingIterable$LimitIterable$OffsetIterable = require('./clauses');

var QueryIterable = (function () {
  function QueryIterable(container) {
    _classCallCheck(this, QueryIterable);

    this.container = container;
    this['@@knex/hook'] = 'statement:select';
  }

  QueryIterable.prototype[_iterator$iterSymbol.iterSymbol] = function () {
    var t = this.container;
    return _iterator$iterSymbol.iterator([_SELECT$DISTINCT.SELECT, t.has('distinct') ? _SELECT$DISTINCT.DISTINCT : undefined, new _ColumnIterable$FromIterable$WhereIterable$JoinIterable$GroupingIterable$HavingIterable$OrderingIterable$LimitIterable$OffsetIterable.ColumnIterable(t.get('columns')), new _ColumnIterable$FromIterable$WhereIterable$JoinIterable$GroupingIterable$HavingIterable$OrderingIterable$LimitIterable$OffsetIterable.FromIterable(t.get('from') || this.get('table')), new _ColumnIterable$FromIterable$WhereIterable$JoinIterable$GroupingIterable$HavingIterable$OrderingIterable$LimitIterable$OffsetIterable.WhereIterable(t.get('wheres')), new _ColumnIterable$FromIterable$WhereIterable$JoinIterable$GroupingIterable$HavingIterable$OrderingIterable$LimitIterable$OffsetIterable.JoinIterable(t.get('joins')), new _ColumnIterable$FromIterable$WhereIterable$JoinIterable$GroupingIterable$HavingIterable$OrderingIterable$LimitIterable$OffsetIterable.GroupingIterable(t.get('groupings')), new _ColumnIterable$FromIterable$WhereIterable$JoinIterable$GroupingIterable$HavingIterable$OrderingIterable$LimitIterable$OffsetIterable.HavingIterable(t.get('havings')), new _ColumnIterable$FromIterable$WhereIterable$JoinIterable$GroupingIterable$HavingIterable$OrderingIterable$LimitIterable$OffsetIterable.OrderingIterable(t.get('orderBy')), new _ColumnIterable$FromIterable$WhereIterable$JoinIterable$GroupingIterable$HavingIterable$OrderingIterable$LimitIterable$OffsetIterable.LimitIterable(t.last('limit')), new _ColumnIterable$FromIterable$WhereIterable$JoinIterable$GroupingIterable$HavingIterable$OrderingIterable$LimitIterable$OffsetIterable.OffsetIterable(t.last('offset'))]);
  };

  return QueryIterable;
})();

exports.QueryIterable = QueryIterable;

var SubQueryIterable = (function (_QueryIterable) {
  function SubQueryIterable() {
    _classCallCheck(this, SubQueryIterable);

    if (_QueryIterable != null) {
      _QueryIterable.apply(this, arguments);
    }
  }

  _inherits(SubQueryIterable, _QueryIterable);

  SubQueryIterable.prototype[_iterator$iterSymbol.iterSymbol] = function () {
    return _iterator$iterSymbol.iterator([_LEFT_PAREN$RIGHT_PAREN.LEFT_PAREN, _QueryIterable.prototype[_iterator$iterSymbol.iterSymbol].call(this), _LEFT_PAREN$RIGHT_PAREN.RIGHT_PAREN]);
  };

  return SubQueryIterable;
})(QueryIterable);

exports.SubQueryIterable = SubQueryIterable;