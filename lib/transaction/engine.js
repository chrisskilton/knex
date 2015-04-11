'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var TransactionEngine = (function (_Engine) {
  function TransactionEngine(engine) {
    _classCallCheck(this, TransactionEngine);

    _Engine.call(this, engine);
    this.addHook('compile:select', function () {
      return;
    });
    // Connection is acquired before transaction starts.
    this.__connection = undefined;
  }

  _inherits(TransactionEngine, _Engine);

  // Return the connection shared by the transaction,
  // using the same method as a normal "engine".

  TransactionEngine.prototype.getConnection = function getConnection() {
    return new Promise(function (resolver, rejecter) {});
  };

  TransactionEngine.prototype.commit = function commit() {};

  TransactionEngine.prototype.rollback = function rollback() {};

  TransactionEngine.prototype.rollbackToSavepoint = function rollbackToSavepoint() {};

  TransactionEngine.prototype.savepoint = function savepoint() {};

  return TransactionEngine;
})(Engine);