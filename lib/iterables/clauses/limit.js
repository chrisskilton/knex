'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _LIMIT = require('../../sql/keywords');

var _iterSymbol$iterator$iterdone = require('transduce');

var LimitIterable = (function () {
  function LimitIterable(value) {
    _classCallCheck(this, LimitIterable);

    this.value = value;
    this['@@knex/hook'] = 'clause:limit';
  }

  LimitIterable.prototype[_iterSymbol$iterator$iterdone.iterSymbol] = function () {
    if (!this.value) return _iterSymbol$iterator$iterdone.iterdone;
    return _iterSymbol$iterator$iterdone.iterator([_LIMIT.LIMIT, this.value]);
  };

  return LimitIterable;
})();

exports.LimitIterable = LimitIterable;