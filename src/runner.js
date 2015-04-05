import {PassThrough} from 'readable-stream'
import {isArray, isFunction} from 'lodash/lang'
import assign  from 'lodash/object/assign'
import Promise from './promise'

// The "Runner" constructor takes a "builder" (query, schema, or raw)
// and runs through each of the query statements, calling any additional
// "output" method provided alongside the query and bindings.
export default class Runner {
  
  constructor(engine) {
    this.engine  = engine
    this.queries = []
  }

  // "Run" the target, calling "toSQL" on the builder, returning
  // an object or array of queries to run, each of which are run on
  // a single connection.
  run(builder) {
    return this.engine.getConnection()
      .then((conn) => {

      })
      .then(function(connection) {
        this.connection = connection

        // Emit a "start" event on both the builder and the engine,
        // allowing us to listen in on any events. We fire on the "engine"
        // before building the SQL, and on the builder after building the SQL
        // in case we want to determine at how long it actually
        // took to build the query.
        this.engine.emit('start', this.builder)
        var sql = this.builder.toSQL()
        this.builder.emit('start', this.builder)

        if (isArray(sql)) {
          return this.queryArray(sql)
        }
        return this.query(sql)
      })

      // If there are any "error" listeners, we fire an error event
      // and then re-throw the error to be eventually handled by
      // the promise chain. Useful if you're wrapping in a custom `Promise`.
      .catch(function(err) {
        if (this.builder._events && this.builder._events.error) {
          this.builder.emit('error', err)
        }
        throw err
      })

      // Fire a single "end" event on the builder when
      // all queries have successfully completed.
      .tap(() => this.builder.emit('end'))
      .finally(this.cleanupConnection)
  }

  // Stream the result set, by passing through to the dialect's streaming
  // capabilities. If the options are
  stream(options, handler) {
    
    // If we specify stream(handler).then(...
    if (arguments.length === 1) {
      if (isFunction(options)) {
        handler = options
        options = {}
      }
    }

    // Determines whether we emit an error or throw here.
    var hasHandler = isFunction(handler)

    var stream = new PassThrough({objectMode: true})
    return new Promise((resolver, rejecter) => {


    })

    var promise = Promise.bind(this)
      .then(this.ensureConnection)
      .then(function(connection) {
        this.connection = connection
        var sql = this.builder.toSQL()
        var err = new Error('The stream may only be used with a single query statement.')
        if (isArray(sql)) {
          if (hasHandler) throw err
          stream.emit('error', err)
        }
        return sql
      }).then((sql) => {
        return this._stream(sql, stream, options)
      })
      .finally(this.cleanupConnection)

    // If a function is passed to handle the stream, send the stream
    // there and return the promise, otherwise just return the stream
    // and the promise will take care of itsself.
    if (hasHandler) {
      handler(stream)
      return promise
    }
    return stream
  }

  // Allow you to pipe the stream to a writable stream.
  pipe(writable, options) {
    return this.stream(options).pipe(writable)
  }

  // "Runs" a query, returning a promise. All queries specified by the builder are guaranteed
  // to run in sequence, and on the same connection, especially helpful when schema building
  // and dealing with foreign key constraints, etc.
  query(obj) {
    return new Promise((resolver, rejecter) => {
      if (!this.connection) {
        throw new Error('There is an error with the database connection. Please check your config.')
      }
      obj.__cid = this.connection.__cid
      this.builder.emit('query', obj)
      this.engine.emit('query', obj)
      return this._query(obj).bind(this).then(this.processResponse)
    }) 
  }

  // In the case of the "schema builder" we call `queryArray`, which runs each
  // of the queries in sequence.
  queryArray(queries) {
    return new Promise((resolver, rejecter) => {
      return queries.length === 1 ? this.query(queries[0]) : Promise.bind(this)
        .thenReturn(queries)
        .reduce(function(memo, query) {
          return this.query(query).then(function(resp) {
            memo.push(resp)
            return memo
          })
        }, [])      
    })
  }

  // "Debug" the query being run.
  debug(obj) {
    console.dir(assign({__cid: this.connection.__cid}, obj))
  }

  // Check whether we're "debugging", based on either calling `debug` on the query.
  isDebugging() {
    return this.builder._debug || (this.engine.isDebugging === true && this.builder._debug !== false)
  }

  // Cleanup the connection as necessary, if the `_connection` was
  // explicitly set on the query we don't need to do anything here,
  // otherwise we
  cleanupConnection() {
    if (!this.builder._connection && typeof this.connection !== "undefined") {
      return this.engine.releaseConnection(this.connection)
    }
  }

}
