'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _merge = require('lodash/object/merge');

var _merge2 = _interopRequireWildcard(_merge);

/*jslint node:true, nomen: true*/
var Readable = require('stream').Readable;

var OracleQueryStream = (function (_Readable) {
  function OracleQueryStream(connection, sql, bindings, options) {
    _classCallCheck(this, OracleQueryStream);

    _Readable.call(this, _merge2['default']({
      objectMode: true,
      highWaterMark: 1000
    }, options));
    this.oracleReader = connection.reader(sql, bindings || []);
  }

  _inherits(OracleQueryStream, _Readable);

  return OracleQueryStream;
})(Readable);

OracleQueryStream.prototype._read = function () {
  var self = this;

  function pushNull() {
    process.nextTick(function () {
      self.push(null);
    });
  }

  try {
    this.oracleReader.nextRows(function (err, rows) {
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
    if (e.message === 'invalid state: reader is busy with another nextRows call') {
      return false;
    } else {
      this.emit('error', e);
    }
  }
};

module.exports = OracleQueryStream;