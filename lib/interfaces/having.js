'use strict';

exports.__esModule = true;

var _IS$NULL = require('../sql/keywords');

var _or$not$raw = require('../helpers');

var _HavingClause = require('../iterables');

var _GroupedHavingBuilder = require('../builders/query');

var IHaving = {

  // [AND | OR] [NOT] HAVING expression

  having: function having() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return this.__having(havingDispatch(args));
  },

  notHaving: function notHaving() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return this.__having(_or$not$raw.not(havingDispatch(args)));
  },

  orHaving: function orHaving() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return this.__having(_or$not$raw.or(havingDispatch(args)));
  },

  orNotHaving: function orNotHaving() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return this.__having(_or$not$raw.or(_or$not$raw.not(havingDispatch(args))));
  },

  havingRaw: function havingRaw() {
    return this.__having(_or$not$raw.raw.apply(undefined, arguments));
  },

  orHavingRaw: function orHavingRaw() {
    return this.__having(_or$not$raw.or(_or$not$raw.raw.apply(undefined, arguments)));
  },

  andHaving: function andHaving() {
    console.log('andHaving is deprecated, you can just use an additional having statement.');
    return this.andHaving.apply(this, arguments);
  },

  __having: function __having(value) {
    return this.__clause('havings', value);
  }

};

exports.IHaving = IHaving;
function havingDispatch(args) {
  switch (args.length) {
    case 1:
      return havingArity1(args[0]);
    case 2:
      return havingArity2(args[0], args[1]);
    case 3:
      return havingArity3(args[0], args[1], args[2]);
  }
}

function havingArity1(value) {
  if (typeof value === 'function') {
    var qb = new _GroupedHavingBuilder.GroupedHavingBuilder();
    value.call(qb, qb);
    return new _HavingClause.HavingClause(qb);
  }
  if (typeof value === 'string') {
    throw new Error('A string value is not supported as a having clause');
  }
  return new _HavingClause.HavingClause(value);
}

function havingArity2(key, value) {
  if (value === null) {
    return new _HavingClause.HavingClause(key, _IS$NULL.IS, _IS$NULL.NULL);
  }
  return new _HavingClause.HavingClause(key, '=', value);
}

function havingArity3(key, operator, value) {
  return new _HavingClause.HavingClause(key, operator, value);
}