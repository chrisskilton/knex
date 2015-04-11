'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;

var _FROM = require('../../sql/keywords');

var _map$iterSymbol = require('transduce');

var _ClauseIterable2 = require('./abstract');

var _i = require('../../sql/identifier');

var _knexFlatten = require('../../helpers');

var FromIterable = (function (_ClauseIterable) {
  function FromIterable(value) {
    _classCallCheck(this, FromIterable);

    _ClauseIterable.call(this);
    this.idx = 0;
    this.value = [_FROM.FROM, _knexFlatten.knexFlatten(_map$iterSymbol.map(function (v) {
      return _i.identifier(v);
    }), value)];
    this.distinct = false;
    this.alias = undefined;
    this.complete = !!value;
    this['@@knex/hook'] = 'clause:from';
  }

  _inherits(FromIterable, _ClauseIterable);

  return FromIterable;
})(_ClauseIterable2.ClauseIterable);

exports.FromIterable = FromIterable;