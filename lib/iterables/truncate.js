'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

// TRUNCATE [ TABLE ] [ ONLY ] name [ * ] [, ... ]
//     [ RESTART IDENTITY | CONTINUE IDENTITY ] [ CASCADE | RESTRICT ]

var _TRUNCATE = require('../sql/keywords');

var _iterator$iterSymbol = require('transduce');

var TruncateIterable = (function () {
  function TruncateIterable(elements) {
    _classCallCheck(this, TruncateIterable);

    this.elements = elements;
    this['@@knex/hook'] = 'statement:truncate';
  }

  TruncateIterable.prototype[_iterator$iterSymbol.iterSymbol] = function () {
    var table = this.elements.single.table;

    return _iterator$iterSymbol.iterator([_TRUNCATE.TRUNCATE, table]);
  };

  return TruncateIterable;
})();