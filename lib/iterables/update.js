'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _UPDATE = require('../sql/keywords');

var _WhereIterable = require('./clauses');

var _iterator$iterSymbol = require('transduce');

var UpdateIterable = (function () {
  function UpdateIterable(elements) {
    _classCallCheck(this, UpdateIterable);

    this.elements = elements;
    this['@@knex/hook'] = 'statement:update';
  }

  UpdateIterable.prototype[_iterator$iterSymbol.iterSymbol] = function () {
    return _iterator$iterSymbol.iterator([_UPDATE.UPDATE, table, new _WhereIterable.WhereIterable(wheres)]);
  };

  return UpdateIterable;
})();