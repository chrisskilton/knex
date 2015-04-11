'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _GROUP_BY = require('../../sql/keywords');

var _iterable$iterSymbol$iterdone = require('transduce');

var GroupingIterable = (function () {
  function GroupingIterable(value) {
    _classCallCheck(this, GroupingIterable);

    this.groupings = value;
    this['@@knex/hook'] = 'clause:grouping';
  }

  GroupingIterable.prototype[_iterable$iterSymbol$iterdone.iterSymbol] = function () {
    if (!this.groupings) return _iterable$iterSymbol$iterdone.iterdone;
    return _iterable$iterSymbol$iterdone.iterable([_GROUP_BY.GROUP_BY, this.groupings]);
  };

  return GroupingIterable;
})();

exports.GroupingIterable = GroupingIterable;