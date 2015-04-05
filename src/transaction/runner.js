import Runner from '../runner'

class TransactionRunner extends Runner {

  constructor(engine) {
    this.engine = engine
  }

  // Run the transaction on the correct "runner" instance.
  transactionQuery() {
    return new Promise(() => {
      var runner = this.builder._transacting._runner
      if (!(runner instanceof Runner)) {
        throw new Error('Invalid transaction object provided.')
      }
      var sql = this.builder.toSQL()
      if (_.isArray(sql)) {
        return runner.queryArray(sql)
      }
      return runner.query(sql)      
    })
  }

  // Begins a transaction statement on the instance,
  // resolving with the current runner.
  startTransaction() {
    return Promise
      .bind(this)
      .then(this.ensureConnection)
      .then((connection) => {
        this.connection  = connection
        this.transaction = true
        return this.beginTransaction()
      })
      .thenReturn(this)
  }

  // Finishes the transaction statement and handles disposing of the connection,
  // resolving / rejecting the transaction's promise, and ensuring the transaction object's
  // `_runner` property is `null`'ed out so it cannot continue to be used.
  finishTransaction(action, containerObject, msg) {
    return new Promise((resolver, rejecter) => {
      var query, dfd = containerObject.__dfd__

      // Run the query to commit / rollback the transaction.
      switch (action) {
        case 0:
          query = this.commitTransaction()
          break
        case 1:
          query = this.rollbackTransaction()
          break
      }

      return query.then(function(resp) {
        msg = (msg === undefined) ? resp : msg
        switch (action) {
          case 0:
            dfd.fulfill(msg)
            break
          case 1:
            dfd.reject(msg)
            break
        }

      // If there was a problem committing the transaction,
      // reject the transaction block (to reject the entire transaction block),
      // then re-throw the error for any promises chained off the commit.
      }).catch(function(e) {
        dfd.reject(e)
        throw e
      })
      .bind(this)
      .finally(function() {

        // Kill the "_runner" object on the containerObject,
        // so it's not possible to continue using the transaction object.
        containerObject._runner = undefined

        return this.cleanupConnection()
      })
    })
  }

  beginTransaction() {
    return this._beginTransaction && this.query({sql: this._beginTransaction})
  }
  
  commitTransaction() {
    return this._commitTransaction && this.query({sql: this._commitTransaction})
  }
  
  rollbackTransaction() {
    return this._rollbackTransaction && this.query({sql: this._rollbackTransaction})
  }

  cleanupConnection() {
    
  }

}
