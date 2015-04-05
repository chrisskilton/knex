import {AbstractBuilder} from './abstract'

export {GenericBuilder} from './generic'

import {GroupedWhereCompiler, GroupedHavingCompiler, 
  JoinCompiler, GroupedJoinCompiler, SubQueryCompiler} from '../compilers'

import {ISelect, IWhere, IHaving, IJoin} from '../interfaces'

import {mixin} from '../helpers'

export class SubQueryBuilder extends AbstractBuilder {
  compile() {
    return new SubQueryCompiler(this)
  }
}
mixin(SubQueryBuilder, ISelect)
mixin(SubQueryBuilder, IWhere)
mixin(SubQueryBuilder, IHaving)

export class GroupedWhereBuilder extends AbstractBuilder {
  compile() {
    return new GroupedWhereCompiler(this)
  }
}
mixin(GroupedWhereBuilder, IWhere)

export class GroupedHavingBuilder extends AbstractBuilder {
  compile() {
    return new GroupedHavingCompiler(this)
  }
}
mixin(GroupedHavingBuilder, IHaving)

export class JoinBuilder extends AbstractBuilder {
  compile() {
    return new JoinCompiler(this)
  }
}
mixin(JoinBuilder, IJoin)

export class GroupedJoinBuilder extends JoinBuilder {
  compile() {
    return new GroupedJoinCompiler(this)
  }
}
mixin(GroupedJoinBuilder, IJoin)
