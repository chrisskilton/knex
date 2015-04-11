'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;
exports.wrap = wrap;

var _LEFT_PAREN$RIGHT_PAREN = require('./delimiters');

var _iterSymbol$iterator = require('transduce');

var Wrapped = (function () {
  function Wrapped(value, prefix, suffix) {
    _classCallCheck(this, Wrapped);

    this.prefix = prefix;
    this.value = value;
    this.suffix = suffix;
    this['@@knex/hook'] = 'wrappedValue';
  }

  Wrapped.prototype[_iterSymbol$iterator.iterSymbol] = function () {
    return _iterSymbol$iterator.iterator([this.prefix, this.value, this.suffix]);
  };

  return Wrapped;
})();

function wrap(value) {
  var prefix = arguments[1] === undefined ? _LEFT_PAREN$RIGHT_PAREN.LEFT_PAREN : arguments[1];
  var suffix = arguments[2] === undefined ? _LEFT_PAREN$RIGHT_PAREN.RIGHT_PAREN : arguments[2];

  return new Wrapped(value, prefix, suffix);
}