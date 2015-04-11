'use strict';

var Promise = require('bluebird/js/main/promise')();

Promise.prototype.exec = function (cb) {
  deprecate('knex.exec', 'knex.asCallback');
  return this.asCallback(cb);
};

Promise.prototype['yield'] = Promise.prototype.thenReturn;
Promise.prototype.ensure = Promise.prototype.lastly;
Promise.prototype.otherwise = Promise.prototype.caught;
Promise.prototype.asCallback = Promise.prototype.nodeify;

module.exports = Promise;