import forEach                from 'lodash/collection/forEach'
import {iterSymbol, iterator} from 'transduce'
import {AbstractBuilder}      from './abstract'
import {mixin}                from '../helpers'
import {HookContainer}        from '../containers/hooks'

import {ISelect, IWhere, IHaving, IDelete, IUpdate, 
  ITruncate, IColumninfo, IJoin, IRunnable, IIterable} from '../interfaces'

import {SubQueryIterable}     from '../iterables/query'
import {GroupedWhereIterable} from '../iterables'

export class BaseBuilder extends AbstractBuilder {

  constructor(engine) {
    super(engine)
    this.hooks = new HookContainer()
    if (engine && typeof engine.initBuilder === 'function') {
      engine.initBuilder(this)
    }
  }

}
mixin(BaseBuilder, ISelect)
mixin(BaseBuilder, IWhere)
mixin(BaseBuilder, IHaving)
mixin(BaseBuilder, IDelete)
mixin(BaseBuilder, IUpdate)
mixin(BaseBuilder, ITruncate)
mixin(BaseBuilder, IColumninfo)
mixin(BaseBuilder, IRunnable)
mixin(BaseBuilder, IIterable)

export class SubQueryBuilder extends AbstractBuilder {
  [iterSymbol]() {
    return iterator(new SubQueryIterable(this.container))
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

