'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _isArray = require('lodash');

var _knexFlatten$extractAlias = require('../../helpers');

var _COMMA = require('../../sql/delimiters');

var _ALL_2 = require('../../sql/keywords');

var _i = require('../../sql/identifier');

var _lazySeq$iterator$compose$map$filter$into$transducer$interpose$iterSymbol$FlattenIterator = require('transduce');

var pipeline = _lazySeq$iterator$compose$map$filter$into$transducer$interpose$iterSymbol$FlattenIterator.compose(_lazySeq$iterator$compose$map$filter$into$transducer$interpose$iterSymbol$FlattenIterator.map(_knexFlatten$extractAlias.extractAlias), _lazySeq$iterator$compose$map$filter$into$transducer$interpose$iterSymbol$FlattenIterator.map(function (value) {
  return _i.identifier(value);
}), _lazySeq$iterator$compose$map$filter$into$transducer$interpose$iterSymbol$FlattenIterator.filter(function (value) {
  return value !== undefined;
}), _lazySeq$iterator$compose$map$filter$into$transducer$interpose$iterSymbol$FlattenIterator.interpose(_COMMA.COMMA));

var ColumnIterable = (function () {
  function ColumnIterable() {
    var columns = arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, ColumnIterable);

    this.columns = columns;
    this['@@knex/hook'] = 'columns';
  }

  ColumnIterable.prototype[_lazySeq$iterator$compose$map$filter$into$transducer$interpose$iterSymbol$FlattenIterator.iterSymbol] = function () {
    if (this.columns.length === 0) {
      return _lazySeq$iterator$compose$map$filter$into$transducer$interpose$iterSymbol$FlattenIterator.iterator([_ALL_2._ALL_]);
    }
    return _knexFlatten$extractAlias.knexFlatten(pipeline, this.columns);
  };

  return ColumnIterable;
})();

exports.ColumnIterable = ColumnIterable;