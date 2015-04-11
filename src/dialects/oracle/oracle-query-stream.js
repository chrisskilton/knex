/*jslint node:true, nomen: true*/
var Readable = require('stream').Readable;

import merge from 'lodash/object/merge'

class OracleQueryStream extends Readable {
  constructor(connection, sql, bindings, options) {
    super(merge({
      objectMode: true,
      highWaterMark: 1000
    }, options))
    this.oracleReader = connection.reader(sql, bindings || []);
  }
}

OracleQueryStream.prototype._read = function() {
  var self = this;

  function pushNull() {
    process.nextTick(function() {
      self.push(null);
    });
  }

  try {
    this.oracleReader.nextRows(function(err, rows) {
      if (err) {
        return self.emit('error', err);
      }

      if (rows.length === 0) {
        pushNull();
      } else {
        for (var i = 0; i < rows.length; i++) {
          if (rows[i]) {
            self.push(rows[i]);
          } else {
            pushNull();
          }
        }
      }
    });
  } catch (e) {
    // Catch Error: invalid state: reader is busy with another nextRows call
    // and return false to rate limit stream.
    if (e.message ===
      'invalid state: reader is busy with another nextRows call') {
      return false;
    } else {
      this.emit('error', e);
    }
  }
};


module.exports = OracleQueryStream;
