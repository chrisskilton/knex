// Builder
// -------
import forEach            from 'lodash/collection/forEach'
import {EventEmitter}     from 'events'
import {AbstractBuilder}  from './abstract'
import {mixin}            from '../helpers'

import {selectInterface, whereInterface, 
  havingInterface, deleteInterface, updateInterface, 
  truncateInterface, columnInfoInterface, runnableInterface} from '../interfaces'

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

mixin(GenericBuilder, selectInterface)
mixin(GenericBuilder, whereInterface)
mixin(GenericBuilder, havingInterface)
mixin(GenericBuilder, deleteInterface)
mixin(GenericBuilder, updateInterface)
mixin(GenericBuilder, truncateInterface)
mixin(GenericBuilder, columnInfoInterface)
mixin(GenericBuilder, runnableInterface)
