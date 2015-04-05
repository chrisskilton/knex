import {AbstractBuilder} from './abstract'

export {GenericBuilder} from './generic'

import {GroupedWhereCompiler, GroupedHavingCompiler, 
  JoinCompiler, GroupedJoinCompiler, SubQueryCompiler} from '../compilers'

import {selectInterface, whereInterface, 
  havingInterface, joinInterface} from '../interfaces'

import {mixin} from '../helpers'

export class SubQueryBuilder extends AbstractBuilder {
  compile() {
    return new SubQueryCompiler(this)
  }
}
mixin(SubQueryBuilder, selectInterface)
mixin(SubQueryBuilder, whereInterface)
mixin(SubQueryBuilder, havingInterface)

export class GroupedWhereBuilder extends AbstractBuilder {
  compile() {
    return new GroupedWhereCompiler(this)
  }
}
mixin(GroupedWhereBuilder, whereInterface)

export class GroupedHavingBuilder extends AbstractBuilder {
  compile() {
    return new GroupedHavingCompiler(this)
  }
}
mixin(GroupedHavingBuilder, havingInterface)

export class JoinBuilder extends AbstractBuilder {
  compile() {
    return new JoinCompiler(this)
  }
}
mixin(JoinBuilder, joinInterface)

export class GroupedJoinBuilder extends JoinBuilder {
  compile() {
    return new GroupedJoinCompiler(this)
  }
}
mixin(GroupedJoinBuilder, joinInterface)
