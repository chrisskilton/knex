
export const IJoin = {

  // Adds an "on" clause to the current join object.
  on(first, operator, second) {
    if (typeof first === 'function') {
      return new JoinBuilder()
    }
    switch (arguments.length) {
      case 1:  data = ['on', this._bool(), first]; break;
      case 2:  data = ['on', this._bool(), first, '=', operator]; break;
      default: data = ['on', this._bool(), first, operator, second];
    }
    this.clauses.push(data);
    return this;
  },

  // Adds a "using" clause to the current join.
  using() {
    return using(...arguments)
  },

  orUsing() {
    return or(usingDispatch(...arguments))
  },

  // Adds an "or on" clause to the current join object.
  orOn(first, operator, second) {
    return or(onDispatch(...arguments))
  },

  // Explicitly set the type of join, useful within a function when creating a grouped join.
  type(type) {
    this.joinType = type;
    return this;
  }

}

IJoin.andOn = IJoin.on

function onDispatch() {
  return new JoinExpression()
}

function usingDispatch() {

}

class JoinExpression {



}


import {JOIN, INNER, LEFT, LEFT_OUTER, RIGHT, 
  RIGHT_OUTER, OUTER, FULL_OUTER, CROSS} from '../sql/keywords'

class JoinClause {

  constructor(joinType, a) {
    this.joinType       = joinType
    this.column         = column
    this.value          = value
    this['@@knex/hook'] = 'join'
  }

  compile() {
    let {joinType, column, value} = this
    return [joinType, JOIN, column, value]
  }

}

class OnClause {

}

class UsingClause {

}

// var joins = this.grouped.join;
// if (!joins) return '';
// var sql = _.reduce(joins, function(acc, join) {
//   if (join.joinType === 'raw') {
//     acc.push(this.formatter.checkRaw(join.table));
//   } else {
//     acc.push(join.joinType + ' join ' + this.formatter.wrap(join.table));
//     _.each(join.clauses, function(clause, i) {
//       acc.push(i > 0 ? clause[1] : clause[0]);
//       acc.push(this.formatter.wrap(clause[2]));
//       if (clause[3]) acc.push(this.formatter.operator(clause[3]));
//       if (clause[4]) acc.push(this.formatter.wrap(clause[4]));
//     }, this);
//   }
//   return acc;
// }, [], this);
// return sql.length > 0 ? sql.join(' ') : '';
