'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _Transducer$protocols = require('transduce');

var _protocols$transducer = _Transducer$protocols.protocols.transducer;
var tStep = _protocols$transducer.step;
var tResult = _protocols$transducer.result;

var SqlContainer = (function (_Transducer) {
  function SqlContainer(xf) {
    _classCallCheck(this, SqlContainer);

    _Transducer.call(this, xf);
  }

  _inherits(SqlContainer, _Transducer);

  SqlContainer.prototype[tInit] = function () {
    return { sql: '', bindings: [] };
  };

  SqlContainer.prototype[tStep] = function (result, value) {};

  SqlContainer.prototype[tResult] = function () {};

  return SqlContainer;
})(_Transducer$protocols.Transducer);