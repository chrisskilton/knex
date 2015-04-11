'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var ReturningCompiler = (function () {
  function ReturningCompiler() {
    _classCallCheck(this, ReturningCompiler);

    this.type = 'clause:returning';
  }

  ReturningCompiler.prototype.compile = function compile() {
    return [RETURNING];
  };

  return ReturningCompiler;
})();

exports.ReturningCompiler = ReturningCompiler;