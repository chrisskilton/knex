// MariaSQL Runner
// ------
import Promise   from '../../promise'
import pluck     from 'lodash/collection/pluck'
import SqlString from '../mysql/string'
import Runner    from '../../runner'
import helpers   from '../../helpers'

// Inherit from the `Runner` constructor's prototype,
// so we can add the correct `then` method.
export class Runner_MariaSQL extends Runner {

  // Grab a connection, run the query via the MariaSQL streaming interface,
  // and pass that through to the stream we've sent back to the client.
  _stream(sql, stream, options) {
    return new Promise((resolver, rejecter) => {
      this.connection.query(sql.sql, sql.bindings)
        .on('result', function(result) {
          result
            .on('row', rowHandler(function(row) { stream.write(row); }))
            .on('end', function(data) { resolver(data); });
        })
        .on('error', function(err) { rejecter(err); });
    });
  }

  // Runs the query on the specified connection, providing the bindings
  // and any other necessary prep work.
  _query(obj) {
    Promise.try(() => {
      var sql = obj.sql;
      if (this.isDebugging()) this.debug(obj);
      var connection = this.connection;
      var tz = this.client.connectionSettings.timezone || 'local';
      if (!sql) throw new Error('The query is empty');
      return new Promise(function(resolver, rejecter) {
        var rows = [];
        var query = connection.query(SqlString.format(sql, obj.bindings, false, tz), []);
        query.on('result', function(result) {
          result.on('row', rowHandler(function(row) { rows.push(row); }))
          .on('end', function(data) {
            obj.response = [rows, data];
            resolver(obj);
          });
        })
        .on('error', rejecter);
      })
    })
  }

  // Process the response as returned from the query.
  processResponse(obj) {
    var response = obj.response;
    var method   = obj.method;
    var rows     = response[0];
    var data     = response[1];
    if (obj.output) return obj.output.call(this, rows/*, fields*/);
    switch (method) {
      case 'select':
      case 'pluck':
      case 'first':
        var resp = helpers.skim(rows);
        if (method === 'pluck') return pluck(resp, obj.pluck);
        return method === 'first' ? resp[0] : resp;
      case 'insert':
        return [data.insertId];
      case 'del':
      case 'update':
      case 'counter':
        return data.affectedRows;
      default:
        return response;
    }
  }

}

function parseType(value, type) {
  switch (type) {
    case 'DATETIME':
    case 'TIMESTAMP':
      return new Date(value)
    case 'INTEGER':
      return parseInt(value, 10)
    default:
      return value
  }
}

function rowHandler(callback) {
  var types;
  return function(row, meta) {
    if (!types) types = meta.types
    var keys = Object.keys(types)
    for (var i = 0, l = keys.length; i < l; i++) {
      var type = keys[i];
      row[type] = parseType(row[type], types[type])
    }
    callback(row)
  };
}
