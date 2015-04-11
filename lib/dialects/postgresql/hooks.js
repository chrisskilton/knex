'use strict';

exports.__esModule = true;

function wrapValue() {
  if (value === '*') {
    return value;
  }var matched = value.match(/(.*?)(\[[0-9]\])/);
  if (matched) {
    return wrapValue(matched[1]) + matched[2];
  }return '"' + value.replace(/"/g, '""') + '"';
}

exports['default'] = {

  identifier: function identifier(value) {
    return wrapValue(value);
  },

  // Compiles a truncate query.
  truncate: function truncate(value) {
    return into(value, 'RESTART IDENTITY');
  },

  values: function values() {
    if (_.isArray(insertValues) && insertValues.length === 1 && _.isEmpty(insertValues[0])) {
      insertValues = [];
    }
    if (_.isEmpty(insertValues) && !_.isFunction(insertValues)) {
      sql += this._emptyInsertValue;
    } else {
      var insertData = this._prepInsert(insertValues);

      if (_.isString(insertData)) {
        sql += insertData;
      } else {
        if (insertData.columns.length) {
          sql += '(' + this.formatter.columnize(insertData.columns) + ') values (' + _.map(insertData.values, this.formatter.parameterize, this.formatter).join('), (') + ')';
        } else {
          // if there is no target column only insert default values
          sql += '(' + self.formatter.wrap(self.single.returning) + ') values ' + _.map(insertData.values, function () {
            return '(' + (self._defaultInsertValue || '') + ')';
          }).join(', ');
        }
      }
    }
  } };

if (client.defaultReturning) {
  undefined._single.returning = client.defaultReturning;
}

// Used when the insert call is empty.
QueryCompiler_PG.prototype._emptyInsertValue = 'default values';

// is used if the an array with multiple empty values supplied
QueryCompiler_PG.prototype._defaultInsertValue = 'default';

// Compiles an `insert` query, allowing for multiple
// inserts using a single query statement.
QueryCompiler_PG.prototype.insert = function () {

  var returning = this.single.returning;
  return {
    sql: sql + this._returning(returning),
    returning: returning
  };
};

// Compiles an `update` query, allowing for a return value.
QueryCompiler_PG.prototype.update = function () {
  var updateData = this._prepUpdate(this.single.update);
  var wheres = this.where();
  var returning = this.single.returning;
  return {
    sql: 'update ' + this.tableName + ' set ' + updateData.join(', ') + (wheres ? ' ' + wheres : '') + this._returning(returning),
    returning: returning
  };
};

// Compiles an `update` query, allowing for a return value.
QueryCompiler_PG.prototype.del = function () {
  var sql = QueryCompiler.prototype.del.apply(this, arguments);
  var returning = this.single.returning;
  return {
    sql: sql + this._returning(returning),
    returning: returning
  };
};

QueryCompiler_PG.prototype._returning = function (value) {
  return value ? ' returning ' + this.formatter.columnize(value) : '';
};

QueryCompiler_PG.prototype.forUpdate = function () {
  return 'for update';
};
QueryCompiler_PG.prototype.forShare = function () {
  return 'for share';
};

// Compiles a columnInfo query
QueryCompiler_PG.prototype.columnInfo = function () {
  var column = this.single.columnInfo;
  return {
    sql: 'select * from information_schema.columns where table_name = ? and table_catalog = ?',
    bindings: [this.single.table, client.database()],
    output: function output(resp) {
      var out = _.reduce(resp.rows, function (columns, val) {
        columns[val.column_name] = {
          type: val.data_type,
          maxLength: val.character_maximum_length,
          nullable: val.is_nullable === 'YES',
          defaultValue: val.column_default
        };
        return columns;
      }, {});
      return column && out[column] || out;
    }
  };
};
module.exports = exports['default'];