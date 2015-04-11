'use strict';

var _ref;

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

exports.__esModule = true;

var _Engine_MariaSQL = require('./maria/engine');

var _Engine_MariaSQL2 = _interopRequireWildcard(_Engine_MariaSQL);

var _Engine_Oracle = _interopRequireWildcard(_Engine_MariaSQL);

var _Engine_MySQL = require('./mysql/engine');

var _Engine_MySQL2 = _interopRequireWildcard(_Engine_MySQL);

var _Engine_MySQL22 = require('./mysql2/engine');

var _Engine_MySQL23 = _interopRequireWildcard(_Engine_MySQL22);

var _Engine_SQLite3 = require('./sqlite3/engine');

var _Engine_SQLite32 = _interopRequireWildcard(_Engine_SQLite3);

var _Engine_WebSQL = require('./websql/engine');

var _Engine_WebSQL2 = _interopRequireWildcard(_Engine_WebSQL);

var _Engine_PostgreSQL = require('./postgresql/engine');

var _Engine_PostgreSQL2 = _interopRequireWildcard(_Engine_PostgreSQL);

var _Engine_StrongOracle = require('./strong-oracle/engine');

var _Engine_StrongOracle2 = _interopRequireWildcard(_Engine_StrongOracle);

exports['default'] = (_ref = {}, _ref.mysql = _Engine_MySQL2['default'], _ref.mysql2 = _Engine_MySQL23['default'], _ref.maria = _Engine_MariaSQL2['default'], _ref.sqlite3 = _Engine_SQLite32['default'], _ref.websql = _Engine_WebSQL2['default'], _ref.postgresql = _Engine_PostgreSQL2['default'], _ref.oracle = _Engine_Oracle['default'], _ref['strong-oracle'] = _Engine_MariaSQL2['default'], _ref);
module.exports = exports['default'];