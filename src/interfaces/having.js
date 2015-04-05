import {or, not, raw}  from '../helpers'

export var IHaving = {

  // [AND | OR] [NOT] HAVING expression

  having() {
    return this.__clause(having(...arguments))
  },

  notHaving() {
    return this.__clause(not(having(...arguments)))
  },

  andHaving() {
    console.log('andHaving is deprecated, you can just use an additional having statement.')
    return this.andHaving.apply(this, arguments)
  },  

  orHaving() {
    return this.__clause(or(having(...arguments)))
  },

  orNotHaving() {
    return this.__clause(or(not(having(...arguments))))
  },

  havingRaw(sql, bindings) {
    return this.__clause(having(raw(sql, bindings)))
  },
  
  orHavingRaw(sql, bindings) {
    return this.__clause(or(having(raw(sql, bindings))))
  }

}

export default IHaving


class Having {

  constructor(value) {
    this.type    = 'having'
    this.value   = value
    this.negated = false
    this.or      = false
    this.wrapped = false
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

