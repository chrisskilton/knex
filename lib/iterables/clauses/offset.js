'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _OFFSET = require('../../sql/keywords');

var _iterSymbol$iterator$iterdone = require('transduce');

var OffsetIterable = (function () {
  function OffsetIterable(value) {
    _classCallCheck(this, OffsetIterable);

    this.value = value;
    this['@@knex/hook'] = 'clause:offset';
  }

  OffsetIterable.prototype[_iterSymbol$iterator$iterdone.iterSymbol] = function () {
    if (!this.value) return _iterSymbol$iterator$iterdone.iterdone;
    return _iterSymbol$iterator$iterdone.iterator([_OFFSET.OFFSET, this.value]);
  };

  return OffsetIterable;
})();

exports.OffsetIterable = OffsetIterable;