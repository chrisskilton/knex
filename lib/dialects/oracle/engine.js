'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;

// Oracle Engine
// -------

var _ReturningHelper = require('./utils');

var _clone = require('lodash/lang/clone');

var _clone2 = _interopRequireWildcard(_clone);

var _Engine2 = require('../../engine');

var _Engine3 = _interopRequireWildcard(_Engine2);

var _Promise = require('../../promise');

var _Promise2 = _interopRequireWildcard(_Promise);

var _Pool = require('../../pool');

var _Pool2 = _interopRequireWildcard(_Pool);

// Always initialize with the "QueryBuilder" and "QueryCompiler"
// objects, which extend the base 'lib/query/builder' and
// 'lib/query/compiler', respectively.

var Engine_Oracle = (function (_Engine) {
  function Engine_Oracle(config) {
    _classCallCheck(this, Engine_Oracle);

    _Engine.call(this, config);
    if (config.debug) this.isDebugging = true;
    this.connectionSettings = _.clone(config.connection)
    // this.pool   = new Pool(assign({
    //   release(client, callback) {
    //     client.close()
    //     callback()
    //   }
    // }, config.pool))
    ;
  }

  _inherits(Engine_Oracle, _Engine);

  Engine_Oracle.wrapIdentifier = function wrapIdentifier(value) {
    return value !== '*' ? '"' + value.replace(/"/g, '""') + '"' : '*';
  };

  // Get a raw connection, called by the `pool` whenever a new
  // connection needs to be added to the pool.

  Engine_Oracle.prototype.acquireRawConnection = function acquireRawConnection() {
    var _this = this;

    return new _Promise2['default'](function (resolver, rejecter) {
      return _this.driver.connect(_this.connectionSettings, function (err, connection) {
        if (err) return rejecter(err);
        if (self.connectionSettings.prefetchRowCount) {
          connection.setPrefetchRowCount(self.connectionSettings.prefetchRowCount);
        }
        resolver(connection);
      });
    });
  };

  // Used to explicitly close a connection, called internally by the pool
  // when a connection times out or the pool is shutdown.

  Engine_Oracle.prototype.destroyRawConnection = function destroyRawConnection(connection) {
    connection.close();
  };

  // Return the database for the Oracle client.

  Engine_Oracle.prototype.database = function database() {
    return this.connectionSettings.database;
  };

  // Position the bindings for the query.

  Engine_Oracle.prototype.positionBindings = function positionBindings(sql) {
    var questionCount = 0;
    return sql.replace(/\?/g, function () {
      questionCount += 1;
      return ':' + questionCount;
    });
  };

  Engine_Oracle.prototype.preprocessBindings = function preprocessBindings(bindings) {
    if (!bindings) {
      return;
    }return bindings.map(function (binding) {
      if (binding instanceof _ReturningHelper.ReturningHelper && driver) {
        // returning helper uses always ROWID as string
        return new this.driver.OutParam(driver.OCCISTRING);
      }
      if (typeof binding === 'boolean') {
        return binding ? 1 : 0;
      }
      return binding;
    });
  };

  _createClass(Engine_Oracle, [{
    key: 'driver',
    get: function () {
      return 'oracle';
    }
  }, {
    key: 'dialect',
    get: function () {
      return 'oracle';
    }
  }]);

  return Engine_Oracle;
})(_Engine3['default']);

exports['default'] = Engine_Oracle;
module.exports = exports['default'];