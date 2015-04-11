
export const IColumninfo = {

  // Retrieves columns for the table specified by `knex(tableName)`
  columnInfo(column) {
    if (column) {
      return this.columnInfo().columns(column)
    }
    return this.__type('columnInfo')
  }

}
