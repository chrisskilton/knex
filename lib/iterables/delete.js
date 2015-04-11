'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _DELETE_FROM = require('../sql/keywords');

var _iterator$iterSymbol = require('transduce');

var DeleteIterable = (function () {
  function DeleteIterable(elements) {
    _classCallCheck(this, DeleteIterable);

    this.elements = elements;
    this['@@knex/type'] = 'statement:delete';
  }

  DeleteIterable.prototype[_iterator$iterSymbol.iterSymbol] = function () {
    var table = this.elements.single.table;

    return _iterator$iterSymbol.iterator([_DELETE_FROM.DELETE_FROM, table]);
  };

  return DeleteIterable;
})();

exports.DeleteIterable = DeleteIterable;