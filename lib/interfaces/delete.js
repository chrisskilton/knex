'use strict';

exports.__esModule = true;
// [ WITH [ RECURSIVE ] with_query [, ...] ]
// DELETE FROM [ ONLY ] table_name [ * ] [ [ AS ] alias ]
//     [ USING using_list ]
//     [ WHERE condition | WHERE CURRENT OF cursor_name ]
//     [ RETURNING * | output_expression [ [ AS ] output_name ] [, ...] ]

var IDelete = {

  deleteFrom: function deleteFrom(tableName) {},

  // Executes a delete statement on the query
  del: function del(returning) {
    switch (arguments.length) {
      case 1:
        return this.__delete().returning();
    }
    return this.__delete(this, statementType('delete'));
  },

  from: function from() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return this.__clause('table', args);
  }

};

exports.IDelete = IDelete;
IDelete['delete'] = IDelete.del;