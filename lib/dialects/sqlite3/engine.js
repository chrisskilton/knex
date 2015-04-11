'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;

var _Engine2 = require('../../engine');

var _Engine3 = _interopRequireWildcard(_Engine2);

var Engine_SQLite3 = (function (_Engine) {
  function Engine_SQLite3(config) {
    _classCallCheck(this, Engine_SQLite3);

    _Engine.call(this, config);
    if (config.debug) this.isDebugging = true;
    this.connectionSettings = config.connection
    // this.pool = new Pool(assign({
    //   max: 1,
    //   min: 1,
    //   release(client, callback) {
    //     client.close(callback)
    //   }
    // }, config.pool))
    ;
  }

  _inherits(Engine_SQLite3, _Engine);

  // Get a raw connection from the database, returning a promise with the connection object.

  Engine_SQLite3.prototype.acquireRawConnection = function acquireRawConnection() {
    return new Promise(function (resolve, reject) {
      var db = new sqlite3.Database(engine.connectionSettings.filename, function (err) {
        if (err) return reject(err);
        resolve(db);
      });
    });
  };

  // Used to explicitly close a connection, called internally by the pool
  // when a connection times out or the pool is shutdown.
  // TODO: See if this is needed.

  Engine_SQLite3.prototype.destroyRawConnection = function destroyRawConnection(connection) {
    return new Promise(function () {
      return connection.close();
    });
  };

  _createClass(Engine_SQLite3, [{
    key: 'driver',
    get: function () {
      return 'sqlite3';
    }
  }, {
    key: 'dialect',
    get: function () {
      return 'sqlite3';
    }
  }]);

  return Engine_SQLite3;
})(_Engine3['default']);

exports['default'] = Engine_SQLite3;
module.exports = exports['default'];