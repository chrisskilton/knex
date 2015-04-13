'use strict';

exports.__esModule = true;

var _reduce$iterator = require('transduce');

var _escapeParam = require('../sql/string');

var IRunnable = {

  addHook: function addHook(name, fn) {
    this.hooks.addHook(name, fn);
    return this;
  },

  removeHook: function removeHook(name) {
    this.hooks.removeHook(name);
    return this;
  },

  addHooks: function addHooks(obj) {
    for (var _iterator = _reduce$iterator.iterator(obj), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var k = _ref[0];
      var v = _ref[1];

      this.addHook(k, v);
    }
    return this;
  },

  withHook: function withHook(name, fn, toRun) {
    this.hooks.addHook(name, fn);
    var val = toRun();
    this.hooks.removeHook(name);
    return val;
  },

  transacting: function transacting(trx) {
    this._transacting = trx;
    return this;
  },

  debug: function debug() {
    var bool = arguments[0] === undefined ? true : arguments[0];

    return clauses(this, modifier('debug', bool), true);
  },

  options: function options(opts) {
    this.container.set('options', opts);
    return this;
  },

  // "Then" interface only works when there's an "engine" specified.
  then: function then() {
    if (!this.engine) {
      throw new Error('Cannot call "then" on a builder without an engine');
    }

    // Eventually this will become the value of the promise,
    // for now it's used to signal a warning when we've tried using a
    // clause as both a promise and later as a value.
    if (!this._promise) {
      this._promise = true;
    }

    var running = this.engine.run(this);
    return running.then.apply(running, arguments);
  },

  // Functional:

  map: function map() {
    var _then;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_then = this.then()).map.apply(_then, args);
  },

  reduce: function reduce() {
    var _then2;

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return (_then2 = this.then()).reduce.apply(_then2, args);
  },

  // Promises:

  bind: function bind() {
    var _then3;

    return (_then3 = this.then()).bind.apply(_then3, arguments);
  },

  spread: function spread() {
    var _then4;

    return (_then4 = this.then()).spread.apply(_then4, arguments);
  },

  tap: function tap() {
    var _then5;

    return (_then5 = this.then()).tap.apply(_then5, arguments);
  },

  'yield': function _yield() {
    deprecated('yield', 'return');
    return this['return'].apply(this, arguments);
  },

  thenReturn: function thenReturn() {
    return this['return'].apply(this, arguments);
  },

  'return': function _return() {
    var _then6;

    return (_then6 = this.then())['return'].apply(_then6, arguments);
  },

  otherwise: function otherwise() {
    deprecated('otherwise', 'catch');
    return this['catch'].apply(this, arguments);
  },

  'catch': function _catch() {
    var _then7;

    return (_then7 = this.then())['catch'].apply(_then7, arguments);
  },

  ensure: function ensure() {
    deprecated('ensure', 'finally');
    return this['finally'].apply(this, arguments);
  },

  'finally': function _finally() {
    var _then8;

    return (_then8 = this.then())['finally'].apply(_then8, arguments);
  },

  // Callbacks:

  exec: function exec() {
    console.log('Knex: .exec is deprecated, please use .asCallback');
  },

  asCallback: function asCallback(cb) {
    return this.then().asCallback(cb);
  },

  nodeify: function nodeify(cb) {
    deprecate('nodeify', 'asCallback');
    return this.asCallback(cb);
  },

  // Streams:

  toStream: function toStream() {
    return engine(this, 'toStream').toStream();
  },

  toString: function toString() {
    var _this = this;

    var beforeSpace = function beforeSpace(val) {
      if (val && val['@@knex/hook'] === 'parameter') {
        return _escapeParam.escapeParam(val['@@knex/value']);
      }
      return val;
    };
    var sql = '';
    this.withHook('beforeSpace', beforeSpace, function () {
      for (var _iterator2 = _this, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var val = _ref2;

        sql += val;
      }
    });
    return sql;
  },

  pipe: function pipe() {},

  toQuery: function toQuery() {
    return this.toString();
  },

  toSQL: function toSQL() {
    if (!this.engine) {
      throw new Error('.toSQL cannot be run without an "engine');
    }
    return this.engine.builderToSQL(this);
  }

};
exports.IRunnable = IRunnable;