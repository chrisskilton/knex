
export var withInterface = {

  withClause(clause) {
    return clause(this, withClause(clause))
  },

  withRecursive() {
    return clause(this, withRecursive(clause))
  }
  
}
