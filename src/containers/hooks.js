import first from 'lodash/array/first'
import rest  from 'lodash/array/rest'

export class HookContainer {

  constructor() {
    this.hooks = new Map()
  }

  addHook(name, fn) {
    if (!this.hooks.has(name)) {
      this.hooks.set(name, [])
    }
    this.hooks.get(name).unshift(fn)
    return this
  }

  has(name) {
    return this.hooks.has(name)
  }

  get(name) {
    if (this.hooks.has(name)) {
      return first(this.hooks.get(name))  
    }
  }

  rest(name) {
    if (this.hooks.has(name)) {
      return rest(this.hooks.get(name))
    }
  }

}
