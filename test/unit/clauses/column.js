import {deepEqual}        from 'assert'
import {into, transducer, iterator} from 'transduce'
import {ColumnIterable}   from '../../../src/iterables/clauses/column'
import {QueryBuilder}     from '../../../src/builders/query'

describe('ColumnClause', () => {
  
  it('should return star with no columns', () => {

    deepEqual(['*'], into([], transducer((step, result, val) =>
      step(result, val['@@knex/value'])
    ), new ColumnIterable()))

  })

  it('should return the columns, delimited by commas', () => {
    deepEqual(['a', ',', 'b', ',', 'c'], into([], transducer((step, result, val) =>
      step(result, val['@@knex/value'])
    ), new ColumnIterable(['a', 'b', 'c'])))
  })

})