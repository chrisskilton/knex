'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;
// MySQL Engine
// -------

var _clone = require('lodash/lang/clone');

var _clone2 = _interopRequireWildcard(_clone);

var _Engine2 = require('../../engine');

var _Engine3 = _interopRequireWildcard(_Engine2);

var _Promise = require('../../promise');

var _Promise2 = _interopRequireWildcard(_Promise);

var _hooks = require('./hooks');

var _hooks2 = _interopRequireWildcard(_hooks);

// Always initialize with the "QueryBuilder" and "QueryCompiler"
// objects, which extend the base 'lib/query/builder' and
// 'lib/query/compiler', respectively.

var Engine_MySQL = (function (_Engine) {
  function Engine_MySQL(config) {
    _classCallCheck(this, Engine_MySQL);

    _Engine.call(this, config);
    if (config.debug) this.isDebugging = true;
    this.connectionSettings = _clone2['default'](config.connection);
  }

  _inherits(Engine_MySQL, _Engine);

  Engine_MySQL.prototype.initBuilder = function initBuilder(builder) {
    builder.addHooks(_hooks2['default']);
  };

  // MySQL Specific error handler

  Engine_MySQL.prototype.connectionErrorHandler = function connectionErrorHandler(client, connection, err) {
    if (connection && err && err.fatal) {
      if (connection.__knex__disposed) {
        return;
      }connection.__knex__disposed = true;
      client.pool.destroy(connection);
    }
  };

  // Get a raw connection, called by the `pool` whenever a new
  // connection needs to be added to the pool.

  Engine_MySQL.prototype.acquireRawConnection = function acquireRawConnection() {
    var client = this;
    var connection = mysql.createConnection(this.connectionSettings);
    this.databaseName = connection.config.database;
    return new _Promise2['default'](function (resolver, rejecter) {
      connection.connect(function (err) {
        if (err) return rejecter(err);
        connection.on('error', connectionErrorHandler.bind(null, client, connection));
        connection.on('end', connectionErrorHandler.bind(null, client, connection));
        resolver(connection);
      });
    });
  };

  // Used to explicitly close a connection, called internally by the pool
  // when a connection times out or the pool is shutdown.

  Engine_MySQL.prototype.destroyRawConnection = function destroyRawConnection(connection) {
    connection.end();
  };

  _createClass(Engine_MySQL, [{
    key: 'driver',
    get: function () {
      return 'mysql';
    }
  }, {
    key: 'dialect',

    // The "dialect", for reference elsewhere.
    get: function () {
      return 'mysql';
    }
  }]);

  return Engine_MySQL;
})(_Engine3['default']);

exports['default'] = Engine_MySQL;
module.exports = exports['default'];