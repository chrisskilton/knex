"use strict";

exports.__esModule = true;
var IReturning = {

  // Sets the returning value for the query.
  returning: (function (_returning) {
    function returning(_x) {
      return _returning.apply(this, arguments);
    }

    returning.toString = function () {
      return _returning.toString();
    };

    return returning;
  })(function (val) {
    return clause(this, returning(val));
  })

};
exports.IReturning = IReturning;