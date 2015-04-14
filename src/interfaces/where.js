import {isPlainObject, isArray, isBoolean, isString} from 'lodash/lang'
import {or, not, parameterize} from '../helpers'
import {wrap} from '../sql/wrap'
import {raw} from '../sql'
import {and} from '../sql/operators'
import {map, filter, interpose, into, compose, lazySeq, isIterable, iterator} from 'duce'
import {SubQueryBuilder, GroupedWhereBuilder} from '../builders/query'
import {AND, WHERE, IN, IS, NULL, COMMA, BETWEEN} from '../sql/keywords'
import {parameter} from '../sql'
import {WhereClause} from '../iterables'

export const IWhere = {

  // [AND | OR] WHERE [NOT]

  where(...args) {
    return this.__where(whereDispatch(args))
  },

  orWhere(...args) {
    return this.__where(or(whereDispatch(args)))
  },

  whereNot(...args) {
    return this.__where(not(whereDispatch(args)))
  },

  orWhereNot(...args) {
    return this.__where(or(not(whereDispatch(args))))
  },

  whereRaw() {
    return this.__where(raw(...arguments))
  },

  orWhereRaw() {
    return this.__where(or(raw(...arguments)))
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

function whereDispatch(args) {
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
    var w = new GroupedWhereBuilder()
    value.call(w, w)
    return new WhereClause(w)
  }
  if (isPlainObject(value)) {
    return into([], map(([key, val]) => whereArity3(key, '=', val)), value)
  }
  if (isBoolean(value)) {
    return new WhereClause(1, '=', value === true ? 1 : 0)
  }
  if (isString(value)) {
    throw new Error('A string value is not supported as a where clause')
  }
  // TODO: Continue to refine.
  return new WhereClause(value)
}

function whereArity2(column, value) {
  if (value === null) {
    return whereNull(column)
  }
  return whereArity3(column, '=', value)
}

function whereArity3(column, operator, value) {
  if (typeof value === 'function') {
    var qb = new SubQueryBuilder()
    value.call(qb, qb)
    return whereArity3(column, operator, qb)
  }
  return new WhereClause(column, operator, value)
}

function whereBetween(col, values) {
  if (!isArray(values) || values.length !== 2) {
    throw new TypeError('You must specify a two value array to the whereBetween clause')
  }
  return new WhereClause(col, BETWEEN, iterator([
    parameter(values[0]), AND, parameter(values[1])
  ]))
}

function whereExists(fn) {
  if (typeof fn === 'function') {

  } else if (isBuilder(fn)) {

  }
  return new WhereClause(undefined, EXISTS, fn)
}

var pipeline = compose(
  map((value) => parameter(value)),
  filter((value) => value !== undefined),
  interpose(COMMA)
)

function whereIn(col, value) {
  if (typeof value === 'function') {
    return whereArity3(col, IN, value)
  }
  return new WhereClause(col, IN, wrap(parameterize(value)))
}

function whereNull(col, value) {
  return new WhereClause(col, IS, NULL)
}

// multiWhereIn(statement) {
//   return '(' + _.map(statement.column, this.formatter.wrap, this.formatter) + ') ' +
//     this._not(statement, 'in ') + '((' +
//     _.map(statement.value, this.formatter.parameterize, this.formatter).join('),(') + '))';
// }
