'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;
exports.generateCombinedName = generateCombinedName;
exports.wrapSqlWithCatch = wrapSqlWithCatch;

var helpers = require('../../helpers');

function generateCombinedName(postfix, name, subNames) {
  var limit = 30;
  if (!Array.isArray(subNames)) subNames = subNames ? [subNames] : [];
  var table = name.replace(/\.|-/g, '_');
  var subNamesPart = subNames.join('_');
  var result = (table + '_' + (subNamesPart.length ? subNamesPart + '_' : '') + postfix).toLowerCase();
  if (result.length > limit) {
    helpers.warn('Automatically generated name "' + result + '" exceeds ' + limit + ' character limit for Oracle. Using base64 encoded sha1 of that name instead.');
    // generates the sha1 of the name and encode it with base64
    result = crypto.createHash('sha1').update(result).digest('base64').replace('=', '');
  }
  return result;
}

function wrapSqlWithCatch(sql, errorNumberToCatch) {
  return 'begin execute immediate \'' + sql.replace(/'/g, '\'\'') + '\'; exception when others then if sqlcode != ' + errorNumberToCatch + ' then raise; end if; end;';
}

var ReturningHelper = (function () {
  function ReturningHelper(columnName) {
    _classCallCheck(this, ReturningHelper);

    this.columnName = columnName;
  }

  ReturningHelper.prototype.toString = function toString() {
    return '[object ReturningHelper:' + this.columnName + ']';
  };

  return ReturningHelper;
})();

exports.ReturningHelper = ReturningHelper;