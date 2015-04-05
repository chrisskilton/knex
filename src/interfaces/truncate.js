
export var truncateInterface = {

  // Truncates a table, ends the query chain.
  truncate(tableName) {
    if (tableName) this.table(tableName)
    return into(new TruncateBuilder(), this)
  }
  
}
