'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;

var _not$or = require('../helpers');

var _TokenContainer = require('../containers/token');

var _TokenContainer2 = _interopRequireWildcard(_TokenContainer);

var _EventEmitter2 = require('events');

var AbstractBuilder = (function (_EventEmitter) {
  function AbstractBuilder(engine) {
    _classCallCheck(this, AbstractBuilder);

    _EventEmitter.call(this);
    this.engine = engine;
    this.container = new _TokenContainer2['default']();

    // Internal flags used in the builder.
    this.__boolFlag = false; // false === and, true === or
    this.__notFlag = false; // true  === not
    this.__cache = false;
  }

  _inherits(AbstractBuilder, _EventEmitter);

  // Public API Interfaces:

  AbstractBuilder.prototype.toJS = function toJS() {
    return this.container.toJS();
  };

  AbstractBuilder.prototype.fromJS = function fromJS(obj) {
    var _this = this;

    var keys = Object.keys(obj);
    forEach(keys, function (key) {
      var val = obj[key];
      Array.isArray(val) ? _this[key].apply(_this, val) : _this[key](val);
    });
    return this;
  };

  AbstractBuilder.prototype.__clause = function __clause(type, element) {

    this.__cache = false;

    if (element === undefined) {
      this.__notFlag = false;
      this.__boolFlag = false;
      return this;
    }

    if (this.__notFlag) {
      this.__notFlag = false;
      return this.__clause(type, _not$or.not(element));
    }

    if (this.__boolFlag) {
      this.__boolFlag = false;
      return this.__clause(type, _not$or.or(element));
    }

    this.container.add(type, element);

    return this;
  };

  // Deprecated: ??

  // Create a shallow clone of the current query builder.

  AbstractBuilder.prototype.clone = function clone() {
    var cloned = new this.constructor();
    cloned._method = this._method;
    cloned._transacting = this._transacting;
    return cloned;
  };

  _createClass(AbstractBuilder, [{
    key: 'and',

    // A few getters to make the chain look nice:

    get: function () {
      this.__boolFlag = false;
      return this;
    }
  }, {
    key: 'or',
    get: function () {
      this.__boolFlag = true;
      return this;
    }
  }, {
    key: 'not',
    get: function () {
      this.__notFlag = true;
      return this;
    }
  }]);

  return AbstractBuilder;
})(_EventEmitter2.EventEmitter);

exports.AbstractBuilder = AbstractBuilder;