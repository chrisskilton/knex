
import {QueryCompiler, SubQueryCompiler} from './query'

export {
  WhereCompiler, GroupedWhereCompiler, 
  HavingCompiler, GroupedHavingCompiler,
  JoinCompiler, GroupedJoinCompiler
} from './clauses'

export {QueryCompiler, SubQueryCompiler}

import LazyCompiler from './lazy'

export function compileFrom(builder) {
  return new LazyCompiler(targetCompiler(builder))
}

function targetCompiler(builder) {
  let {container} = builder
  switch (container.last('statementType')) {
    case 'select': return new QueryCompiler(container)
    case 'update': return new UpdateCompiler(container)
    case 'delete': return new DeleteCompiler(container)
    case 'insert': return new InsertCompiler(container)
  }
}
