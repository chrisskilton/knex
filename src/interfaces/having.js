import {IS, NULL} from '../sql/keywords'
import {or, not, raw}  from '../helpers'
import {HavingClause} from '../iterables'
import {GroupedHavingBuilder} from '../builders/query'

export var IHaving = {

  // [AND | OR] [NOT] HAVING expression

  having(...args) {
    return this.__having(havingDispatch(args))
  },

  notHaving(...args) {
    return this.__having(not(havingDispatch(args)))
  },

  orHaving(...args) {
    return this.__having(or(havingDispatch(args)))
  },

  orNotHaving(...args) {
    return this.__having(or(not(havingDispatch(args))))
  },

  havingRaw() {
    return this.__having(raw(...arguments))
  },
  
  orHavingRaw() {
    return this.__having(or(raw(...arguments)))
  },

  andHaving() {
    console.log('andHaving is deprecated, you can just use an additional having statement.')
    return this.andHaving.apply(this, arguments)
  },

  __having(value) {
    return this.__clause('havings', value)
  }

}

function havingDispatch(args) {
  switch(args.length) {
    case 1: return havingArity1(args[0])
    case 2: return havingArity2(args[0], args[1])
    case 3: return havingArity3(args[0], args[1], args[2])
  }
}

function havingArity1(value) {
  if (typeof value === 'function') {
    var qb = new GroupedHavingBuilder()
    value.call(qb, qb)
    return new HavingClause(qb)
  }
  if (typeof value === 'string') {
    throw new Error('A string value is not supported as a having clause')
  }
  return new HavingClause(value)
}

function havingArity2(key, value) {
  if (value === null) {
    return new HavingClause(key, IS, NULL)
  }
  return new HavingClause(key, '=', value)
}

function havingArity3(key, operator, value) {
  return new HavingClause(key, operator, value)
}

