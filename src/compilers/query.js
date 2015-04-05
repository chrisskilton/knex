import {SELECT} from '../sql/keywords'

import {ColumnCompiler, FromCompiler, WhereCompiler, 
  JoinCompiler, GroupingCompiler, HavingCompiler, 
  OrderingCompiler, LimitCompiler, OffsetCompiler} from './clauses'

export class QueryCompiler {

  constructor(container) {
    this.container = container
  }

  compile() {
    let t = this.container
    return [
      SELECT,
      new ColumnCompiler(t.get('columns')),
      new FromCompiler(t.get('from') || this.get('table')),
      new WhereCompiler(t.get('wheres')),
      new JoinCompiler(t.get('joins')),
      new GroupingCompiler(t.get('groupings')),
      new HavingCompiler(t.get('havings')),
      new OrderingCompiler(t.get('orderBy')),
      new LimitCompiler(t.last('limit')),
      new OffsetCompiler(t.last('offset'))
    ]
  }

}

export class SubQueryCompiler extends QueryCompiler {

  

}
