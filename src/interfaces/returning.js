
var IReturning = {

  // Sets the returning value for the query.
  returning(val) {
    return clause(this, returning(val))
  }  
  
}
