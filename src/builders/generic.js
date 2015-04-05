// Builder
// -------
import forEach            from 'lodash/collection/forEach'
import {EventEmitter}     from 'events'
import {AbstractBuilder}  from './abstract'
import {mixin}            from '../helpers'

import {ISelect, IWhere, IHaving, IDelete, IUpdate, 
  ITruncate, IColumninfo, IRunnable} from '../interfaces'

export class GenericBuilder extends AbstractBuilder {

  fromJS(obj) {
    const keys = Object.keys(obj)
    forEach(keys, (key) => {
      let val = obj[key]
      isArray(val) ? this[key].apply(this, val) : this[key](val)
    })
    return this
  }

}

mixin(GenericBuilder, ISelect)
mixin(GenericBuilder, IWhere)
mixin(GenericBuilder, IHaving)
mixin(GenericBuilder, IDelete)
mixin(GenericBuilder, IUpdate)
mixin(GenericBuilder, ITruncate)
mixin(GenericBuilder, IColumninfo)
mixin(GenericBuilder, IRunnable)
