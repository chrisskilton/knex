"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

exports.__esModule = true;

var ReturningIterable = (function () {
  function ReturningIterable() {
    _classCallCheck(this, ReturningIterable);
  }

  ReturningIterable.prototype[iterSymbol] = function () {
    return iterable([RETURNING, this.value]);
  };

  return ReturningIterable;
})();

exports.ReturningIterable = ReturningIterable;