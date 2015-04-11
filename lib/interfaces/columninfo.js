'use strict';

exports.__esModule = true;
var IColumninfo = {

  // Retrieves columns for the table specified by `knex(tableName)`
  columnInfo: function columnInfo(column) {
    if (column) {
      return this.columnInfo().columns(column);
    }
    return this.__type('columnInfo');
  }

};
exports.IColumninfo = IColumninfo;