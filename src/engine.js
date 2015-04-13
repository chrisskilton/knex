// "Base Engine"
// ------
import cloneDeep      from 'lodash/lang/clone'
import {EventEmitter} from 'events'
import Promise        from './promise'

export default class Engine extends EventEmitter {

  constructor(config = {}) {
    super()
    this.isDebugging     = false
    this.migrationConfig = cloneDeep(config.migrations)
    this.seedConfig      = cloneDeep(config.seeds)
    // this.pool         = new this.Pool(config.pool)
  }

  get engine() {
    return this.dialect
  }

  // Return the database being used by this engine.
  get databaseName() {
    return this.connectionSettings.database
  }

  // Converts a "builder" into SQL which is properly parameterized
  builderToSQL(builder) {
    if (builder.__cache) {
      return builder.__cache
    }
    var sql = '', bindings = []
    var beforeSpace = (val) => {
      if (val['@@knex/hook'] === 'parameter') {
        bindings.push(val['@@knex/value'])
        return '?'
      }
      return val
    }
    builder.withHook('beforeSpace', beforeSpace, () => {
      for (var str of builder) {
        sql += str
      }
    })
    return {
      sql: sql,
      bindings: bindings
    }
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
      return promise
    }
  }

  // Runs the SQL in a file
  runFile(fileName, bindings, options) {
    return new Promise((resolver, rejecter) => {
      require('fs').readFile(fileName, 'UTF-8', (err, str) => {
        if (err) return rejecter(err)
      })
    })
  }

}

Engine.prototype['@@__KNEX_ENGINE__@@'] = true
