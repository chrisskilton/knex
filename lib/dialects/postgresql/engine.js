'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;

// PostgreSQL
// -------

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _Engine2 = require('../../engine');

var _Engine3 = _interopRequireWildcard(_Engine2);

var _Promise = require('../../promise');

var _Promise2 = _interopRequireWildcard(_Promise);

var utils = require('./utils');

// Always initialize with the "QueryBuilder" and "QueryCompiler"
// objects, which extend the base 'lib/query/builder' and
// 'lib/query/compiler', respectively.

var Engine_PG = (function (_Engine) {
  function Engine_PG(config) {
    _classCallCheck(this, Engine_PG);

    _Engine.call(this, config);
    if (config.returning) this.defaultReturning = config.returning;
    if (config.debug) this.isDebugging = true;
    this.connectionSettings = config.connection
    // this.pool = new Pool(assign({
    //   release(client, callback) {
    //     client.end()
    //     callback()
    //   }
    // }, config.pool))
    ;
  }

  _inherits(Engine_PG, _Engine);

  // Lazy load the pg dependency, since we might just be using
  // the client to generate SQL strings.

  Engine_PG.prototype.initDriver = function initDriver() {};

  // Prep the bindings as needed by PostgreSQL.

  Engine_PG.prototype.prepBindings = function prepBindings(bindings, tz) {
    return _import2['default'].map(bindings, utils.prepareValue);
  };

  Engine_PG.prototype.endConnection = function endConnection(client, connection) {
    if (!connection || connection.__knex__disposed) {
      return;
    }if (client.pool.pool) {
      connection.__knex__disposed = true;
      client.pool.pool.destroy(connection);
    }
  };

  // Get a raw connection, called by the `pool` whenever a new
  // connection needs to be added to the pool.

  Engine_PG.prototype.acquireRawConnection = function acquireRawConnection(callback) {
    /*jshint unused: false*/
    // TODO: use callback or remove callback
    var connection = new pg.Client(this.connectionSettings);
    this.databaseName = connection.database;

    var client = this;
    return new _Promise2['default'](function (resolver, rejecter) {
      connection.connect(function (err, connection) {
        if (err) return rejecter(err);
        connection.on('error', endConnection.bind(null, client, connection));
        connection.on('end', endConnection.bind(null, client, connection));
        if (!client.version) {
          return client.checkVersion(connection).then(function (version) {
            client.version = version;
            resolver(connection);
          });
        }
        resolver(connection);
      });
    });
  };

  // Used to explicitly close a connection, called internally by the pool
  // when a connection times out or the pool is shutdown.

  Engine_PG.prototype.destroyRawConnection = function destroyRawConnection(connection) {
    connection.end();
  };

  // In PostgreSQL, we need to do a version check to do some feature
  // checking on the database.

  Engine_PG.prototype.checkVersion = function checkVersion(connection) {
    return new _Promise2['default'](function (resolver, rejecter) {
      connection.query('select version()', function (err, resp) {
        if (err) return rejecter(err);
        resolver(/^PostgreSQL (.*?) /.exec(resp.rows[0].version)[1]);
      });
    });
  };

  _createClass(Engine_PG, [{
    key: 'driver',
    get: function () {
      return ['pg', 'pg.js'];
    }
  }, {
    key: 'dialect',
    get: function () {
      return 'postgresql';
    }
  }]);

  return Engine_PG;
})(_Engine3['default']);

exports['default'] = Engine_PG;

// Position the bindings for the query.
function positionBindings(sql) {
  var questionCount = 0;
  return sql.replace(/\?/g, function () {
    questionCount++;
    return '$' + questionCount;
  });
}
module.exports = exports['default'];