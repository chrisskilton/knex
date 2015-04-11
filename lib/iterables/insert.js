'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _INSERT_INTO = require('../sql/keywords');

var _iterator$iterSymbol = require('transduce');

var InsertIterable = (function () {
  function InsertIterable(elements) {
    _classCallCheck(this, InsertIterable);

    this.elements = elements;
    this['@@knex/hook'] = 'expression:insert';
  }

  InsertIterable.prototype[_iterator$iterSymbol.iterSymbol] = function () {
    var table = this.elements.single.table;

    return _iterator$iterSymbol.iterator([_INSERT_INTO.INSERT_INTO, new TableIterable(table)]);
  };

  return InsertIterable;
})();

exports.InsertIterable = InsertIterable;