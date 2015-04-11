'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _PassThrough = require('readable-stream');

var _isArray$isFunction = require('lodash/lang');

var _assign = require('lodash/object/assign');

var _assign2 = _interopRequireWildcard(_assign);

var _Promise = require('./promise');

var _Promise2 = _interopRequireWildcard(_Promise);

// The "Runner" constructor takes a "builder" (query, schema, or raw)
// and runs through each of the query statements, calling any additional
// "output" method provided alongside the query and bindings.

var Runner = (function () {
  function Runner(engine) {
    _classCallCheck(this, Runner);

    this.engine = engine;
    this.queries = [];
  }

  // "Run" the target, calling "toSQL" on the builder, returning
  // an object or array of queries to run, each of which are run on
  // a single connection.

  Runner.prototype.run = function run(builder) {
    var _this = this;

    return this.engine.getConnection().then(function (conn) {}).then(function (connection) {
      this.connection = connection;

      // Emit a "start" event on both the builder and the engine,
      // allowing us to listen in on any events. We fire on the "engine"
      // before building the SQL, and on the builder after building the SQL
      // in case we want to determine at how long it actually
      // took to build the query.
      this.engine.emit('start', this.builder);
      var sql = this.builder.toSQL();
      this.builder.emit('start', this.builder);

      if (_isArray$isFunction.isArray(sql)) {
        return this.queryArray(sql);
      }
      return this.query(sql);
    })

    // If there are any "error" listeners, we fire an error event
    // and then re-throw the error to be eventually handled by
    // the promise chain. Useful if you're wrapping in a custom `Promise`.
    ['catch'](function (err) {
      if (this.builder._events && this.builder._events.error) {
        this.builder.emit('error', err);
      }
      throw err;
    })

    // Fire a single "end" event on the builder when
    // all queries have successfully completed.
    .tap(function () {
      return _this.builder.emit('end');
    })['finally'](this.cleanupConnection);
  };

  // Stream the result set, by passing through to the dialect's streaming
  // capabilities. If the options are

  Runner.prototype.stream = (function (_stream) {
    function stream(_x, _x2) {
      return _stream.apply(this, arguments);
    }

    stream.toString = function () {
      return _stream.toString();
    };

    return stream;
  })(function (options, handler) {
    var _this2 = this;

    // If we specify stream(handler).then(...
    if (arguments.length === 1) {
      if (_isArray$isFunction.isFunction(options)) {
        handler = options;
        options = {};
      }
    }

    // Determines whether we emit an error or throw here.
    var hasHandler = _isArray$isFunction.isFunction(handler);

    var stream = new _PassThrough.PassThrough({ objectMode: true });
    return new _Promise2['default'](function (resolver, rejecter) {});

    var promise = _Promise2['default'].bind(this).then(this.ensureConnection).then(function (connection) {
      this.connection = connection;
      var sql = this.builder.toSQL();
      var err = new Error('The stream may only be used with a single query statement.');
      if (_isArray$isFunction.isArray(sql)) {
        if (hasHandler) throw err;
        stream.emit('error', err);
      }
      return sql;
    }).then(function (sql) {
      return _this2._stream(sql, stream, options);
    })['finally'](this.cleanupConnection);

    // If a function is passed to handle the stream, send the stream
    // there and return the promise, otherwise just return the stream
    // and the promise will take care of itsself.
    if (hasHandler) {
      handler(stream);
      return promise;
    }
    return stream;
  });

  // Allow you to pipe the stream to a writable stream.

  Runner.prototype.pipe = function pipe(writable, options) {
    return this.stream(options).pipe(writable);
  };

  // "Runs" a query, returning a promise. All queries specified by the builder are guaranteed
  // to run in sequence, and on the same connection, especially helpful when schema building
  // and dealing with foreign key constraints, etc.

  Runner.prototype.query = function query(obj) {
    var _this3 = this;

    return new _Promise2['default'](function (resolver, rejecter) {
      if (!_this3.connection) {
        throw new Error('There is an error with the database connection. Please check your config.');
      }
      obj.__cid = _this3.connection.__cid;
      _this3.builder.emit('query', obj);
      _this3.engine.emit('query', obj);
      return _this3._query(obj).bind(_this3).then(_this3.processResponse);
    });
  };

  // In the case of the "schema builder" we call `queryArray`, which runs each
  // of the queries in sequence.

  Runner.prototype.queryArray = function queryArray(queries) {
    var _this4 = this;

    return new _Promise2['default'](function (resolver, rejecter) {
      return queries.length === 1 ? _this4.query(queries[0]) : _Promise2['default'].bind(_this4).thenReturn(queries).reduce(function (memo, query) {
        return this.query(query).then(function (resp) {
          memo.push(resp);
          return memo;
        });
      }, []);
    });
  };

  // "Debug" the query being run.

  Runner.prototype.debug = function debug(obj) {
    console.dir(_assign2['default']({ __cid: this.connection.__cid }, obj));
  };

  // Check whether we're "debugging", based on either calling `debug` on the query.

  Runner.prototype.isDebugging = function isDebugging() {
    return this.builder._debug || this.engine.isDebugging === true && this.builder._debug !== false;
  };

  // Cleanup the connection as necessary, if the `_connection` was
  // explicitly set on the query we don't need to do anything here,
  // otherwise we

  Runner.prototype.cleanupConnection = function cleanupConnection() {
    if (!this.builder._connection && typeof this.connection !== 'undefined') {
      return this.engine.releaseConnection(this.connection);
    }
  };

  return Runner;
})();

exports['default'] = Runner;
module.exports = exports['default'];