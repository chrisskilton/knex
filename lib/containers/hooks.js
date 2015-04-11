'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _first = require('lodash/array/first');

var _first2 = _interopRequireWildcard(_first);

var _rest2 = require('lodash/array/rest');

var _rest3 = _interopRequireWildcard(_rest2);

var HookContainer = (function () {
  function HookContainer() {
    _classCallCheck(this, HookContainer);

    this.hooks = new Map();
  }

  HookContainer.prototype.addHook = function addHook(name, fn) {
    if (!this.hooks.has(name)) {
      this.hooks.set(name, []);
    }
    this.hooks.get(name).unshift(fn);
    return this;
  };

  HookContainer.prototype.has = function has(name) {
    return this.hooks.has(name);
  };

  HookContainer.prototype.get = function get(name) {
    if (this.hooks.has(name)) {
      return _first2['default'](this.hooks.get(name));
    }
  };

  HookContainer.prototype.rest = (function (_rest) {
    function rest(_x) {
      return _rest.apply(this, arguments);
    }

    rest.toString = function () {
      return _rest.toString();
    };

    return rest;
  })(function (name) {
    if (this.hooks.has(name)) {
      return _rest3['default'](this.hooks.get(name));
    }
  });

  return HookContainer;
})();

exports.HookContainer = HookContainer;