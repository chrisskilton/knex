"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var ColumnData = (function () {
  function ColumnData() {
    _classCallCheck(this, ColumnData);
  }

  ColumnData.prototype.toJSON = function toJSON() {
    return {
      "default": this["default"]
    };
  };

  _createClass(ColumnData, [{
    key: "default",
    get: function () {
      return this._default || null;
    }
  }]);

  return ColumnData;
})();

var Column = (function () {
  function Column(columnName) {
    _classCallCheck(this, Column);

    this.name = columnName;
    this.chain = new ColumnData();
  }

  Column.prototype["default"] = function _default(value) {
    this.chain["default"] = value;
    return this;
  };

  _createClass(Column, [{
    key: "nullable",
    get: function () {
      this.chain.nullable;
      return this;
    }
  }, {
    key: "notNullable",
    get: function () {
      this.chain.notNullable;
      return this;
    }
  }]);

  return Column;
})();

function column(columnName) {}