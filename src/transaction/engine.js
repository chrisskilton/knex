
class TransactionEngine extends Engine {

  constructor(engine) {
    this.engine = engine

    this.addHook('compile:select', () => {
      return 
    })

    // Connection is acquired before transaction starts.
    this.__connection = undefined
  }

  // Return the connection shared by the transaction,
  // using the same method as a normal "engine".
  getConnection() {
    return new Promise((resolver, rejecter) => {
      
    })
  }

  commit() {
    
  }

  rollback() {

  }

  rollbackToSavepoint() {

  }

  savepoint() {

  }

}