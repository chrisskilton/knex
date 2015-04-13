'use strict';

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols = require('transduce');

var _wrap$knexFlatten$columnize$commaDelimit$isKeyword = require('../helpers');

var _COMMA$LEFT_PAREN$RIGHT_PAREN = require('../sql/delimiters');

var _ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET = require('../sql/keywords');

var _identifier$parameter = require('../sql');

var _protocols$transducer = _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.protocols.transducer;
var tStep = _protocols$transducer.step;
var tResult = _protocols$transducer.result;

var ColumnIterable = (function () {
  function ColumnIterable() {
    var columns = arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, ColumnIterable);

    this.columns = columns;
    this['@@knex/hook'] = 'columns';
  }

  ColumnIterable.prototype[_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterSymbol] = function () {
    if (this.columns.length === 0) {
      return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterator([_ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET._ALL_]);
    }
    return _wrap$knexFlatten$columnize$commaDelimit$isKeyword.columnize(this.columns);
  };

  return ColumnIterable;
})();

exports.ColumnIterable = ColumnIterable;

var OrderingIterable = (function () {
  function OrderingIterable(orderings) {
    _classCallCheck(this, OrderingIterable);

    this.orderings = orderings;
    this['@@knex/hook'] = 'clause:orderings';
  }

  OrderingIterable.prototype[_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterSymbol] = function () {
    if (!this.orderings) return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterdone;
    return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterator([_ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET.ORDER_BY, _wrap$knexFlatten$columnize$commaDelimit$isKeyword.commaDelimit(this.orderings)]);
  };

  return OrderingIterable;
})();

exports.OrderingIterable = OrderingIterable;

var OrderByClause = (function () {
  function OrderByClause(value) {
    var direction = arguments[1] === undefined ? _ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET.ASC : arguments[1];

    _classCallCheck(this, OrderByClause);

    this.value = value;
    this.direction = direction;
    this['@@knex/hook'] = 'clause:order';
  }

  OrderByClause.prototype[_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterSymbol] = function () {
    if (!this.value) return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterdone;
    return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterator([_wrap$knexFlatten$columnize$commaDelimit$isKeyword.columnize(this.value), this.direction]);
  };

  return OrderByClause;
})();

exports.OrderByClause = OrderByClause;

var UnionsIterable = (function () {
  function UnionsIterable(unions) {
    _classCallCheck(this, UnionsIterable);

    this.unions = unions;
    this['@@knex/hook'] = 'clause:unions';
  }

  UnionsIterable.prototype[_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterSymbol] = function () {
    if (!this.unions) return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterdone;
    return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterator(this.unions);
  };

  return UnionsIterable;
})();

exports.UnionsIterable = UnionsIterable;

var UnionClause = (function () {
  function UnionClause(value, wrapped, all) {
    _classCallCheck(this, UnionClause);

    this.wrapped = wrapped;
    this.value = value;
    this.all = all;
    this['@@knex/hook'] = 'clause:union';
  }

  UnionClause.prototype[_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterSymbol] = function () {
    return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterator([this.wrapped ? _COMMA$LEFT_PAREN$RIGHT_PAREN.LEFT_PAREN : undefined, this.all ? _ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET.UNION_ALL : _ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET.UNION, this.value, this.wrapped ? _COMMA$LEFT_PAREN$RIGHT_PAREN.RIGHT_PAREN : undefined]);
  };

  return UnionClause;
})();

exports.UnionClause = UnionClause;

var WhereClause = (function () {
  function WhereClause(column, operator, value) {
    _classCallCheck(this, WhereClause);

    this.column = column;
    this.operator = operator;
    this.value = value;
    this.__negated = false;
    this.__or = false;
    this['@@knex/hook'] = 'clause:where';
  }

  // [WHERE | AND | OR] [NOT] [EXISTS | BETWEEN | IN] value

  WhereClause.prototype[_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterSymbol] = function () {
    var prefixNot = this.__negated && !_wrap$knexFlatten$columnize$commaDelimit$isKeyword.isKeyword(this.operator);
    var suffixNot = this.__negated && _wrap$knexFlatten$columnize$commaDelimit$isKeyword.isKeyword(this.operator) && this.operator['@@knex/value'] !== 'IS';
    var opNot = this.__negated && _wrap$knexFlatten$columnize$commaDelimit$isKeyword.isKeyword(this.operator) && this.operator['@@knex/value'] === 'IS';
    return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterator([this.__or ? _ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET.OR : _ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET.AND, prefixNot ? _ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET.NOT : undefined, _identifier$parameter.identifier(this.column), suffixNot ? _ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET.NOT : undefined, this.operator, opNot ? _ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET.NOT : undefined, _identifier$parameter.parameter(this.value)]);
  };

  return WhereClause;
})();

exports.WhereClause = WhereClause;

var WhereIterable = (function () {
  function WhereIterable(wheres) {
    _classCallCheck(this, WhereIterable);

    this.clauses = wheres;
    this['@@knex/hook'] = 'clause:wheres';
  }

  WhereIterable.prototype[_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterSymbol] = function () {
    return new WhereHavingIterator(this.clauses, _ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET.WHERE);
  };

  return WhereIterable;
})();

exports.WhereIterable = WhereIterable;

var GroupedWhereIterable = (function () {
  function GroupedWhereIterable(wheres) {
    _classCallCheck(this, GroupedWhereIterable);

    this.clauses = wheres;
    this['@@knex/hook'] = 'clause:groupedWheres';
  }

  GroupedWhereIterable.prototype[_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterSymbol] = function () {
    return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.lazySeq(_wrap$knexFlatten$columnize$commaDelimit$isKeyword.wrap, new WhereHavingIterator(this.clauses));
  };

  return GroupedWhereIterable;
})();

exports.GroupedWhereIterable = GroupedWhereIterable;

var HavingIterable = (function () {
  function HavingIterable() {
    _classCallCheck(this, HavingIterable);
  }

  HavingIterable.prototype[_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterSymbol] = function () {
    return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterdone;
  };

  return HavingIterable;
})();

exports.HavingIterable = HavingIterable;

var GroupedHavingIterable = (function (_HavingIterable) {
  function GroupedHavingIterable() {
    _classCallCheck(this, GroupedHavingIterable);

    if (_HavingIterable != null) {
      _HavingIterable.apply(this, arguments);
    }
  }

  _inherits(GroupedHavingIterable, _HavingIterable);

  GroupedHavingIterable.prototype[_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterSymbol] = function () {
    return [_COMMA$LEFT_PAREN$RIGHT_PAREN.LEFT_PAREN, dropFirstClause(HavingIterable, this.havings), _COMMA$LEFT_PAREN$RIGHT_PAREN.RIGHT_PAREN];
  };

  return GroupedHavingIterable;
})(HavingIterable);

exports.GroupedHavingIterable = GroupedHavingIterable;

var GroupingIterable = (function () {
  function GroupingIterable(value) {
    _classCallCheck(this, GroupingIterable);

    this.groupings = value;
    this['@@knex/hook'] = 'clause:grouping';
  }

  GroupingIterable.prototype[_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterSymbol] = function () {
    if (!this.groupings) return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterdone;
    return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterator([_ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET.GROUP_BY, _wrap$knexFlatten$columnize$commaDelimit$isKeyword.columnize(this.groupings)]);
  };

  return GroupingIterable;
})();

exports.GroupingIterable = GroupingIterable;

var JoinIterable = (function () {
  function JoinIterable() {
    _classCallCheck(this, JoinIterable);
  }

  JoinIterable.prototype[_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterSymbol] = function () {
    return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterator([]);
  };

  return JoinIterable;
})();

exports.JoinIterable = JoinIterable;

var GroupedJoinIterable = (function (_JoinIterable) {
  function GroupedJoinIterable() {
    _classCallCheck(this, GroupedJoinIterable);

    if (_JoinIterable != null) {
      _JoinIterable.apply(this, arguments);
    }
  }

  _inherits(GroupedJoinIterable, _JoinIterable);

  return GroupedJoinIterable;
})(JoinIterable);

exports.GroupedJoinIterable = GroupedJoinIterable;

var LimitIterable = (function () {
  function LimitIterable(value) {
    _classCallCheck(this, LimitIterable);

    this.value = value;
    this['@@knex/hook'] = 'clause:limit';
  }

  LimitIterable.prototype[_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterSymbol] = function () {
    if (!this.value) return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterdone;
    return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterator([_ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET.LIMIT, _identifier$parameter.parameter(this.value)]);
  };

  return LimitIterable;
})();

exports.LimitIterable = LimitIterable;

var WhereHavingIterator = (function () {
  function WhereHavingIterator(clauses, keyword) {
    _classCallCheck(this, WhereHavingIterator);

    this.clauses = clauses;
    this.keyword = keyword;
    this.seen = false;
    this.idx = 0;
  }

  WhereHavingIterator.prototype.next = function next() {
    if (!this.clauses || this.idx >= this.clauses.length) {
      return { done: true, value: undefined };
    }if (!this.seen) {
      this.seen = true;
      return { done: false, value: [this.keyword, _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.lazySeq(_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.drop(1), this.clauses[this.idx++])] };
    }
    return { done: false, value: this.clauses[this.idx++] };
  };

  return WhereHavingIterator;
})();

var ClauseIterable = (function () {
  function ClauseIterable() {
    _classCallCheck(this, ClauseIterable);
  }

  ClauseIterable.prototype[_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterSymbol] = function () {
    return new ClauseIterator(this.value);
  };

  return ClauseIterable;
})();

var ClauseIterator = (function () {
  function ClauseIterator(value) {
    _classCallCheck(this, ClauseIterator);

    this.value = value;
    this.idx = 0;
  }

  ClauseIterator.prototype.next = function next() {
    if (!this.value || this.idx >= this.value.length) {
      return { done: true, value: undefined };
    }return { done: false, value: this.value[this.idx++] };
  };

  return ClauseIterator;
})();

var FromIterable = (function (_ClauseIterable) {
  function FromIterable(value) {
    _classCallCheck(this, FromIterable);

    _ClauseIterable.call(this);
    if (value === undefined) {
      throw new Error('Missing "from" clause in Query Statement');
    }
    this.idx = 0;
    this.value = [_ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET.FROM, _wrap$knexFlatten$columnize$commaDelimit$isKeyword.knexFlatten(_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.map(function (v) {
      return _identifier$parameter.identifier(v);
    }), value)];
    this.distinct = false;
    this.alias = undefined;
    this.complete = !!value;
    this['@@knex/hook'] = 'clause:from';
  }

  _inherits(FromIterable, _ClauseIterable);

  return FromIterable;
})(ClauseIterable);

exports.FromIterable = FromIterable;

var OffsetIterable = (function () {
  function OffsetIterable(value) {
    _classCallCheck(this, OffsetIterable);

    this.value = value;
    this['@@knex/hook'] = 'clause:offset';
  }

  OffsetIterable.prototype[_map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterSymbol] = function () {
    if (!this.value) return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterdone;
    return _map$drop$lazySeq$iterSymbol$iterator$iterdone$lazySeq$interpose$protocols.iterator([_ALL_$FROM$OR$WHERE$AND$NOT$ASC$ORDER_BY$UNION$GROUP_BY$UNION_ALL$LIMIT$OFFSET.OFFSET, this.value]);
  };

  return OffsetIterable;
})();

exports.OffsetIterable = OffsetIterable;