const compile = '@@knex/compile'

import {AbstractBuilder}  from './abstract'
import {ISelect}          from '../interfaces/select'
import {IWhere}           from '../interfaces/where'
import {IHaving}          from '../interfaces/having'
import {IDelete}          from '../interfaces/delete'
import {IUpdate}          from '../interfaces/update'
import {ITruncate}        from '../interfaces/truncate'
import {IColumninfo}      from '../interfaces/columninfo'
import {IJoin}            from '../interfaces/join'

import {IRunnable}        from '../interfaces/runnable'
import {IIterable}        from '../interfaces/iterable'

import {mixin}            from '../helpers'
import {SubQueryCompiler} from '../compilers/query'
import forEach            from 'lodash/collection/forEach'

export class QueryBuilder extends AbstractBuilder {

  fromJS(obj) {
    const keys = Object.keys(obj)
    forEach(keys, (key) => {
      let val = obj[key]
      isArray(val) ? this[key].apply(this, val) : this[key](val)
    })
    return this
  }

}

mixin(QueryBuilder, ISelect)
mixin(QueryBuilder, IWhere)
mixin(QueryBuilder, IHaving)
mixin(QueryBuilder, IDelete)
mixin(QueryBuilder, IUpdate)
mixin(QueryBuilder, ITruncate)
mixin(QueryBuilder, IColumninfo)
mixin(QueryBuilder, IRunnable)
mixin(QueryBuilder, IIterable)

export class SubQueryBuilder extends AbstractBuilder {
  [compile]() {
    return new SubQueryCompiler(this)
  }
}
mixin(SubQueryBuilder, ISelect)
mixin(SubQueryBuilder, IWhere)
mixin(SubQueryBuilder, IHaving)
mixin(SubQueryBuilder, IIterable)

export class GroupedWhereBuilder extends AbstractBuilder {
  [compile]() {
    return new GroupedWhereCompiler(this.container.get('wheres'))
  }
}
mixin(GroupedWhereBuilder, IWhere)
mixin(GroupedWhereBuilder, IIterable)

export class GroupedHavingBuilder extends AbstractBuilder {
  [compile]() {
    return new GroupedHavingCompiler(this)
  }
}
mixin(GroupedHavingBuilder, IHaving)
mixin(GroupedHavingBuilder, IIterable)

export class JoinBuilder extends AbstractBuilder {
  [compile]() {
    return new JoinCompiler(this)
  }
}
mixin(JoinBuilder, IJoin)
mixin(JoinBuilder, IIterable)

export class GroupedJoinBuilder extends JoinBuilder {
  [compile]() {
    return new GroupedJoinCompiler(this)
  }
}

