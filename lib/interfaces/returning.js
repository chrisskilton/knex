'use strict';

exports.__esModule = true;
var IReturning = {

  // Sets the returning value for the query.
  returning: function returning(val) {
    return this.__clause('returning', val);
  }

};
exports.IReturning = IReturning;