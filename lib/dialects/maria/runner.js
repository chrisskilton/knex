'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;
// MariaSQL Runner
// ------

var _Promise = require('../../promise');

var _Promise2 = _interopRequireWildcard(_Promise);

var _pluck = require('lodash/collection/pluck');

var _pluck2 = _interopRequireWildcard(_pluck);

var _SqlString = require('../mysql/string');

var _SqlString2 = _interopRequireWildcard(_SqlString);

var _Runner2 = require('../../runner');

var _Runner3 = _interopRequireWildcard(_Runner2);

var _helpers = require('../../helpers');

var _helpers2 = _interopRequireWildcard(_helpers);

// Inherit from the `Runner` constructor's prototype,
// so we can add the correct `then` method.

var Runner_MariaSQL = (function (_Runner) {
  function Runner_MariaSQL() {
    _classCallCheck(this, Runner_MariaSQL);

    if (_Runner != null) {
      _Runner.apply(this, arguments);
    }
  }

  _inherits(Runner_MariaSQL, _Runner);

  // Grab a connection, run the query via the MariaSQL streaming interface,
  // and pass that through to the stream we've sent back to the client.

  Runner_MariaSQL.prototype._stream = function _stream(sql, stream, options) {
    var _this = this;

    return new _Promise2['default'](function (resolver, rejecter) {
      _this.connection.query(sql.sql, sql.bindings).on('result', function (result) {
        result.on('row', rowHandler(function (row) {
          stream.write(row);
        })).on('end', function (data) {
          resolver(data);
        });
      }).on('error', function (err) {
        rejecter(err);
      });
    });
  };

  // Runs the query on the specified connection, providing the bindings
  // and any other necessary prep work.

  Runner_MariaSQL.prototype._query = function _query(obj) {
    var _this2 = this;

    _Promise2['default']['try'](function () {
      var sql = obj.sql;
      if (_this2.isDebugging()) _this2.debug(obj);
      var connection = _this2.connection;
      var tz = _this2.client.connectionSettings.timezone || 'local';
      if (!sql) throw new Error('The query is empty');
      return new _Promise2['default'](function (resolver, rejecter) {
        var rows = [];
        var query = connection.query(_SqlString2['default'].format(sql, obj.bindings, false, tz), []);
        query.on('result', function (result) {
          result.on('row', rowHandler(function (row) {
            rows.push(row);
          })).on('end', function (data) {
            obj.response = [rows, data];
            resolver(obj);
          });
        }).on('error', rejecter);
      });
    });
  };

  // Process the response as returned from the query.

  Runner_MariaSQL.prototype.processResponse = function processResponse(obj) {
    var response = obj.response;
    var method = obj.method;
    var rows = response[0];
    var data = response[1];
    if (obj.output) {
      return obj.output.call(this, rows /*, fields*/);
    }switch (method) {
      case 'select':
      case 'pluck':
      case 'first':
        var resp = _helpers2['default'].skim(rows);
        if (method === 'pluck') {
          return _pluck2['default'](resp, obj.pluck);
        }return method === 'first' ? resp[0] : resp;
      case 'insert':
        return [data.insertId];
      case 'del':
      case 'update':
      case 'counter':
        return data.affectedRows;
      default:
        return response;
    }
  };

  return Runner_MariaSQL;
})(_Runner3['default']);

exports.Runner_MariaSQL = Runner_MariaSQL;

function parseType(value, type) {
  switch (type) {
    case 'DATETIME':
    case 'TIMESTAMP':
      return new Date(value);
    case 'INTEGER':
      return parseInt(value, 10);
    default:
      return value;
  }
}

function rowHandler(callback) {
  var types;
  return function (row, meta) {
    if (!types) types = meta.types;
    var keys = Object.keys(types);
    for (var i = 0, l = keys.length; i < l; i++) {
      var type = keys[i];
      row[type] = parseType(row[type], types[type]);
    }
    callback(row);
  };
}