"use strict";

exports.__esModule = true;
var IWith = {

  withClause: (function (_withClause) {
    function withClause(_x) {
      return _withClause.apply(this, arguments);
    }

    withClause.toString = function () {
      return _withClause.toString();
    };

    return withClause;
  })(function (clause) {
    return clause(this, withClause(clause));
  }),

  withRecursive: (function (_withRecursive) {
    function withRecursive() {
      return _withRecursive.apply(this, arguments);
    }

    withRecursive.toString = function () {
      return _withRecursive.toString();
    };

    return withRecursive;
  })(function () {
    return clause(this, withRecursive(clause));
  })

};
exports.IWith = IWith;