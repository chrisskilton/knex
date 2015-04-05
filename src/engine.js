// "Base Engine"
// ------
import cloneDeep      from 'lodash/lang/clone'
import Promise        from './promise'
import {EventEmitter} from 'events'

export default class Engine extends EventEmitter {

  constructor(config = {}) {
    this.isDebugging     = false
    this.migrationConfig = cloneDeep(config.migrations)
    this.seedConfig      = cloneDeep(config.seeds)
  }

  // Acquire a connection from the pool.
  getConnection() {
    return new Promise((resolver, rejecter) => {
      this.pool.acquire((err, connection) => {
        if (err) return rejecter(err)
        resolver(connection)
      })
    })
  }

  // Releases a connection from the connection pool,
  // returning a promise resolved when the connection is released.
  releaseConnection(connection) {
    return new Promise((resolver, rejecter) => {
      this.pool.release(connection, (err) => {
        if (err) return rejecter(err)
        resolver(connection)
      })
    })
  }

  // Destroy the current connection pool for the engine.
  destroy(callback) {
    var promise = new Promise((resolver, rejecter) => {
      if (!this.pool) return resolver()
      this.pool.destroy((err) => {
        if (err) return rejecter(err)
        resolver()
      })
    })
    
    // Allow either a callback or promise interface for destruction.
    if (typeof callback === 'function') {
      promise.asCallback(callback)
    } else {
      return promise;
    }
  }

  // Runs the SQL in a file
  runFile(fileName, bindings, options) {
    fs = fs || require('fs')
    return new Promise((resolver, rejecter) => {
      fs.readFile(fileName, 'UTF-8', (err, str) => {
        if (err) return rejecter(err)
        
      })
    })
  }

  get engine() {
    return this.dialect
  }

  // Return the database being used by this engine.
  get databaseName() {
    return this.connectionSettings.database
  }

}
