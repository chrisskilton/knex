'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;

var _Engine_SQLite32 = require('../sqlite3/engine');

var _Engine_SQLite33 = _interopRequireWildcard(_Engine_SQLite32);

var Engine_WebSQL = (function (_Engine_SQLite3) {
  function Engine_WebSQL() {
    var config = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Engine_WebSQL);

    _Engine_SQLite3.call(this, config);
    this.connectionSettings = {
      database: config.name || 'knex_database',
      version: config.version || '1.0',
      displayName: config.displayName || config.name || 'knex_database',
      estimatedSize: config.estimatedSize || 5 * 1024 * 1024
    };
  }

  _inherits(Engine_WebSQL, _Engine_SQLite3);

  Engine_WebSQL.prototype.acquireConnection = function acquireConnection() {
    var _this = this;

    return new Promise(function (resolve, reject) {
      try {
        /*jslint browser: true*/
        var db = openDatabase(_this.database, _this.version, _this.displayName, _this.estimatedSize);
        db.transaction(function (t) {
          t.__cid = _.uniqueId('__cid');
          resolve(t);
        });
      } catch (e) {
        reject(e);
      }
    });
  };

  Engine_WebSQL.prototype.releaseConnection = function releaseConnection() {
    return new Promise(function (resolver) {
      return resolver();
    });
  };

  _createClass(Engine_WebSQL, [{
    key: 'dialect',
    get: function () {
      return 'websql';
    }
  }]);

  return Engine_WebSQL;
})(_Engine_SQLite33['default']);

exports['default'] = Engine_WebSQL;
module.exports = exports['default'];