'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _or$not$raw = require('../helpers');

var IHaving = {

  // [AND | OR] [NOT] HAVING expression

  having: function having() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return this.__clause(havingDispatch(args));
  },

  notHaving: function notHaving() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return this.__clause(_or$not$raw.not(havingDispatch(args)));
  },

  orHaving: function orHaving() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return this.__clause(_or$not$raw.or(havingDispatch(args)));
  },

  orNotHaving: function orNotHaving() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return this.__clause(_or$not$raw.or(_or$not$raw.not(havingDispatch(args))));
  },

  havingRaw: function havingRaw(sql, bindings) {
    return this.__clause(havingDispatch(_or$not$raw.raw(sql, bindings)));
  },

  orHavingRaw: function orHavingRaw(sql, bindings) {
    return this.__clause(_or$not$raw.or(havingDispatch(_or$not$raw.raw(sql, bindings))));
  },

  andHaving: function andHaving() {
    console.log('andHaving is deprecated, you can just use an additional having statement.');
    return this.andHaving.apply(this, arguments);
  }

};

exports.IHaving = IHaving;

var Having = function Having(value) {
  _classCallCheck(this, Having);

  this.value = value;
  this.negated = false;
  this.or = false;
  this.wrapped = false;
  this['@@knex/hook'] = 'clause:having';
};

function having() {
  var _arguments = arguments;
  var _again = true;

  _function: while (_again) {
    _len5 = args = _key5 = undefined;
    _again = false;

    for (var _len5 = _arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = _arguments[_key5];
    }

    switch (args.length) {
      case 1:
        if (isArray(args[0])) {
          _arguments = args[0];
          _again = true;
          continue _function;
        }
        return havingArity1(args[0]);
      case 2:
        return havingArity2(args[0], args[1]);
      case 3:
        return havingArity3(args[0], args[1], args[2]);
    }
  }
}

function havingArity1() {
  return new Having();
}

function havingArity2() {
  return new Having();
}

function havingArity3() {
  return new Having();
}