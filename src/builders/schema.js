import {AbstractBuilder} from './abstract'

class SchemaBuilder extends AbstractBuilder {
  
  constructor(engine) {
    super(engine)
    this._sequence = []
  }

  toString() {
    
  }

  createTable(tableName, fn) {
    createTable(tableName, fn)
    return this
  }

  createTableIfNotExists(tableName, fn) {
    return sequence(this, ifNotExists(createTable(tableName), new CreateTableBuilder(fn)))
  }

  createSchema(schemaName, fn) {
    return sequence(this, createSchema(schemaName), fn)
  }

  createSchemaIfNotExists(schemaName, fn) {
    return sequence(this, ifNotExists(createSchema(schemaName)), fn)
  }

  createExtension(extensionName, fn) {
    return sequence(this, createExtension(extensionName), fn)
  }

  createExtensionIfNotExists(extensionName, fn) {
    return sequence(this, ifNotExists(createExtension(extensionName), fn))
  }

  dropExtension(schemaName) {
    return sequence(this, dropExtension(schemaName))
  }
  
  dropExtensionIfExists(extensionName) {
    return sequence(this, ifExists(dropExtension(extensionName)))
  }

  dropSchema(schemaName) {
    return sequence(this, dropSchema(schemaName))
  }

  dropSchemaIfExists(schemaName) {
    return sequence(this, ifExists(dropSchema(schemaName)))
  }

  table() {
    deprecate('builder.table', 'builder.alterTable')
    return this.alterTable()
  }

  alterTable() {
    return sequence(this, ifExists(dropSchema(schemaName), new AlterTableBuilder()))
  }

  dropTable(tableName) {
    return sequence(this, dropSchema(tableName))
  }

  dropTableIfExists(tableName) {
    return sequence(this, ifExists(dropSchema(tableName)))
  }

  raw() {
    return raw()
  }

  hasTable() {
    return sequence(this, hasTable(schemaName))
  }

  hasColumn(columnName) {
    
  }

  debug() {
    
  }

}

function sequence(builder, stmt) {

}
