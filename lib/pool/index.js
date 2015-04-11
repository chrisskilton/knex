'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

// Pool
// -------

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _Pool2 = require('pool2');

var _Pool22 = _interopRequireWildcard(_Pool2);

var _Promise = require('../promise');

var _Promise2 = _interopRequireWildcard(_Promise);

var DEFAULT_MIN = 2;
var DEFAULT_MAX = 10;

var poolDefaults = {
  min: 2,
  max: 10,
  acquire: function acquire(engine) {
    return function (callback) {
      return engine.acquireRawConnection().tap(function (connection) {
        connection.__cid = _import2['default'].uniqueId('__cid');
        if (engine.poolConfig.afterCreate) {
          return _Promise2['default'].promisify(engine.poolConfig.afterCreate)(connection);
        }
      }).asCallback(callback);
    };
  },
  release: function release(connection, callback) {
    if (pool.config.beforeDestroy) {
      return pool.config.beforeDestroy(connection, function () {
        if (connection !== void 0) connection.end(callback);
      });
    } else if (connection !== void 0) connection.end(callback);
  }
};

// The "Pool" object is a thin wrapper around the
// "generic-pool-redux" library, exposing a `destroy`
// method for explicitly draining the pool. The
// `init` method is called internally and initializes
// the pool if it doesn't already exist.

var Pool = (function () {
  function Pool(engine) {
    _classCallCheck(this, Pool);

    this.config = assign({}, config);
    this.pool = this.setup();
  }

  // Typically only called internally, this initializes
  // a new `Pool` instance, based on the `config`
  // options passed into the constructor.

  Pool.prototype.setup = function setup(config) {
    return new _Pool22['default'](_import2['default'].defaults(this.config, _import2['default'].result(this, 'defaults')));
  };

  // Teardown the pool

  Pool.prototype.teardown = function teardown() {};

  // Some basic defaults for the pool...

  Pool.prototype.defaults = function defaults() {
    var pool = this;
    return;
  };

  // Acquires a connection from the pool.

  Pool.prototype.acquire = function acquire(callback) {
    if (this.pool) {
      this.pool.acquire(callback);
    } else {
      callback(new Error('The pool is not initialized.'));
    }
  };

  // Release a connection back to the connection pool.

  Pool.prototype.release = function release(connection, callback) {
    if (this.pool) {
      // release is now fire-and-forget
      this.pool.release(connection);
      callback();
    } else {
      callback(new Error('The pool is not initialized.'));
    }
  };

  // Tear down the pool, only necessary if you need it.

  Pool.prototype.destroy = function destroy(callback) {
    var pool = this.pool;
    if (pool) {
      pool.end(callback);
      this.pool = void 0;
    } else {
      callback();
    }
    return this;
  };

  return Pool;
})();

module.exports = Pool;