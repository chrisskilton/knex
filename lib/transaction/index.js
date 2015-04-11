'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;

// Transaction
// -------

var _Promise = require('../promise');

var _Promise2 = _interopRequireWildcard(_Promise);

var _EventEmitter2 = require('events');

// Creates a new wrapper object for constructing a transaction.
// Called by the `knex.transaction`, which sets the correct client
// and handles the `container` object, passing along the correct
// `connection` to keep all of the transactions on the correct connection.

var Transaction = (function (_EventEmitter) {
  function Transaction(transactor) {
    _classCallCheck(this, Transaction);

    _EventEmitter.call(this);
    this.transactor = transactor;
  }

  _inherits(Transaction, _EventEmitter);

  Transaction.prototype.run = function run(source, container) {
    var Knex = require('../knex');

    // Create an entirely new knex instance just for this transaction
    var transactor = Knex.initialize({
      __client__: this.client,
      __transactor__: { _runner: runner }
    });

    // Remove the ability to start a transaction or destroy
    // the entire pool within a transaction.
    transactor.destroy = transactor.transaction = void 0;

    // Commits the transaction:
    transactor.commit = function (message) {
      runner.finishTransaction(0, transactor, message);
    };

    // Rolls back the transaction.
    transactor.rollback = function (error) {
      runner.finishTransaction(1, transactor, error);
    };

    transactor._runner = runner;

    return transactor;
  };

  // Build the knex instance passed around inside the transaction container.
  // It can be used both as a fully functional knex instance, or assimilated
  // into existing knex chains via the ".transacting" method call.

  Transaction.prototype.containerObject = function containerObject(runner) {};

  Transaction.prototype.initiateDeferred = function initiateDeferred(transactor) {

    // Initiate a deferred object, bound to the container object,
    // so we know when the transaction completes or fails
    // and can continue from there.
    var dfd = transactor.__dfd__ = _Promise2['default'].pending();

    // Call the container with the transaction
    // commit & rollback objects.
    var result = this.container(transactor);

    // If we've returned a "thenable" from the transaction container,
    // and it's got the transaction object we're running for this, assume
    // the rollback and commit are chained to this object's success / failure.
    if (result && result.then && typeof result.then === 'function') {
      result.then(function (val) {
        transactor.commit(val);
      })['catch'](function (err) {
        transactor.rollback(err);
      });
    }

    // Return the promise for the entire transaction.
    return dfd.promise;
  };

  // Passed a `container` function, this method runs the current
  // transaction, returning a promise.

  Transaction.prototype.then = function then() {
    var Runner = this.client.Runner;
    var self = this;

    // Create a new "runner" object, passing the "runner"
    // object along, so we can easily keep track of every
    // query run on the current connection.
    var result = new Runner(this).startTransaction().then(function (runner) {
      return self.containerObject(runner);
    }).then(function (container) {
      return self.initiateDeferred(container);
    });
    return result.then.apply(result, arguments);
  };

  return Transaction;
})(_EventEmitter2.EventEmitter);

exports['default'] = Transaction;
module.exports = exports['default'];
/* onFulfilled, onRejected */