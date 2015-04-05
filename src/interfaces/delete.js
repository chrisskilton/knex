// [ WITH [ RECURSIVE ] with_query [, ...] ]
// DELETE FROM [ ONLY ] table_name [ * ] [ [ AS ] alias ]
//     [ USING using_list ]
//     [ WHERE condition | WHERE CURRENT OF cursor_name ]
//     [ RETURNING * | output_expression [ [ AS ] output_name ] [, ...] ]

export var IDelete = {

  deleteFrom(tableName) {

  },

  // Executes a delete statement on the query
  del(returning) {
    switch (arguments.length) {
      case 1: return this.__delete().returning()
    }
    return this.__delete(this, statementType('delete'))
  },

  from(...args) {
    return this.__clause('from', args)    
  }

}

IDelete.delete = IDelete.del

export default IDelete