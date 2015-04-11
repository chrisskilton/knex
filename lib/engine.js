'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;
// "Base Engine"
// ------

var _cloneDeep = require('lodash/lang/clone');

var _cloneDeep2 = _interopRequireWildcard(_cloneDeep);

var _EventEmitter2 = require('events');

var _Promise = require('./promise');

var _Promise2 = _interopRequireWildcard(_Promise);

var Engine = (function (_EventEmitter) {
  function Engine() {
    var config = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Engine);

    _EventEmitter.call(this);
    this.isDebugging = false;
    this.migrationConfig = _cloneDeep2['default'](config.migrations);
    this.seedConfig = _cloneDeep2['default'](config.seeds)
    // this.pool         = new this.Pool(config.pool)
    ;
  }

  _inherits(Engine, _EventEmitter);

  // Converts a "builder" into SQL which is properly parameterized

  Engine.prototype.builderToSQL = function builderToSQL(builder) {
    if (builder.__cache) {
      return builder.__cache;
    }
    var bindings = [];
    builder.addHook('beforeSpace', function (val) {
      if (val['@@knex/hook'] === 'parameter') {
        bindings.push(val['@@knex/value']);
        return '?';
      }
      return val;
    });
    return {
      sql: builder.toString(),
      bindings: bindings
    };
  };

  // Acquire a connection from the pool.

  Engine.prototype.getConnection = function getConnection() {
    var _this = this;

    return new _Promise2['default'](function (resolver, rejecter) {
      _this.pool.acquire(function (err, connection) {
        if (err) return rejecter(err);
        resolver(connection);
      });
    });
  };

  // Releases a connection from the connection pool,
  // returning a promise resolved when the connection is released.

  Engine.prototype.releaseConnection = function releaseConnection(connection) {
    var _this2 = this;

    return new _Promise2['default'](function (resolver, rejecter) {
      _this2.pool.release(connection, function (err) {
        if (err) return rejecter(err);
        resolver(connection);
      });
    });
  };

  // Destroy the current connection pool for the engine.

  Engine.prototype.destroy = function destroy(callback) {
    var _this3 = this;

    var promise = new _Promise2['default'](function (resolver, rejecter) {
      if (!_this3.pool) return resolver();
      _this3.pool.destroy(function (err) {
        if (err) return rejecter(err);
        resolver();
      });
    });

    // Allow either a callback or promise interface for destruction.
    if (typeof callback === 'function') {
      promise.asCallback(callback);
    } else {
      return promise;
    }
  };

  // Runs the SQL in a file

  Engine.prototype.runFile = function runFile(fileName, bindings, options) {
    return new _Promise2['default'](function (resolver, rejecter) {
      require('fs').readFile(fileName, 'UTF-8', function (err, str) {
        if (err) return rejecter(err);
      });
    });
  };

  _createClass(Engine, [{
    key: 'engine',
    get: function () {
      return this.dialect;
    }
  }, {
    key: 'databaseName',

    // Return the database being used by this engine.
    get: function () {
      return this.connectionSettings.database;
    }
  }]);

  return Engine;
})(_EventEmitter2.EventEmitter);

exports['default'] = Engine;

Engine.prototype['@@__KNEX_ENGINE__@@'] = true;
module.exports = exports['default'];