"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

exports.__esModule = true;

// table('tableName', (tbl) => {
//   tbl.string('account')
//   tbl.index([])
// })

exports.table = table;

var Table = (function () {
  function Table(tableName, columns) {
    _classCallCheck(this, Table);

    this.tableName = tableName;
    this.columns = columns;
  }

  Table.prototype.toJSON = function toJSON() {};

  Table.prototype.diff = function diff(engine) {
    return new Promise(function (resolver, rejecter) {});
  };

  return Table;
})();

function table(tableName) {
  for (var _len = arguments.length, columns = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    columns[_key - 1] = arguments[_key];
  }
}