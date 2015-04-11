'use strict';

undefined.modifiers = ['unsigned', 'nullable', 'defaultTo', 'first', 'after', 'comment'];

// Types
// ------

increments = 'int unsigned not null auto_increment primary key';
bigincrements = 'bigint unsigned not null auto_increment primary key';
bigint = 'bigint';
double = function (precision, scale) {
  if (!precision) return 'double';
  return 'double(' + this._num(precision, 8) + ', ' + this._num(scale, 2) + ')';
};
integer = function (length) {
  length = length ? '(' + this._num(length, 11) + ')' : '';
  return 'int' + length;
};
mediumint = 'mediumint';
smallint = 'smallint';
tinyint = function (length) {
  length = length ? '(' + this._num(length, 1) + ')' : '';
  return 'tinyint' + length;
};
text = function (column) {
  switch (column) {
    case 'medium':
    case 'mediumtext':
      return 'mediumtext';
    case 'long':
    case 'longtext':
      return 'longtext';
    default:
      return 'text';
  }
};
mediumtext = function () {
  return this.text('medium');
};
longtext = function () {
  return this.text('long');
};
enu = function (allowed) {
  return 'enum(\'' + allowed.join('\', \'') + '\')';
};
datetime = 'datetime';
timestamp = 'timestamp';
bit = function (length) {
  return length ? 'bit(' + this._num(length) + ')' : 'bit';
};

// Modifiers
// ------

defaultTo = function (value) {
  /*jshint unused: false*/
  var defaultVal = ColumnCompiler_MySQL.super_.prototype.defaultTo.apply(this, arguments);
  if (this.type !== 'blob' && this.type.indexOf('text') === -1) {
    return defaultVal;
  }
  return '';
};
unsigned = function () {
  return 'unsigned';
};
first = function () {
  return 'first';
};
after = function (column) {
  return 'after ' + this.formatter.wrap(column);
};
comment = function (comment) {
  if (comment && comment.length > 255) {
    helpers.warn('Your comment is longer than the max comment length for MySQL');
  }
  return comment && 'comment \'' + comment + '\'';
};