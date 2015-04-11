'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;
// MySQL2 Client
// -------

var _Engine_MySQL2 = require('../mysql/engine');

var _Engine_MySQL3 = _interopRequireWildcard(_Engine_MySQL2);

var _Promise = require('bluebird');

var _Promise2 = _interopRequireWildcard(_Promise);

var _pick = require('lodash/object/pick');

var _pick2 = _interopRequireWildcard(_pick);

var configOptions = ['user', 'database', 'host', 'password', 'ssl', 'connection', 'stream'];

var Engine_MySQL2 = (function (_Engine_MySQL) {
  function Engine_MySQL2() {
    _classCallCheck(this, Engine_MySQL2);

    if (_Engine_MySQL != null) {
      _Engine_MySQL.apply(this, arguments);
    }
  }

  _inherits(Engine_MySQL2, _Engine_MySQL);

  Engine_MySQL2.prototype.acquireRawConnection = function acquireRawConnection() {
    var connection = mysql2.createConnection(_pick2['default'](this.connectionSettings, configOptions));
    this.databaseName = connection.config.database;
    return new _Promise2['default'](function (resolver, rejecter) {
      connection.connect(function (err) {
        if (err) return rejecter(err);
        resolver(connection);
      });
    });
  };

  _createClass(Engine_MySQL2, [{
    key: 'driver',
    get: function () {
      return 'mysql2';
    }
  }, {
    key: 'engine',
    get: function () {
      return 'mysql2';
    }
  }, {
    key: 'dialect',
    get: function () {
      return 'mysql';
    }
  }]);

  return Engine_MySQL2;
})(_Engine_MySQL3['default']);

exports['default'] = Engine_MySQL2;
module.exports = exports['default'];