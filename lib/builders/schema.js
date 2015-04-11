'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _AbstractBuilder2 = require('./abstract');

var SchemaBuilder = (function (_AbstractBuilder) {
  function SchemaBuilder(engine) {
    _classCallCheck(this, SchemaBuilder);

    _AbstractBuilder.call(this, engine);
    this._sequence = [];
  }

  _inherits(SchemaBuilder, _AbstractBuilder);

  SchemaBuilder.prototype.toString = function toString() {};

  SchemaBuilder.prototype.createTable = (function (_createTable) {
    function createTable(_x, _x2) {
      return _createTable.apply(this, arguments);
    }

    createTable.toString = function () {
      return _createTable.toString();
    };

    return createTable;
  })(function (tableName, fn) {
    createTable(tableName, fn);
    return this;
  });

  SchemaBuilder.prototype.createTableIfNotExists = function createTableIfNotExists(tableName, fn) {
    return sequence(this, ifNotExists(createTable(tableName), new CreateTableBuilder(fn)));
  };

  SchemaBuilder.prototype.createSchema = (function (_createSchema) {
    function createSchema(_x3, _x4) {
      return _createSchema.apply(this, arguments);
    }

    createSchema.toString = function () {
      return _createSchema.toString();
    };

    return createSchema;
  })(function (schemaName, fn) {
    return sequence(this, createSchema(schemaName), fn);
  });

  SchemaBuilder.prototype.createSchemaIfNotExists = function createSchemaIfNotExists(schemaName, fn) {
    return sequence(this, ifNotExists(createSchema(schemaName)), fn);
  };

  SchemaBuilder.prototype.createExtension = (function (_createExtension) {
    function createExtension(_x5, _x6) {
      return _createExtension.apply(this, arguments);
    }

    createExtension.toString = function () {
      return _createExtension.toString();
    };

    return createExtension;
  })(function (extensionName, fn) {
    return sequence(this, createExtension(extensionName), fn);
  });

  SchemaBuilder.prototype.createExtensionIfNotExists = function createExtensionIfNotExists(extensionName, fn) {
    return sequence(this, ifNotExists(createExtension(extensionName), fn));
  };

  SchemaBuilder.prototype.dropExtension = (function (_dropExtension) {
    function dropExtension(_x7) {
      return _dropExtension.apply(this, arguments);
    }

    dropExtension.toString = function () {
      return _dropExtension.toString();
    };

    return dropExtension;
  })(function (schemaName) {
    return sequence(this, dropExtension(schemaName));
  });

  SchemaBuilder.prototype.dropExtensionIfExists = function dropExtensionIfExists(extensionName) {
    return sequence(this, ifExists(dropExtension(extensionName)));
  };

  SchemaBuilder.prototype.dropSchema = (function (_dropSchema) {
    function dropSchema(_x8) {
      return _dropSchema.apply(this, arguments);
    }

    dropSchema.toString = function () {
      return _dropSchema.toString();
    };

    return dropSchema;
  })(function (schemaName) {
    return sequence(this, dropSchema(schemaName));
  });

  SchemaBuilder.prototype.dropSchemaIfExists = function dropSchemaIfExists(schemaName) {
    return sequence(this, ifExists(dropSchema(schemaName)));
  };

  SchemaBuilder.prototype.table = function table() {
    deprecate('builder.table', 'builder.alterTable');
    return this.alterTable();
  };

  SchemaBuilder.prototype.alterTable = function alterTable() {
    return sequence(this, ifExists(dropSchema(schemaName), new AlterTableBuilder()));
  };

  SchemaBuilder.prototype.dropTable = function dropTable(tableName) {
    return sequence(this, dropSchema(tableName));
  };

  SchemaBuilder.prototype.dropTableIfExists = function dropTableIfExists(tableName) {
    return sequence(this, ifExists(dropSchema(tableName)));
  };

  SchemaBuilder.prototype.raw = (function (_raw) {
    function raw() {
      return _raw.apply(this, arguments);
    }

    raw.toString = function () {
      return _raw.toString();
    };

    return raw;
  })(function () {
    return raw();
  });

  SchemaBuilder.prototype.hasTable = (function (_hasTable) {
    function hasTable() {
      return _hasTable.apply(this, arguments);
    }

    hasTable.toString = function () {
      return _hasTable.toString();
    };

    return hasTable;
  })(function () {
    return sequence(this, hasTable(schemaName));
  });

  SchemaBuilder.prototype.hasColumn = function hasColumn(columnName) {};

  SchemaBuilder.prototype.debug = function debug() {};

  return SchemaBuilder;
})(_AbstractBuilder2.AbstractBuilder);

function sequence(builder, stmt) {}