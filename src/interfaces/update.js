// [ WITH [ RECURSIVE ] with_query [, ...] ]
// UPDATE [ ONLY ] table_name [ * ] [ [ AS ] alias ]
//     SET { column_name = { expression | DEFAULT } |
//           ( column_name [, ...] ) = ( { expression | DEFAULT } [, ...] ) } [, ...]
//     [ FROM from_list ]
//     [ WHERE condition | WHERE CURRENT OF cursor_name ]
//     [ RETURNING * | output_expression [ [ AS ] output_name ] [, ...] ]

export const IUpdate = {

  // Sets the values for an `update`, allowing for:
  // .update(key, value, [returning])
  // .update(tableName).set(values)
  // .update(tableName).set(key, value)
  // .update(Map | Object, [returning])
  update(...args) {
    switch(args.length) {
      case 3: return this.returning(args[3]).update([args[1], args[2]])
      case 2: 
        if (typeof args[1] === 'string') {
          return this.update([args[1], args[2]])
        }
        return this.returning(args[2]).update(args[1])
      case 1:
        if (typeof args[0] === 'string') {
          return this.tableName(args[0])
        }
    }
    return this.__type('update').__clause(args[0])
  },

  set(key, value) {
    
  },

  upsert(columns) {
    // ?? TODO
  },

  // increment / decrement helpers

  increment(column, amount = 1) {
    return clause(this, statementType('update'))
      .set(column, wrap(column(column), '', ` + ${int(amount)}`))
  },

  decrement(column, amount = 1) {
    return clause(this, statementType('update'))
      .set(column, wrap(column(column), '', ` - ${int(amount)}`))
  }  

}
