'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;
exports.parameter = parameter;

var _isIterator = require('transduce');

var Parameter = function Parameter(value) {
  _classCallCheck(this, Parameter);

  this['@@knex/value'] = value;
  this['@@knex/hook'] = 'parameter';
};

function parameter(value) {
  if (value === undefined || _isIterator.isIterator(value)) {
    return value;
  }
  return new Parameter(value);
}