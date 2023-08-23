/**
 * Await events library like EventEmitter
 * @author imcuttle
 */

const isPromise = require('is-promise')

function assertType(type: any) {
  if (typeof type !== 'string' && typeof type !== 'symbol') {
    throw new TypeError('type is not type of string or symbol!')
  }
}

type SymbolKey = string | number

interface Listener {
  type: string
  fn: Function
}

function assertFn(fn: Function) {
  if (typeof fn !== 'function') {
    throw new TypeError('fn is not type of Function!')
  }
}

function alwaysListener(fn: Function): Listener {
  return {
    type: 'always',
    fn
  }
}

function onceListener(fn: Function): Listener {
  return {
    type: 'once',
    fn
  }
}

class AwaitEventEmitter {
  _events: Record<SymbolKey, Array<Listener>> = {}

  addListener(type: SymbolKey, fn: Function) {
    return this.on(type, fn)
  }
  on(type: SymbolKey, fn: Function) {
    assertType(type)
    assertFn(fn)
    this._events[type] = this._events[type] || []
    this._events[type].push(alwaysListener(fn))
    return this
  }
  prependListener(type: SymbolKey, fn: Function) {
    return this.prepend(type, fn)
  }
  prepend(type: SymbolKey, fn: Function) {
    assertType(type)
    assertFn(fn)
    this._events[type] = this._events[type] || []
    this._events[type].unshift(alwaysListener(fn))
    return this
  }

  prependOnceListener(type: SymbolKey, fn: Function) {
    return this.prependOnce(type, fn)
  }
  prependOnce(type: SymbolKey, fn: Function) {
    assertType(type)
    assertFn(fn)
    this._events[type] = this._events[type] || []
    this._events[type].unshift(onceListener(fn))
    return this
  }
  listeners(type: SymbolKey) {
    return (this._events[type] || []).filter((val) => val).map((x) => x.fn)
  }

  once(type: SymbolKey, fn: Function) {
    assertType(type)
    assertFn(fn)
    this._events[type] = this._events[type] || []
    this._events[type].push(onceListener(fn))
    return this
  }

  removeAllListeners(type?: SymbolKey) {
    if (type && this._events[type]) this._events[type] = []

    if (type === undefined) {
      this._events = {}
    }
  }

  off(type: SymbolKey, nullOrFn?: Function) {
    return this.removeListener(type, nullOrFn)
  }
  removeListener(type: SymbolKey, nullOrFn?: Function) {
    assertType(type)

    if (typeof nullOrFn === 'function') {
      let found = false

      this._events[type].forEach((value, index) => {
        if (value.fn === nullOrFn) {
          found = true
          delete this._events[type][index]
        }
      })

      return found
    } else {
      return (this._events[type] = [])
    }
  }

  async emit(type: SymbolKey, ...args: unknown[]) {
    assertType(type)

    if (this._events[type] && this._events[type].length) {
      for (const listener of this._events[type]) {
        if (!this._events[type].includes(listener) || !listener) continue
        const event = listener.fn
        const rlt = event.apply(this, args)
        if (isPromise(rlt)) {
          await rlt
        }
        if (listener.type === 'once') {
          // splice won't work, as it will affect the current loop
          let index = this._events[type].indexOf(listener, 0)
          delete this._events[type][index]
        }
      }

      return true
    }
    return false
  }

  emitSync(type: SymbolKey, ...args: unknown[]) {
    assertType(type)
    if (this._events[type] && this._events[type].length) {
      for (const listener of this._events[type]) {
        const event = listener.fn;
        event.apply(this, args)

        if (listener.type === 'once') {
          // splice won't work, as it will affect the current loop
          let index = this._events[type].indexOf(listener, 0)
          delete this._events[type][index]
        }
      }

      return true
    }
    return false
  }
}

export default AwaitEventEmitter
