'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

exports.__esModule = true;
// Strong Oracle Engine
// -------

var _Engine_Oracle2 = require('../oracle/engine');

var _Engine_Oracle3 = _interopRequireWildcard(_Engine_Oracle2);

var Engine_StrongOracle = (function (_Engine_Oracle) {
  function Engine_StrongOracle(options) {
    _classCallCheck(this, Engine_StrongOracle);

    _Engine_Oracle.call(this, options);
  }

  _inherits(Engine_StrongOracle, _Engine_Oracle);

  _createClass(Engine_StrongOracle, [{
    key: 'driver',
    get: function () {
      return 'strong-oracle';
    }
  }]);

  return Engine_StrongOracle;
})(_Engine_Oracle3['default']);

exports['default'] = Engine_StrongOracle;
module.exports = exports['default'];