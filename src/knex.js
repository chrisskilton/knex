// Knex.js  0.9.0
// --------------------

// (c) 2013-2015 Tim Griesser
// Knex may be freely distributed under the MIT license.
// For details and documentation:
// http://knexjs.org

import {EventEmitter} from 'events'

import assign         from 'lodash/object/assign'
import {BaseBuilder}  from './builders/query'
import {RawBuilder}   from './builders/raw'

import DialectEngines from './dialects'

// import SchemaBuilder from './schema/builder'

import {isEngine, warn} from './util'

function Knex(engineOrConf) {
  if (!isEngine(engineOrConf)) {
    return Knex(makeEngine(engineOrConf))
  }
  return makeKnex(engineOrConf)
}

assign(Knex, {
  
  get VERSION() {
    return '0.9.0'
  },

  // new Builder([engine]).select('*').from('accounts')
  Builder: BaseBuilder,

  // new SchemaBuidler([engine]).createTable(tableName, () => {})
  // SchemaBuidler,

  raw() {
    return sql.raw(...arguments)
  }

})

function makeEngine(config) {
  var dialect = config.dialect
  if (!dialect && config.client) {
    warn('client has now been renamed "dialect" in the knex config options')
    dialect = config.client
  }
  var dialectStr = dialectAlias[dialect] || dialect
  if (!DialectEngines.hasOwnProperty(dialectStr)) {
    throw new Error(`${dialectStr} is not a valid Knex engine, did you misspell it?`)
  }
  let Engine = DialectEngines[dialectStr]
  return new Engine(config)
}

const dialectAlias = {
  'mariadb'       : 'maria',
  'mariasql'      : 'maria',
  'pg'            : 'postgresql',
  'postgres'      : 'postgresql',
  'sqlite'        : 'sqlite3'
}

function makeKnex(engine) {

  class KnexBuilder extends BaseBuilder {}
  class KnexRaw     extends RawBuilder {}
  
  function knex(tableName) {
    var builder = new KnexBuilder(engine)
    if (!tableName) {
      warn('invoking knex without a table is deprecated')
      return builder
    }
    return builder.table(tableName)
  }
  
  var emitter = new EventEmitter()

  assign(knex, emitter, {

    engine,

    Builder() {
      return new KnexBuilder(engine)
    },

    transaction(container) {
      return new Transaction(engine).container(container)
    },

    raw(sql, bindings) {
      return new KnexRaw(engine).set(...arguments)
    },

    destroy(cb) {
      return engine.destroy(cb)
    },

    multi(statements, options) {
      return engine.multi(statements, options)
    }

  })

  Object.defineProperties(knex, {

    seed: {
      get() { return new Seeder(engine) }
    },

    schema: {
      get() { return new SchemaBuilder(engine) }
    },

    migrate: {
      get() { return new Migrator(engine) }
    },

    client: {
      get() { 
        deprecate('knex.client', 'knex.engine')
        return engine
      }
    },

    fn: {
      get() { 
        deprecate('knex.fn.*', 'Knex.sql.*') 
        return Knex.sql
      }
    },

    __knex__: {
      get() { return Knex.VERSION }
    },

    VERSION: {
      get() { return Knex.VERSION }
    }

  })

  Object.getOwnPropertyNames(BaseBuilder.prototype).forEach((method) => {
    if (Object.prototype.hasOwnProperty(method)) return
    knex[method] = function() {
      var builder = new KnexBuilder(engine)
      return builder[method].apply(builder, arguments)
    }
  })

  // Passthrough all "start" and "query" events to the knex object.
  engine.on('start', obj => knex.emit('start', obj))
  engine.on('query', obj => knex.emit('query', obj))

  return knex
}

export default Knex