'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;

var _Engine_MySQL2 = require('../mysql/engine');

var _Engine_MySQL3 = _interopRequireWildcard(_Engine_MySQL2);

var _Promise = require('../../promise');

var _Promise2 = _interopRequireWildcard(_Promise);

var _assign = require('lodash/object/assign');

var _assign2 = _interopRequireWildcard(_assign);

var Engine_MariaSQL = (function (_Engine_MySQL) {
  function Engine_MariaSQL() {
    _classCallCheck(this, Engine_MariaSQL);

    if (_Engine_MySQL != null) {
      _Engine_MySQL.apply(this, arguments);
    }
  }

  _inherits(Engine_MariaSQL, _Engine_MySQL);

  // Get a raw connection, called by the `pool` whenever a new
  // connection needs to be added to the pool.

  Engine_MariaSQL.prototype.acquireRawConnection = function acquireRawConnection() {
    var connection = new this.Driver();
    connection.connect(_assign2['default']({ metadata: true }, this.connectionSettings));
    return new _Promise2['default'](function (resolver, rejecter) {
      connection.on('connect', function () {
        connection.removeAllListeners('end');
        connection.removeAllListeners('error');
        resolver(connection);
      }).on('error', rejecter);
    });
  };

  // Return the database for the MariaSQL client.

  Engine_MariaSQL.prototype.database = function database() {
    return this.connectionSettings.db;
  };

  _createClass(Engine_MariaSQL, [{
    key: 'driver',
    get: function () {
      return 'mariasql';
    }
  }, {
    key: 'dialect',
    get: function () {
      return 'mariasql';
    }
  }]);

  return Engine_MariaSQL;
})(_Engine_MySQL3['default']);

exports['default'] = Engine_MariaSQL;
module.exports = exports['default'];