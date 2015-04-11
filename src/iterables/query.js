import {SELECT, DISTINCT} from '../sql/keywords'
import {LEFT_PAREN, RIGHT_PAREN} from '../sql/delimiters'
import {iterator, iterSymbol} from 'transduce'

import {
  ColumnIterable, FromIterable, WhereIterable, 
  JoinIterable, GroupingIterable, HavingIterable, 
  OrderingIterable, LimitIterable, OffsetIterable
} from './clauses'

export class QueryIterable {

  constructor(container) {
    this.container      = container
    this['@@knex/hook'] = 'statement:select'
  }

  [iterSymbol]() {
    let t = this.container
    return iterator([
      SELECT,
      t.has('distinct') ? DISTINCT : undefined,
      new ColumnIterable(t.get('columns')),
      new FromIterable(t.get('from') || this.get('table')),
      new WhereIterable(t.get('wheres')),
      new JoinIterable(t.get('joins')),
      new GroupingIterable(t.get('groupings')),
      new HavingIterable(t.get('havings')),
      new OrderingIterable(t.get('orderBy')),
      new LimitIterable(t.last('limit')),
      new OffsetIterable(t.last('offset'))
    ])
  }

}

export class SubQueryIterable extends QueryIterable {

  [iterSymbol]() {
    return iterator([LEFT_PAREN, super[iterSymbol](), RIGHT_PAREN])
  }

}
