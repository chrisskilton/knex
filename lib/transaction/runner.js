'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _Runner2 = require('../runner');

var _Runner3 = _interopRequireWildcard(_Runner2);

var TransactionRunner = (function (_Runner) {
  function TransactionRunner(engine) {
    _classCallCheck(this, TransactionRunner);

    _Runner.call(this, engine);
  }

  _inherits(TransactionRunner, _Runner);

  // Run the transaction on the correct "runner" instance.

  TransactionRunner.prototype.transactionQuery = function transactionQuery() {
    var _this = this;

    return new Promise(function () {
      var runner = _this.builder._transacting._runner;
      if (!(runner instanceof _Runner3['default'])) {
        throw new Error('Invalid transaction object provided.');
      }
      var sql = _this.builder.toSQL();
      if (_.isArray(sql)) {
        return runner.queryArray(sql);
      }
      return runner.query(sql);
    });
  };

  // Begins a transaction statement on the instance,
  // resolving with the current runner.

  TransactionRunner.prototype.startTransaction = function startTransaction() {
    var _this2 = this;

    return Promise.bind(this).then(this.ensureConnection).then(function (connection) {
      _this2.connection = connection;
      _this2.transaction = true;
      return _this2.beginTransaction();
    }).thenReturn(this);
  };

  // Finishes the transaction statement and handles disposing of the connection,
  // resolving / rejecting the transaction's promise, and ensuring the transaction object's
  // `_runner` property is `null`'ed out so it cannot continue to be used.

  TransactionRunner.prototype.finishTransaction = function finishTransaction(action, containerObject, msg) {
    var _this3 = this;

    return new Promise(function (resolver, rejecter) {
      var query,
          dfd = containerObject.__dfd__;

      // Run the query to commit / rollback the transaction.
      switch (action) {
        case 0:
          query = _this3.commitTransaction();
          break;
        case 1:
          query = _this3.rollbackTransaction();
          break;
      }

      return query.then(function (resp) {
        msg = msg === undefined ? resp : msg;
        switch (action) {
          case 0:
            dfd.fulfill(msg);
            break;
          case 1:
            dfd.reject(msg);
            break;
        }

        // If there was a problem committing the transaction,
        // reject the transaction block (to reject the entire transaction block),
        // then re-throw the error for any promises chained off the commit.
      })['catch'](function (e) {
        dfd.reject(e);
        throw e;
      }).bind(_this3)['finally'](function () {

        // Kill the "_runner" object on the containerObject,
        // so it's not possible to continue using the transaction object.
        containerObject._runner = undefined;

        return this.cleanupConnection();
      });
    });
  };

  TransactionRunner.prototype.beginTransaction = function beginTransaction() {
    return this._beginTransaction && this.query({ sql: this._beginTransaction });
  };

  TransactionRunner.prototype.commitTransaction = function commitTransaction() {
    return this._commitTransaction && this.query({ sql: this._commitTransaction });
  };

  TransactionRunner.prototype.rollbackTransaction = function rollbackTransaction() {
    return this._rollbackTransaction && this.query({ sql: this._rollbackTransaction });
  };

  TransactionRunner.prototype.cleanupConnection = function cleanupConnection() {};

  return TransactionRunner;
})(_Runner3['default']);