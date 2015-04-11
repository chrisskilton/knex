'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;
// Knex.js  0.9.0
// --------------------

// (c) 2013-2015 Tim Griesser
// Knex may be freely distributed under the MIT license.
// For details and documentation:
// http://knexjs.org

var _EventEmitter = require('events');

var _assign = require('lodash/object/assign');

var _assign2 = _interopRequireWildcard(_assign);

var _BaseBuilder2 = require('./builders/query');

var _RawBuilder2 = require('./builders/raw');

var _DialectEngines = require('./dialects');

var _DialectEngines2 = _interopRequireWildcard(_DialectEngines);

// import SchemaBuilder from './schema/builder'

var _isEngine$warn = require('./util');

function Knex(_x) {
  var _again = true;

  _function: while (_again) {
    _again = false;
    var engineOrConf = _x;

    if (!_isEngine$warn.isEngine(engineOrConf)) {
      _x = makeEngine(engineOrConf);
      _again = true;
      continue _function;
    }
    return makeKnex(engineOrConf);
  }
}

_assign2['default'](Knex, Object.defineProperties({

  // new Builder([engine]).select('*').from('accounts')
  Builder: _BaseBuilder2.BaseBuilder,

  // new SchemaBuidler([engine]).createTable(tableName, () => {})
  // SchemaBuidler,

  raw: function raw() {
    var _sql;

    return (_sql = sql).raw.apply(_sql, arguments);
  }

}, {
  VERSION: {
    get: function () {
      return '0.9.0';
    },
    configurable: true,
    enumerable: true
  }
}));

function makeEngine(config) {
  var dialect = config.dialect;
  if (!dialect && config.client) {
    _isEngine$warn.warn('client has now been renamed "dialect" in the knex config options');
    dialect = config.client;
  }
  var dialectStr = dialectAlias[dialect] || dialect;
  if (!_DialectEngines2['default'].hasOwnProperty(dialectStr)) {
    throw new Error('' + dialectStr + ' is not a valid Knex engine, did you misspell it?');
  }
  var Engine = _DialectEngines2['default'][dialectStr];
  return new Engine(config);
}

var dialectAlias = {
  mariadb: 'maria',
  mariasql: 'maria',
  pg: 'postgresql',
  postgres: 'postgresql',
  sqlite: 'sqlite3'
};

function makeKnex(engine) {
  var KnexBuilder = (function (_BaseBuilder) {
    function KnexBuilder() {
      _classCallCheck(this, KnexBuilder);

      if (_BaseBuilder != null) {
        _BaseBuilder.apply(this, arguments);
      }
    }

    _inherits(KnexBuilder, _BaseBuilder);

    return KnexBuilder;
  })(_BaseBuilder2.BaseBuilder);

  var KnexRaw = (function (_RawBuilder) {
    function KnexRaw() {
      _classCallCheck(this, KnexRaw);

      if (_RawBuilder != null) {
        _RawBuilder.apply(this, arguments);
      }
    }

    _inherits(KnexRaw, _RawBuilder);

    return KnexRaw;
  })(_RawBuilder2.RawBuilder);

  function knex(tableName) {
    var builder = new KnexBuilder(engine);
    if (!tableName) {
      _isEngine$warn.warn('invoking knex without a table is deprecated');
      return builder;
    }
    return builder.table(tableName);
  }

  var emitter = new _EventEmitter.EventEmitter();

  _assign2['default'](knex, emitter, {

    engine: engine,

    Builder: function Builder() {
      return new KnexBuilder(engine);
    },

    transaction: function transaction(container) {
      return new Transaction(engine).container(container);
    },

    raw: function raw(sql, bindings) {
      var _ref;

      return (_ref = new KnexRaw(engine)).set.apply(_ref, arguments);
    },

    destroy: function destroy(cb) {
      return engine.destroy(cb);
    },

    multi: function multi(statements, options) {
      return engine.multi(statements, options);
    }

  });

  Object.defineProperties(knex, {

    seed: {
      get: function get() {
        return new Seeder(engine);
      }
    },

    schema: {
      get: function get() {
        return new SchemaBuilder(engine);
      }
    },

    migrate: {
      get: function get() {
        return new Migrator(engine);
      }
    },

    client: {
      get: function get() {
        deprecate('knex.client', 'knex.engine');
        return engine;
      }
    },

    fn: {
      get: function get() {
        deprecate('knex.fn.*', 'Knex.sql.*');
        return Knex.sql;
      }
    },

    __knex__: {
      get: function get() {
        return Knex.VERSION;
      }
    },

    VERSION: {
      get: function get() {
        return Knex.VERSION;
      }
    }

  });

  Object.getOwnPropertyNames(_BaseBuilder2.BaseBuilder.prototype).forEach(function (method) {
    if (Object.prototype.hasOwnProperty(method)) return;
    knex[method] = function () {
      var builder = new KnexBuilder(engine);
      return builder[method].apply(builder, arguments);
    };
  });

  // Passthrough all "start" and "query" events to the knex object.
  engine.on('start', function (obj) {
    return knex.emit('start', obj);
  });
  engine.on('query', function (obj) {
    return knex.emit('query', obj);
  });

  return knex;
}

exports['default'] = Knex;
module.exports = exports['default'];