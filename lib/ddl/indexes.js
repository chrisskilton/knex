'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;
exports.add = add;
exports.drop = drop;
exports.primaryKey = primaryKey;
exports.index = index;
exports.unique = unique;
exports.foreignKey = foreignKey;

var Key = (function () {
  function Key(type, columns, name) {
    _classCallCheck(this, Key);

    this.type = type;
    this.columns = columns;
    this.name = name;
    this.action = null;
  }

  Key.prototype.compile = function compile(options) {};

  return Key;
})();

function add(key) {
  key.action = 'ADD';
  return key;
}

function drop(key) {
  key.action = 'DROP';
  return key;
}

function primaryKey(columns, keyName) {
  return new Key('PRIMARY', columns, keyName);
}

function index(columns, keyName) {
  return new Key('INDEX', columns, keyName);
}

function unique(columns, keyName) {
  return new Key('UNIQUE', columns, keyName);
}

function foreignKey(columns, keyName) {
  return new Key('FOREIGN', columns, keyName);
}