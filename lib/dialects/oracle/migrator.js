
// Create the migration table, if it doesn't already exist.
'use strict';

Migrator_Oracle.prototype._createMigrationTable = function (tableName) {
  return this.knex.schema.createTable(tableName, function (t) {
    t.timestamp('migration_time').primary().nullable(false);
    t.string('name');
    t.integer('batch');
  });
};

// Lists all migrations that have been completed for the current db, as an array.
Migrator_Oracle.prototype._listCompleted = Promise.method(function () {
  var tableName = this.config.tableName;
  return this._ensureTable(tableName).bind(this).then(function () {
    return this.knex(tableName).orderBy('migration_time').select('name');
  }).then(function (migrations) {
    return _.pluck(migrations, 'name');
  });
});

// Get the last batch of migrations, by name, ordered by insert migration_time
// in reverse order.
Migrator_Oracle.prototype._getLastBatch = function () {
  var tableName = this.config.tableName;
  return this.knex(tableName).where('batch', function () {
    this.select().max('batch').from(tableName);
  }).orderBy('migration_time', 'desc');
};