/*global describe*/

'use strict';

global.sinon = require("sinon");

var chai = global.chai = require("chai");

chai.use(require("chai-as-promised"));
chai.use(require("sinon-chai"));
chai.should();

var Promise = global.testPromise = require('../lib/promise');
global.expect         = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion      = chai.Assertion;
global.assert         = chai.assert;
global.d = new Date();

Promise.longStackTraces();

var Knex = require('../knex');

var clients = {
  maria: {
    name: 'maria',
    engine: Knex({dialect: 'maria'}),
    alias: 'mysql'
  },
  mysql: {
    name: 'mysql',
    engine: Knex({dialect: 'mysql'}),
  },
  sqlite3: {
    name: 'sqlite3',
    engine: Knex({dialect: 'sqlite3'})
  },
  postgres: {
    name: 'postgres',
    engine: Knex({dialect: 'postgres'}),
  },
  oracle: {
    name: 'oracle',
    engine: Knex({dialect: 'oracle'}),
  }
};

describe('Unit tests', () => {
  
  Object.keys(clients).forEach((clientName) => {
    // require('./unit/schema/' + (clients[clientName].alias || clients[clientName].name))(clients[clientName].client);
    
    require('./unit/query/builder')(
      clients[clientName].engine.Builder,
      clients[clientName].name, 
      clients[clientName].alias
    )
  })

})

// Integration Tests
// describe('Integration Tests', function() {
//   require('./integration')(this);
// });
