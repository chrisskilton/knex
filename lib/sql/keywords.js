'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;
exports.isKeyword = isKeyword;

var Keyword = function Keyword(value) {
  _classCallCheck(this, Keyword);

  this['@@knex/value'] = value;
  this['@@knex/hook'] = 'keyword';
};

var _ALL_ = new Keyword('*');
exports._ALL_ = _ALL_;
var JOIN = new Keyword('JOIN');
exports.JOIN = JOIN;
var INNER = new Keyword('INNER');
exports.INNER = INNER;
var OUTER = new Keyword('OUTER');
exports.OUTER = OUTER;
var DELETE = new Keyword('DELETE FROM');
exports.DELETE = DELETE;
var SELECT = new Keyword('SELECT');
exports.SELECT = SELECT;
var FROM = new Keyword('FROM');
exports.FROM = FROM;
var WHERE = new Keyword('WHERE');
exports.WHERE = WHERE;
var GROUP_BY = new Keyword('GROUP BY');
exports.GROUP_BY = GROUP_BY;
var ORDER_BY = new Keyword('ORDER BY');
exports.ORDER_BY = ORDER_BY;
var HAVING = new Keyword('HAVING');
exports.HAVING = HAVING;
var LIMIT = new Keyword('LIMIT');
exports.LIMIT = LIMIT;
var SET = new Keyword('SET');
exports.SET = SET;
var VALUES = new Keyword('VALUES');
exports.VALUES = VALUES;
var OR = new Keyword('OR');
exports.OR = OR;
var AND = new Keyword('AND');
exports.AND = AND;
var IF = new Keyword('IF');
exports.IF = IF;
var AS = new Keyword('AS');
exports.AS = AS;
var DISTINCT = new Keyword('DISTINCT');
exports.DISTINCT = DISTINCT;
var NOT = new Keyword('NOT');
exports.NOT = NOT;
var EXISTS = new Keyword('EXISTS');
exports.EXISTS = EXISTS;
var IN = new Keyword('IN');
exports.IN = IN;
var BETWEEN = new Keyword('BETWEEN');

exports.BETWEEN = BETWEEN;

function isKeyword(val) {
  return val && val['@@knex/hook'] === 'keyword';
}