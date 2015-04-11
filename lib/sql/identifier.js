'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;
exports.identifier = identifier;

var _SubQueryBuilder = require('../builders/query');

var Identifier = function Identifier(value) {
  _classCallCheck(this, Identifier);

  this['@@knex/value'] = value.trim();
  this['@@knex/hook'] = 'identifier';
};

function identifier(value) {
  if (typeof value === 'function') {
    var qb = new _SubQueryBuilder.SubQueryBuilder();
    var val = value.call(qb, qb); // TODO: check return val for builders
    return qb;
  }
  if (typeof value !== 'string') {
    return value;
  }
  return new Identifier(value);
}