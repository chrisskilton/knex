'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _ORDER_BY = require('../../sql/keywords');

var _iterSymbol$iterator$iterdone = require('transduce');

var OrderingIterable = (function () {
  function OrderingIterable(value) {
    _classCallCheck(this, OrderingIterable);

    this.value = value;
    this['@@knex/hook'] = 'clause:order';
  }

  OrderingIterable.prototype[_iterSymbol$iterator$iterdone.iterSymbol] = function () {
    if (!this.value) return _iterSymbol$iterator$iterdone.iterdone;
    return _iterSymbol$iterator$iterdone.iterator([_ORDER_BY.ORDER_BY, value]);
  };

  return OrderingIterable;
})();

exports.OrderingIterable = OrderingIterable;