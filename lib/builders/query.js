'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;

var _forEach = require('lodash/collection/forEach');

var _forEach2 = _interopRequireWildcard(_forEach);

var _iterSymbol$iterator = require('transduce');

var _AbstractBuilder6 = require('./abstract');

var _mixin = require('../helpers');

var _HookContainer = require('../containers/hooks');

var _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable = require('../interfaces');

var _GroupedWhereIterable$GroupedHavingIterable$SubQueryIterable$UnionQueryIterable = require('../iterables');

var BaseBuilder = (function (_AbstractBuilder) {
  function BaseBuilder(engine) {
    _classCallCheck(this, BaseBuilder);

    _AbstractBuilder.call(this, engine);
    this.hooks = new _HookContainer.HookContainer();
    if (engine && typeof engine.initBuilder === 'function') {
      engine.initBuilder(this);
    }
  }

  _inherits(BaseBuilder, _AbstractBuilder);

  return BaseBuilder;
})(_AbstractBuilder6.AbstractBuilder);

exports.BaseBuilder = BaseBuilder;

_mixin.mixin(BaseBuilder, _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable.ISelect);
_mixin.mixin(BaseBuilder, _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable.IWhere);
_mixin.mixin(BaseBuilder, _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable.IHaving);
_mixin.mixin(BaseBuilder, _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable.IDelete);
_mixin.mixin(BaseBuilder, _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable.IUpdate);
_mixin.mixin(BaseBuilder, _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable.ITruncate);
_mixin.mixin(BaseBuilder, _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable.IColumninfo);
_mixin.mixin(BaseBuilder, _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable.IRunnable);
_mixin.mixin(BaseBuilder, _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable.IIterable);

var SubQueryBuilder = (function (_AbstractBuilder2) {
  function SubQueryBuilder() {
    _classCallCheck(this, SubQueryBuilder);

    if (_AbstractBuilder2 != null) {
      _AbstractBuilder2.apply(this, arguments);
    }
  }

  _inherits(SubQueryBuilder, _AbstractBuilder2);

  SubQueryBuilder.prototype[_iterSymbol$iterator.iterSymbol] = function () {
    return _iterSymbol$iterator.iterator(new _GroupedWhereIterable$GroupedHavingIterable$SubQueryIterable$UnionQueryIterable.SubQueryIterable(this.container));
  };

  return SubQueryBuilder;
})(_AbstractBuilder6.AbstractBuilder);

exports.SubQueryBuilder = SubQueryBuilder;

_mixin.mixin(SubQueryBuilder, _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable.ISelect);
_mixin.mixin(SubQueryBuilder, _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable.IWhere);
_mixin.mixin(SubQueryBuilder, _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable.IHaving);

var UnionQueryBuilder = (function (_SubQueryBuilder) {
  function UnionQueryBuilder() {
    _classCallCheck(this, UnionQueryBuilder);

    if (_SubQueryBuilder != null) {
      _SubQueryBuilder.apply(this, arguments);
    }
  }

  _inherits(UnionQueryBuilder, _SubQueryBuilder);

  UnionQueryBuilder.prototype[_iterSymbol$iterator.iterSymbol] = function () {
    return _iterSymbol$iterator.iterator(new _GroupedWhereIterable$GroupedHavingIterable$SubQueryIterable$UnionQueryIterable.UnionQueryIterable(this.container));
  };

  return UnionQueryBuilder;
})(SubQueryBuilder);

exports.UnionQueryBuilder = UnionQueryBuilder;

var GroupedWhereBuilder = (function (_AbstractBuilder3) {
  function GroupedWhereBuilder() {
    _classCallCheck(this, GroupedWhereBuilder);

    if (_AbstractBuilder3 != null) {
      _AbstractBuilder3.apply(this, arguments);
    }
  }

  _inherits(GroupedWhereBuilder, _AbstractBuilder3);

  GroupedWhereBuilder.prototype[_iterSymbol$iterator.iterSymbol] = function () {
    return _iterSymbol$iterator.iterator(new _GroupedWhereIterable$GroupedHavingIterable$SubQueryIterable$UnionQueryIterable.GroupedWhereIterable(this.container.get('wheres')));
  };

  return GroupedWhereBuilder;
})(_AbstractBuilder6.AbstractBuilder);

exports.GroupedWhereBuilder = GroupedWhereBuilder;

_mixin.mixin(GroupedWhereBuilder, _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable.IWhere);

var GroupedHavingBuilder = (function (_AbstractBuilder4) {
  function GroupedHavingBuilder() {
    _classCallCheck(this, GroupedHavingBuilder);

    if (_AbstractBuilder4 != null) {
      _AbstractBuilder4.apply(this, arguments);
    }
  }

  _inherits(GroupedHavingBuilder, _AbstractBuilder4);

  GroupedHavingBuilder.prototype[_iterSymbol$iterator.iterSymbol] = function () {
    return _iterSymbol$iterator.iterator(new _GroupedWhereIterable$GroupedHavingIterable$SubQueryIterable$UnionQueryIterable.GroupedHavingIterable(this.container.get('havings')));
  };

  return GroupedHavingBuilder;
})(_AbstractBuilder6.AbstractBuilder);

exports.GroupedHavingBuilder = GroupedHavingBuilder;

_mixin.mixin(GroupedHavingBuilder, _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable.IHaving);

var JoinBuilder = (function (_AbstractBuilder5) {
  function JoinBuilder() {
    _classCallCheck(this, JoinBuilder);

    if (_AbstractBuilder5 != null) {
      _AbstractBuilder5.apply(this, arguments);
    }
  }

  _inherits(JoinBuilder, _AbstractBuilder5);

  JoinBuilder.prototype[_iterSymbol$iterator.iterSymbol] = function () {
    return _iterSymbol$iterator.iterator(new JoinIterable(this));
  };

  return JoinBuilder;
})(_AbstractBuilder6.AbstractBuilder);

exports.JoinBuilder = JoinBuilder;

_mixin.mixin(JoinBuilder, _ISelect$IWhere$IHaving$IDelete$IUpdate$ITruncate$IColumninfo$IJoin$IRunnable$IIterable.IJoin);

var GroupedJoinBuilder = (function (_JoinBuilder) {
  function GroupedJoinBuilder() {
    _classCallCheck(this, GroupedJoinBuilder);

    if (_JoinBuilder != null) {
      _JoinBuilder.apply(this, arguments);
    }
  }

  _inherits(GroupedJoinBuilder, _JoinBuilder);

  GroupedJoinBuilder.prototype[_iterSymbol$iterator.iterSymbol] = function () {
    return _iterSymbol$iterator.iterator(new GroupedJoinIterable(this));
  };

  return GroupedJoinBuilder;
})(JoinBuilder);

exports.GroupedJoinBuilder = GroupedJoinBuilder;