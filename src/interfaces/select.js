// All of the chainable methods specific to "select"

export const selectInterface = {

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
    return this.__clause('from', args)
  },

  // Sets the `tableName` on the query.
  // Alias to "from" for select and "into" for insert clauses
  // e.g. builder.insert({a: value}).into('tableName')
  table(tableName) {
    var [tbl, aliased] = extractAlias(tableName)
    tbl = table(tbl)
    if (aliased) tbl = aliasAs(tbl, aliased)
    return this.__clause('table', tbl)
  },

  // Adds a `distinct` clause to the query.
  distinct(...args) {
    return this.__clause('columns', distinct(args))
  },

  // JOIN(s)

  join() {
    return this.__clause('joins', innerJoin(...arguments))
  },

  innerJoin() {
    return this.__clause('joins', innerJoin(...arguments))
  },

  leftJoin() {
    return this.__clause('joins', leftJoin(...arguments))
  },

  leftOuterJoin() {
    return this.__clause('joins', leftOuterJoin(...arguments))
  },

  rightJoin() {
    return this.__clause('joins', rightJoin(...arguments))
  },

  rightOuterJoin() {
    return this.__clause('joins', rightOuterJoin(...arguments))
  },

  outerJoin() {
    return this.__clause('joins', outerJoin(...arguments))
  },

  fullOuterJoin() {
    return this.__clause('joins', fullOuterJoin(...arguments))
  },

  crossJoin() {
    return this.__clause('joins', crossJoin(...arguments))
  },

  joinRaw() {
    return this.__clause('joins', joinRaw(...arguments))
  },

  // GROUP BY ${col}

  groupBy(item) {
    return this.__clause(groupBy(item))
  },

  groupByRaw(sql, bindings) {
    return this.__clause(groupBy(raw(sql, bindings)))
  },

  // ORDER BY ${col}

  orderBy(column, direction) {
    return this.__clause('orderings', [column, direction])
  },

  orderByRaw(sql, bindings) {
    return this.__clause('orderings', raw(sql, bindings))
  },

  // UNION [ALL] ${col}

  union(value, wrap) {
    if (wrap) return this.__clause(wrap(union(value)))
    return this.__clause(union(value))
  },

  unionAll(value, wrap) {
    if (wrap) return this.__clause(wrap(unionAll(value)))
    return this.__clause(unionAll(value))
  },

  // LIMIT ${n}

  limit(value) {
    return this.__clause(limit(value))
  },

  // OFFSET ${n}

  offset(value) {
    return this.__clause(offset(value))
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
    return this.addHook('onResult', (rows) => rows && rows[0])
  },

  pluck(column) {
    return this.addHook('onRow', (row) => pluck(row, column))
  }

}

// Aliases:

selectInterface.column  = selectInterface.select
selectInterface.columns = selectInterface.select

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

export default selectInterface