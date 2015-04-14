
export class HookContainer {

  constructor() {
    this.hooks = Object.create(null)
  }

  addHook(name, fn) {
    if (!this.has(name)) {
      this.hooks[name] = []
    }
    this.hooks[name].unshift(fn)
    return this
  }

  removeHook(name) {
    delete this.hooks[name]
    return this
  }

  has(name) {
    return !!this.hooks[name]
  }

  get(name) {
    if (this.has(name)) {
      return this.hooks[name][0]  
    }
  }

  rest(name) {
    if (this.has(name)) {
      return this.hooks[name].slice(1)
    }
  }

}
