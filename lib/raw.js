'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;
// Raw
// -------

var _EventEmitter2 = require('events');

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _raw = require('./sql');

var _IRunnable = require('./interfaces/runnable');

var _mixin = require('./helpers');

var _wrap2 = require('./sql/wrap');

var Raw = (function (_EventEmitter) {
  function Raw(engine) {
    _classCallCheck(this, Raw);

    _EventEmitter.call(this);
    this.engine = engine;
    this.sql = null;
  }

  _inherits(Raw, _EventEmitter);

  Raw.prototype.set = function set(sql, bindings) {
    this.sql = _raw.raw(sql, bindings);
    return this;
  };

  // Wraps the current sql with `before` and `after`.

  Raw.prototype.wrap = (function (_wrap) {
    function wrap(_x, _x2) {
      return _wrap.apply(this, arguments);
    }

    wrap.toString = function () {
      return _wrap.toString();
    };

    return wrap;
  })(function (prefix, suffix) {
    this.sql = _wrap2.wrap(this.sql, prefix, suffix);
    return this;
  });

  return Raw;
})(_EventEmitter2.EventEmitter);

exports['default'] = Raw;

_mixin.mixin(Raw, _IRunnable.IRunnable);
module.exports = exports['default'];