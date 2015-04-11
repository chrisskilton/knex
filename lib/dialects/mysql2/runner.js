'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;

var _Promise = require('../../promise');

var _Promise2 = _interopRequireWildcard(_Promise);

var _Runner2 = require('../../runner');

var _Runner3 = _interopRequireWildcard(_Runner2);

var _skim = require('../../helpers');

var Runner_MySQL2 = (function (_Runner) {
  function Runner_MySQL2() {
    _classCallCheck(this, Runner_MySQL2);

    if (_Runner != null) {
      _Runner.apply(this, arguments);
    }
  }

  _inherits(Runner_MySQL2, _Runner);

  // Grab a connection, run the query via the MySQL streaming interface,
  // and pass that through to the stream we've sent back to the client.

  Runner_MySQL2.prototype._stream = function _stream(sql, stream, options) {
    /*jshint unused: false*/
    var runner = this;
    return new _Promise2['default'](function (resolver, rejecter) {
      stream.on('error', rejecter);
      stream.on('end', resolver);
      return runner.query(sql).map(function (row) {
        stream.write(row);
      })['catch'](function (err) {
        return stream.emit('error', err);
      }).then(function () {
        return stream.end();
      });
    });
  };

  // Runs the query on the specified connection, providing the bindings
  // and any other necessary prep work.

  Runner_MySQL2.prototype._query = function _query(obj) {
    var sql = obj.sql;
    if (this.isDebugging()) this.debug(obj);
    if (obj.options) sql = _.extend({ sql: sql }, obj.options);
    var connection = this.connection;
    if (!sql) throw new Error('The query is empty');
    return new _Promise2['default'](function (resolver, rejecter) {
      connection.query(sql, obj.bindings, function (err, rows, fields) {
        if (err) return rejecter(err);
        obj.response = [rows, fields];
        resolver(obj);
      });
    });
  };

  // Process the response as returned from the query.

  Runner_MySQL2.prototype.processResponse = function processResponse(obj) {
    var _obj$response = obj.response;
    var rows = _obj$response[0];
    var fields = _obj$response[1];

    var method = obj.method;
    if (obj.output) {
      return obj.output.call(this, rows, fields);
    }switch (method) {
      case 'select':
      case 'pluck':
      case 'first':
        var resp = helpers.skim(rows);
        if (method === 'pluck') {
          return _.pluck(resp, obj.pluck);
        }return method === 'first' ? resp[0] : resp;
      case 'insert':
        return [rows.insertId];
      case 'del':
      case 'update':
      case 'counter':
        return rows.affectedRows;
      default:
        return response;
    }
  };

  return Runner_MySQL2;
})(_Runner3['default']);

exports['default'] = Runner_MySQL2;
module.exports = exports['default'];