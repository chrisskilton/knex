import {or, not, raw}  from '../helpers'

export var IHaving = {

  // [AND | OR] [NOT] HAVING expression

  having(...args) {
    return this.__clause(havingDispatch(args))
  },

  notHaving(...args) {
    return this.__clause(not(havingDispatch(args)))
  },

  orHaving(...args) {
    return this.__clause(or(havingDispatch(args)))
  },

  orNotHaving(...args) {
    return this.__clause(or(not(havingDispatch(args))))
  },

  havingRaw(sql, bindings) {
    return this.__clause(havingDispatch(raw(sql, bindings)))
  },
  
  orHavingRaw(sql, bindings) {
    return this.__clause(or(havingDispatch(raw(sql, bindings))))
  },

  andHaving() {
    console.log('andHaving is deprecated, you can just use an additional having statement.')
    return this.andHaving.apply(this, arguments)
  }  

}

class Having {

  constructor(value) {
    this.value          = value
    this.negated        = false
    this.or             = false
    this.wrapped        = false
    this['@@knex/hook'] = 'clause:having'
  }

}

function having(...args) {
  switch(args.length) {
    case 1: 
      if (isArray(args[0])) return having(...args[0])
      return havingArity1(args[0])
    case 2: return havingArity2(args[0], args[1])
    case 3: return havingArity3(args[0], args[1], args[2])
  }
}

function havingArity1() {
  return new Having()
}

function havingArity2() {
  return new Having()
}

function havingArity3() {
  return new Having() 
}

