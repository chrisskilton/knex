
export const IReturning = {

  // Sets the returning value for the query.
  returning(val) {
    return this.__clause('returning', val)
  }  
  
}
