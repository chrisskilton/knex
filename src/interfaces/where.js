import {isPlainObject, isArray, isBoolean, isString} from 'lodash/lang'
import {SubQueryBuilder} from '../builders'
import {GroupedWhereBuilder} from '../builders'
import {or, not, raw} from '../helpers'
import {map, into} from 'transduce'

export var whereInterface = {

  // [AND | OR] WHERE [NOT]

  where() {
    return this.__where(whereDispatch(...arguments))
  },

  orWhere() {
    return this.__where(or(whereDispatch(...arguments)))
  },

  whereNot() {
    return this.__where(not(whereDispatch(...arguments)))
  },

  orWhereNot() {
    return this.__where(or(not(whereDispatch(...arguments))))
  },

  whereRaw(sql, bindings) {
    return this.__where(raw(sql, bindings))
  },

  orWhereRaw(sql, bindings) {
    return this.__where(or(raw(sql, bindings)))
  },

  // [AND | OR] WHERE [NOT] EXISTS (subquery)

  whereExists(callback) {
    return this.__where(whereExists(callback))
  },

  orWhereExists(callback) {
    return this.__where(or(whereExists(callback)))
  },

  whereNotExists(callback) {
    return this.__where(not(whereExists(callback)))
  },

  orWhereNotExists(callback) {
    return this.__where(or(not(whereExists(callback))))
  },

  // [AND | OR] WHERE [NOT] IN

  whereIn(column, value) {
    return this.__where(whereIn(column, value))
  },

  orWhereIn(column, value) {
    return this.__where(or(whereIn(column, value)))
  },

  whereNotIn(column, value) {
    return this.__where(not(whereIn(column, value)))
  },

  orWhereNotIn(column, value) {
    return this.__where(or(not(whereIn(column, value))))
  },

  // [AND | OR] WHERE ${col} IS [NOT] NULL

  whereNull(column) {
    return this.__where(whereNull(column))
  },

  orWhereNull(column) {
    return this.__where(or(whereNull(column)))
  },

  whereNotNull(column) {
    return this.__where(not(whereNull(column)))
  },

  orWhereNotNull(column) {
    return this.__where(or(not(whereNull(column))))
  },

  // [AND | OR] WHERE ${col} [NOT] BETWEEN ${a} AND ${b}

  whereBetween(column, values) {
    return this.__where(whereBetween(column, values))
  },

  whereNotBetween(column, values) {
    return this.__where(not(whereBetween(column, values)))
  },

  orWhereBetween(column, values) {
    return this.__where(or(whereBetween(column, values)))
  },

  orWhereNotBetween(column, values) {
    return this.__where(or(not(whereBetween(values))))
  },

  __where(val) {
    return this.__clause('wheres', val)
  },

  // Deprecated:

  andWhere() {
    console.log('andWhere is deprecated, you can just use an additional where statement.')
    return this.where(...arguments)
  },

  andWhereRaw() {
    console.log('andWhereRaw is deprecated, you can just use an additional whereRaw statement.')
    return this.whereRaw(...arguments)
  }

}

import {OR, AND, WHERE, IN, BETWEEN} from '../sql/keywords'
import {identifier as i} from '../sql/identifier'
import {parameter  as p} from '../sql/parameter'

class WhereClause {
  
  constructor(column, operator, value) {
    this.column     = column
    this.operator   = operator
    this.value      = value
    this.grouping   = 'wheres'
    this.__negated  = false
    this.__or       = false
  }

}

function whereDispatch(...args) {
  switch (args.length) {
    case 0: return;
    case 1: return whereArity1(args[0])
    case 2: return whereArity2(args[0], args[1])
    case 3: return whereArity3(args[0], args[1], args[2])
  }
}

// e.g. where(raw()), where('col = 2'), where({col: 2, id: 2}), where(fn)
function whereArity1(value) {
  if (typeof value === 'function') {
    var w   = new GroupedWhereBuilder()
    var out = value.call(w, w)
    var val = out && typeof out.compile === 'function' ? out : w
    return val
  }
  if (isPlainObject(value)) {
    return into([], map(([key, val]) => whereArity3(key, '=', val)), value)
  }
  if (isClause(value)) {
    return new WhereClause(value)
  }
  if (isFunction(value)) {
    return new WhereClause(wrap(builder(value)))
  }
  if (isBoolean(value)) {
    return new WhereClause(wrap(bool(value)))
  }
  if (isString(value)) {
    throw new Error('A string value is not supported as a where clause')
  }
}

function whereArity2(column, value) {
  if (value === null) {
    return new WhereClause(isNull(value), column)
  }
  return whereDispatch(column, '=', value)
}

function whereArity3(column, operator, value) {
  if (typeof value === 'function') {
    var qb  = new SubQueryBuilder()
    var out = value.call(qb, qb)
    if (typeof out.compile === 'function' && typeof out !== 'function') {
      return whereArity3(column, operator, out)
    }
    return whereArity3(column, operator, qb)
  }
  return new WhereClause(column, operator, value)
}

export function whereBetween(col, values) {
  if (!isArray(values) || values.length !== 2) {
    throw new TypeError('You must specify a two value array to the whereBetween clause')
  }
  return new WhereClause(col, BETWEEN, and(values[0], values[1]))
}

export function whereExists(fn) {
  if (typeof fn === 'function') {

  }
  if (fn && typeof fn.compile === 'function') {

  }
  return new WhereClause(exists(value), column)
}

export function whereIn(col, value) {
  if (typeof value === 'function') {
    value = subQuery(value)
  }
  if (isArray(value) && isArray(value[0])) {
    // TODO: Multi where in...
  }
  return where(col, IN, value)
}

export function whereNull(col, value) {
  return where(col, IS, NULL)
}

// multiWhereIn(statement) {
//   return '(' + _.map(statement.column, this.formatter.wrap, this.formatter) + ') ' +
//     this._not(statement, 'in ') + '((' +
//     _.map(statement.value, this.formatter.parameterize, this.formatter).join('),(') + '))';
// }
