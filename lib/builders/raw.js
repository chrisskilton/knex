'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;
// Raw
// -------

var _iterSymbol$iterator = require('transduce');

var _AbstractBuilder2 = require('./abstract');

var _raw = require('../sql');

var _mixin = require('../helpers');

var _IRunnable$IIterable = require('../interfaces');

var _HookContainer = require('../containers/hooks');

var RawBuilder = (function (_AbstractBuilder) {
  function RawBuilder(engine) {
    _classCallCheck(this, RawBuilder);

    _AbstractBuilder.call(this, engine);
    this.hooks = new _HookContainer.HookContainer();
  }

  _inherits(RawBuilder, _AbstractBuilder);

  RawBuilder.prototype.set = function set() {
    this.raw = _raw.raw.apply(undefined, arguments);
    return this;
  };

  // Wraps the current sql with `before` and `after`.

  RawBuilder.prototype.wrap = function wrap(prefix, suffix) {
    this.prefix = prefix;
    this.suffix = suffix;
    return this;
  };

  RawBuilder.prototype.__iterator = function __iterator() {
    return _iterSymbol$iterator.iterator([this.prefix, _iterSymbol$iterator.iterator(this.raw), this.suffix]);
  };

  return RawBuilder;
})(_AbstractBuilder2.AbstractBuilder);

exports.RawBuilder = RawBuilder;

_mixin.mixin(RawBuilder, _IRunnable$IIterable.IIterable);
_mixin.mixin(RawBuilder, _IRunnable$IIterable.IRunnable);