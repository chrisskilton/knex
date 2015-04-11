'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

exports.__esModule = true;

var _iterator$lazySeq$drop$iterSymbol = require('transduce');

var DONE = { done: true, value: undefined };

var ClauseIterable = (function () {
  function ClauseIterable() {
    _classCallCheck(this, ClauseIterable);
  }

  ClauseIterable.prototype[_iterator$lazySeq$drop$iterSymbol.iterSymbol] = function () {
    return new ClauseIterator(this.value);
  };

  return ClauseIterable;
})();

exports.ClauseIterable = ClauseIterable;

var ClauseIterator = (function () {
  function ClauseIterator(value) {
    _classCallCheck(this, ClauseIterator);

    this.value = value;
    this.idx = 0;
  }

  ClauseIterator.prototype.next = function next() {
    if (!this.value || this.idx >= this.value.length) {
      return DONE;
    }return { done: false, value: this.value[this.idx++] };
  };

  return ClauseIterator;
})();

var WhereHavingIterable = (function () {
  function WhereHavingIterable(whereOrHaving, Iterable) {
    _classCallCheck(this, WhereHavingIterable);

    this.keyword = whereOrHaving;
    this.Iterable = Iterable;
  }

  WhereHavingIterable.prototype[_iterator$lazySeq$drop$iterSymbol.iterSymbol] = function () {
    return new DropFirst(this);
  };

  return WhereHavingIterable;
})();

exports.WhereHavingIterable = WhereHavingIterable;

var DropFirst = (function () {
  function DropFirst(compiler) {
    _classCallCheck(this, DropFirst);

    this.seen = false;
    this.idx = 0;
    this.clauses = compiler.clauses;
    this.keyword = compiler.keyword;
    this.Iterable = compiler.Iterable;
    this.stack = [];
  }

  DropFirst.prototype.next = function next() {
    if (!this.clauses || this.idx >= this.clauses.length) {
      return DONE;
    }if (!this.seen) {
      this.seen = true;
      return { done: false, value: [this.keyword, _iterator$lazySeq$drop$iterSymbol.lazySeq(_iterator$lazySeq$drop$iterSymbol.drop(1), new this.Iterable(this.clauses[this.idx++]))] };
    }
    return { done: false, value: new this.Iterable(this.clauses[this.idx++]) };
  };

  return DropFirst;
})();