// All of the chainable methods specific to "select"
import {isBuilder, extractAlias, wrap} from '../helpers'
import {OrderByClause, UnionClause} from '../iterables'
import {UnionQueryBuilder} from '../builders/query'
import {isBoolean} from 'lodash/lang'
import last from 'lodash/array/last'
import {raw} from '../sql'

export const ISelect = {

  // Allow for the current query to be aliased
  as(ident) {
    return this.__clause(aliasAs(ident))
  },

  // Sets the values for a `select` query,
  // which is the same as specifying the columns.
  select(...args) {
    switch(args.length) {
      case 0: return this;
      case 1: return this.__clause('columns', args[0])
    }
    return this.__clause('columns', args)
  },

  from(...args) {
    return this.__clause('table', args)
  },

  // Sets the `tableName` on the query.
  // Alias to "from" for select and "into" for insert clauses
  // e.g. builder.insert({a: value}).into('tableName')
  table(...args) {
    return this.__clause('table', args)
  },

  // Adds a `distinct` clause to the query.
  distinct(...args) {
    return this.__clause('distinct', true).select(...args)
  },

  // JOIN(s)

  join() {
    return this.innerJoin(...arguments)
  },

  innerJoin(...args) {
    return this.__clause('joins', innerJoin(args))
  },

  leftJoin(...args) {
    return this.__clause('joins', leftJoin(args))
  },

  leftOuterJoin(...args) {
    return this.__clause('joins', leftOuterJoin(args))
  },

  rightJoin(...args) {
    return this.__clause('joins', rightJoin(args))
  },

  rightOuterJoin(...args) {
    return this.__clause('joins', rightOuterJoin(args))
  },

  outerJoin(...args) {
    return this.__clause('joins', outerJoin(args))
  },

  fullOuterJoin(...args) {
    return this.__clause('joins', fullOuterJoin(args))
  },

  crossJoin(...args) {
    return this.__clause('joins', crossJoin(args))
  },

  joinRaw(...args) {
    return this.__clause('joins', joinRaw(args))
  },

  // GROUP BY ${col}

  groupBy(...args) {
    return this.__clause('groupings', args)
  },

  groupByRaw() {
    return this.__clause('groupings', raw(...arguments))
  },

  // ORDER BY ${col}

  orderBy(column, direction) {
    if (!Array.isArray(column)) return this.orderBy([column], direction)
    return this.__clause('orderings', new OrderByClause(column, direction))
  },

  orderByRaw() {
    return this.__clause('orderings', raw(...arguments))
  },

  // UNION [ALL] ${col}

  union(...args) {
    return this.__clause('unions', unionDispatch(args))
  },

  unionAll(...args) {
    return this.__clause('unions', unionDispatch(args, true))
  },

  // LIMIT ${n}

  limit(value) {
    return this.__clause('limit', value)
  },

  // OFFSET ${n}

  offset(value) {
    return this.__clause('offset', value)
  },

  // aggregates:
  
  count(column) {
    return aggregate(this, 'COUNT', column)
  },

  min(column) {
    return aggregate(this, 'MIN', column)
  },

  max(column) {
    return aggregate(this, 'MAX', column)
  },

  sum(column) {
    return aggregate(this, 'SUM', column)
  },

  avg(column) {
    return aggregate(this, 'AVG', column)
  },

  // LOCKS: FOR UPDATE / FOR SHARE

  forUpdate() {
    return this.__clause(lock('update'))
  },

  forShare() {
    return this.__clause(lock('share'))
  },

  // Sugar Helpers: first object / pluck key

  first() {
    // onBeforeBuild -> order by, limit ??
    return this.limit(1).addHook('onResult', (rows) => rows && rows[0])
  },

  pluck(column) {
    return this.addHook('onRow', (row) => pluck(row, column))
  }

}

// Aliases:

ISelect.column  = ISelect.select
ISelect.columns = ISelect.select

function aggregate(builder, fnName, column) {
  var [ident, aliased] = extractAlias(column)
  var agg = fn(fnName, ident)
  if (aliased) agg = alias(agg, aliased)
  return agg
}

function int(val) {
  val = parseInt(val, 10)
  if (isNaN(val)) return 0
  return val
}

export function join(joinType, args) {
  switch(args.length) {
    case 1: return joinArity1(joinType, args[0])
    case 2: return joinArity2(joinType, args[0], args[1])
    case 3: return joinArity3(joinType, args[0], args[1], args[2])
  }
  return this
}

export function innerJoin(args) {
  return join(INNER, args)
}

export function leftJoin(args) {
  return join(LEFT, args)
}

export function leftOuterJoin(args) {
  return join(LEFT_OUTER, args)
}

export function rightJoin(args) {
  return join(RIGHT, args)
}

export function rightOuterJoin(args) {
  return join(RIGHT_OUTER, args)
}

export function outerJoin(args) {
  return join(OUTER, args)
}

export function fullOuterJoin(args) {
  return join(FULL_OUTER, args)
}

export function crossJoin(args) {
  return join(CROSS, args)
}

export function joinRaw(sql, bindings) {
  return new RawExpression('joins', sql, bindings)
}

function unionDispatch(args, all = false) {
  if (Array.isArray(args[0])) {
    return unionDispatch([...args[0], args[1]], all)
  }
  var unions    = []
  var isWrapped = isBoolean(last(args)) ? last(args) : false
  for (let u of args) {
    if (typeof u === 'function' || isBuilder(u)) {
      unions.push(union(u, all, isWrapped))
    }
  }
  return unions
}

function union(obj, all, wrapped) {
  if (typeof obj === 'function') {
    var qb = new UnionQueryBuilder()
    obj.call(qb, qb)
    return new UnionClause(qb, wrapped, all)
  }
  else if (isBuilder(obj)) {
    var qb = new UnionQueryBuilder()
    qb.container = obj.container // TODO: Robustify this...
    return new UnionClause(qb, wrapped, all)
  }
}
