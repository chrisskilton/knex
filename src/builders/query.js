import forEach                from 'lodash/collection/forEach'
import {iterSymbol, iterator} from 'transduce'

import {AbstractBuilder}      from './abstract'
import {mixin}                from '../helpers'

import {ISelect}              from '../interfaces/select'
import {IWhere}               from '../interfaces/where'
import {IHaving}              from '../interfaces/having'
import {IDelete}              from '../interfaces/delete'
import {IUpdate}              from '../interfaces/update'
import {ITruncate}            from '../interfaces/truncate'
import {IColumninfo}          from '../interfaces/columninfo'
import {IJoin}                from '../interfaces/join'
import {IRunnable}            from '../interfaces/runnable'
import {IIterable}            from '../interfaces/iterable'

import {SubQueryIterable}     from '../iterables/query'
import {GroupedWhereIterable} from '../iterables'

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
  [iterSymbol]() {
    return iterator(new SubQueryIterable(this))
  }
}
mixin(SubQueryBuilder, ISelect)
mixin(SubQueryBuilder, IWhere)
mixin(SubQueryBuilder, IHaving)

export class GroupedWhereBuilder extends AbstractBuilder {
  [iterSymbol]() {
    return iterator(new GroupedWhereIterable(this.container.get('wheres')))
  }
}
mixin(GroupedWhereBuilder, IWhere)

export class GroupedHavingBuilder extends AbstractBuilder {
  [iterSymbol]() {
    return iterator(new GroupedHavingIterable(this))
  }
}
mixin(GroupedHavingBuilder, IHaving)

export class JoinBuilder extends AbstractBuilder {
  [iterSymbol]() {
    return iterator(new JoinIterable(this))
  }
}
mixin(JoinBuilder, IJoin)

export class GroupedJoinBuilder extends JoinBuilder {
  [iterSymbol]() {
    return iterator(new GroupedJoinIterable(this))
  }
}

