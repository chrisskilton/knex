// [ WITH [ RECURSIVE ] with_query [, ...] ]
// INSERT INTO table_name [ ( column_name [, ...] ) ]
//     { DEFAULT VALUES | VALUES ( { expression | DEFAULT } [, ...] ) [, ...] | query }
//     [ RETURNING * | output_expression [ [ AS ] output_name ] [, ...] ]

export const IInsert = {

  // Insert & Update
  // ------

  // Sets the values for an `insert` query.
  insert(values, returning) {
    switch(arguments.length) {
      case 1: return this.values(values)
      case 2: return this.values(values).returning(returning)
    }
  },

  // insertInto(tableName).values(vals)
  insertInto(tableName) {
    return this.into(tableName)
  },

  // .values(vals)
  values(vals) {
    return this.__clause('values', vals)
  }

}
