'use strict';

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _iterSymbol$iterator = require('transduce');

var JoinIterable = (function () {
  function JoinIterable() {
    _classCallCheck(this, JoinIterable);
  }

  JoinIterable.prototype[_iterSymbol$iterator.iterSymbol] = function () {
    return _iterSymbol$iterator.iterator([]);
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