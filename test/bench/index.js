'use strict';

var Promise = require('bluebird');
var fs      = Promise.promisifyAll(require('fs'));
var shelljs = Promise.promisifyAll(require('shelljs'));
var rimraf  = Promise.promisify(require('rimraf'));

var tmpDir = __dirname + '/temp';

Promise.try(function() {
  return rimraf(tmpDir).catch(function(){}).finally(function() {
    return fs.mkdirAsync(tmpDir);
  });
}).then(function() {
  return shelljs.execAsync('cp -r ' + __dirname + '/../../.git ' + tmpDir);
}).then(function() {
  shelljs.cd(tmpDir);
  shelljs.exec('git reset --hard');
  shelljs.exec('git checkout master');
  // shelljs.exec('npm install');
}).then(function() {
  var Benchmark  = require('benchmark');
  var Knex1      = require(tmpDir + '/knex.js');
  var Knex2      = require('../../lib/knex');
  var suite      = new Benchmark.Suite();
  global.knex1   = Knex1({client: 'mysql', connection: {}}).select('name').from('item').where('active', true).orWhere('id', 2).orWhere('id', function() {
    this.select('*').from('users').whereIn('id', [44, 22]);
  });
  global.knex2   = Knex2({dialect: 'mysql'}).select('name').from('item').where('active', true).orWhere('id', 2).orWhere('id', function() {
    this.select('*').from('users').whereIn('id', [44, 22]);
  });

  suite
    .add('0.7.5: simple where clauses', function() {
      var str = knex1.toSQL();
      if (!global.logged1) {
        console.log(str);
        global.logged1 = true;
      }
    })
    .add('0.9.0: simple where clauses', function() {
      var str = knex2.toSQL();
      if (!global.logged2) {
        console.log(str);
        global.logged2 = true;
      }
    })

    // add listeners
    .on('error', function() {
      console.log(arguments);
    })
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').pluck('name'));
      process.exit(0);
    })
    // run async
    .run({ 'async': true });
});
