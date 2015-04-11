'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;
exports.bool = bool;

var Type = function Type(type, value) {
  _classCallCheck(this, Type);

  this['@@knex/hook'] = 'types:' + type;
  this['@@knex/value'] = value;
};

function bool(value) {
  return new Type('boolean', value);
}