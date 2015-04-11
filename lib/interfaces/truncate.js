"use strict";

exports.__esModule = true;
var ITruncate = {

  // Truncates a table, ends the query chain.
  truncate: function truncate(tableName) {
    if (tableName) this.table(tableName);
    return into(new TruncateBuilder(), this);
  }

};
exports.ITruncate = ITruncate;