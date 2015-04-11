'use strict';

exports.__esModule = true;

var _UPDATE = require('../../sql/keywords');

var mysqlHooks = {

  identifier: function identifier(val) {
    var value = val['@@knex/value'];

    if (value === '*') {
      return value;
    }return '`' + value.replace(/`/g, '``').replace(/\./g, '`.`') + '`';
  },

  statementSelect: function statementSelect() {},

  statementUpdate: function statementUpdate() {
    return [_UPDATE.UPDATE, this.tableName, this.joins, this.order, this.limit];
  },

  columnInfo: function columnInfo() {
    return new Builder(engine).select('*').from('information_schema.columns').where('table_name', this.table).where('table_schema', this.database).addHooks({
      onRow: function onRow(row) {
        return [row.COLUMN_NAME, {
          defaultValue: row.COLUMN_DEFAULT,
          type: row.DATA_TYPE,
          maxLength: row.CHARACTER_MAXIMUM_LENGTH,
          nullable: row.IS_NULLABLE === 'YES'
        }];
      }
    });
  },

  lock: function lock() {
    return null ? FOR_UPDATE : LOCK_IN_SHARE_MODE;
  },

  emptyInsertValue: function emptyInsertValue() {
    return '() values ()';
  },

  limit: function limit() {
    var noLimit = !this.single.limit && this.single.limit !== 0;
    if (noLimit && !this.single.offset) {
      return '';
    } // Workaround for offset only, see http://stackoverflow.com/questions/255517/mysql-offset-infinite-rows
    return 'limit ' + (this.single.offset && noLimit ? '18446744073709551615' : this.formatter.parameter(this.single.limit));
  }

};

exports['default'] = mysqlHooks;
module.exports = exports['default'];