'use strict';

exports.__esModule = true;
// [ WITH [ RECURSIVE ] with_query [, ...] ]
// UPDATE [ ONLY ] table_name [ * ] [ [ AS ] alias ]
//     SET { column_name = { expression | DEFAULT } |
//           ( column_name [, ...] ) = ( { expression | DEFAULT } [, ...] ) } [, ...]
//     [ FROM from_list ]
//     [ WHERE condition | WHERE CURRENT OF cursor_name ]
//     [ RETURNING * | output_expression [ [ AS ] output_name ] [, ...] ]

var IUpdate = {

  // Sets the values for an `update`, allowing for:
  // .update(key, value, [returning])
  // .update(tableName).set(values)
  // .update(tableName).set(key, value)
  // .update(Map | Object, [returning])
  update: function update() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    switch (args.length) {
      case 3:
        return this.returning(args[3]).update([args[1], args[2]]);
      case 2:
        if (typeof args[1] === 'string') {
          return this.update([args[1], args[2]]);
        }
        return this.returning(args[2]).update(args[1]);
      case 1:
        if (typeof args[0] === 'string') {
          return this.tableName(args[0]);
        }
    }
    return this.__type('update').__clause(args[0]);
  },

  set: function set(key, value) {},

  upsert: function upsert(columns) {},

  // increment / decrement helpers

  increment: function increment(column) {
    var amount = arguments[1] === undefined ? 1 : arguments[1];

    return clause(this, statementType('update')).set(column, wrap(column(column), '', ' + ' + int(amount)));
  },

  decrement: function decrement(column) {
    var amount = arguments[1] === undefined ? 1 : arguments[1];

    return clause(this, statementType('update')).set(column, wrap(column(column), '', ' - ' + int(amount)));
  }

};
exports.IUpdate = IUpdate;

// ?? TODO