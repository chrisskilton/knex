'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var Delimiter = function Delimiter(value, spacing) {
  _classCallCheck(this, Delimiter);

  this['@@knex/hook'] = 'delimiter';
  this['@@knex/value'] = value;
  this['@@knex/spacing'] = spacing;
};

function delimiter(value, spacing) {
  return new Delimiter(value, spacing);
}

var COMMA = delimiter(',', 'OMIT_PRECEDING');
exports.COMMA = COMMA;
var SEMICOLON = delimiter(';', 'OMIT_PRECEDING');
exports.SEMICOLON = SEMICOLON;
var LEFT_PAREN = delimiter('(', 'OMIT_FOLLOWING');
exports.LEFT_PAREN = LEFT_PAREN;
var RIGHT_PAREN = delimiter(')', 'OMIT_PRECEDING');
exports.RIGHT_PAREN = RIGHT_PAREN;