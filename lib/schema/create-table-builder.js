'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _TableBuilder2 = require('./table-builder');

var _TableBuilder3 = _interopRequireWildcard(_TableBuilder2);

var CreateTableBuilder = (function (_TableBuilder) {
  function CreateTableBuilder() {
    _classCallCheck(this, CreateTableBuilder);

    if (_TableBuilder != null) {
      _TableBuilder.apply(this, arguments);
    }
  }

  _inherits(CreateTableBuilder, _TableBuilder);

  return CreateTableBuilder;
})(_TableBuilder3['default']);