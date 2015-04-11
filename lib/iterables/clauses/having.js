'use strict';

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _LEFT_PAREN$RIGHT_PAREN = require('../../sql/delimiters');

var _iterSymbol$iterdone = require('transduce');

var HavingIterable = (function () {
  function HavingIterable() {
    _classCallCheck(this, HavingIterable);
  }

  HavingIterable.prototype[_iterSymbol$iterdone.iterSymbol] = function () {
    return _iterSymbol$iterdone.iterdone;
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

  GroupedHavingIterable.prototype[_iterSymbol$iterdone.iterSymbol] = function () {
    return [_LEFT_PAREN$RIGHT_PAREN.LEFT_PAREN, dropFirstClause(HavingIterable, this.havings), _LEFT_PAREN$RIGHT_PAREN.RIGHT_PAREN];
  };

  return GroupedHavingIterable;
})(HavingIterable);

exports.GroupedHavingIterable = GroupedHavingIterable;