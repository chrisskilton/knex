import {iterator, lazySeq, drop, iterSymbol} from 'transduce'

const DONE = {done: true, value: undefined}

export class ClauseIterable {

  [iterSymbol]() {
    return new ClauseIterator(this.value)
  }

}

class ClauseIterator {
  
  constructor(value) {
    this.value    = value
    this.idx      = 0
    this.complete = !value || !value.length
  }

  next() {
    if (this.complete || this.idx >= this.value.length) return DONE
    return {done: false, value: this.value[this.idx++]}
  }

}

export class WhereHavingIterable {

  constructor(whereOrHaving, ClauseIterable) {
    this.keyword  = whereOrHaving
    this.Iterable = ClauseIterable
  }

  [iterSymbol]() {
    return new DropFirst(this)
  }
  
}

class DropFirst {

  constructor(compiler) {
    this.seen        = false
    this.idx         = 0
    this.clauses     = compiler.clauses
    this.keyword     = compiler.keyword
    this.Iterable    = compiler.Iterable
    this.stack       = []
  }

  next() {
    if (this.idx >= this.clauses.length) return DONE
    if (!this.seen) {
      this.seen = true
      return {done: false, value: [this.keyword, lazySeq(drop(1), new this.Iterable(this.clauses[this.idx++]))]}
    }
    return {done: false, value: new this.Iterable(this.clauses[this.idx++])}
  }

}
