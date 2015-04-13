'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _each = require('lodash/collection/each');

var _each2 = _interopRequireWildcard(_each);

var _last2 = require('lodash/array/last');

var _last3 = _interopRequireWildcard(_last2);

var _into = require('transduce');

var TokenContainer = (function () {

  // This map contains things like:
  // wheres, joins, columns, unions, havings, orders, groupings,
  // updates, options, hooks

  function TokenContainer() {
    _classCallCheck(this, TokenContainer);

    this.tokens = new Map([['statementType', ['select']]]);
  }

  TokenContainer.prototype.has = function has(key) {
    return this.tokens.has(key);
  };

  TokenContainer.prototype.get = function get(key) {
    return this.tokens.get(key);
  };

  TokenContainer.prototype.add = function add(key, value) {
    var _this = this;

    if (Array.isArray(value)) {
      _each2['default'](value, function (val) {
        return _this.add(key, val);
      });
    } else {
      if (!this.has(key)) {
        this.tokens.set(key, []);
      }
      this.tokens.get(key).push(value);
    }
    return this;
  };

  TokenContainer.prototype.last = (function (_last) {
    function last(_x) {
      return _last.apply(this, arguments);
    }

    last.toString = function () {
      return _last.toString();
    };

    return last;
  })(function (key) {
    if (!this.has(key)) return;
    return _last3['default'](this.tokens.get(key));
  });

  TokenContainer.prototype[Symbol.iterator] = function () {
    return this.tokens[Symbol.iterator]();
  };

  TokenContainer.prototype.toJS = function toJS() {
    return _into.into({}, this.tokens);
  };

  return TokenContainer;
})();

exports['default'] = TokenContainer;
module.exports = exports['default'];