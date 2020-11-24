/**
 * Await events library like EventEmitter
 * @author imcuttle
 */

const isPromise = require('is-promise')
const TYPE_KEY_NAME =
  typeof Symbol === 'function' ? Symbol.for('--[[await-event-emitter]]--') : '--[[await-event-emitter]]--'

function assertType(type) {
  if (typeof type !== 'string' && typeof type !== 'symbol') {
    throw new TypeError('type is not type of string or symbol!')
  }
}

type SymbolKey = string | any

function assertFn(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('fn is not type of Function!')
  }
}

function alwaysListener(fn) {
  return {
    [TYPE_KEY_NAME]: 'always',
    fn
  }
}

function onceListener(fn) {
  return {
    [TYPE_KEY_NAME]: 'once',
    fn
  }
}

class AwaitEventEmitter {
  _events: Record<any | SymbolKey, Array<{ fn: Function }>> = {}

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
    return (this._events[type] || []).map((x) => x.fn)
  }

  once(type: SymbolKey, fn: Function) {
    assertType(type)
    assertFn(fn)
    this._events[type] = this._events[type] || []
    this._events[type].push(onceListener(fn))
    return this
  }

  removeAllListeners() {
    this._events = {}
  }

  off(type: SymbolKey, nullOrFn?: Function) {
    return this.removeListener(type, nullOrFn)
  }
  removeListener(type: SymbolKey, nullOrFn?: Function) {
    assertType(type)

    const listeners = this.listeners(type)
    if (typeof nullOrFn === 'function') {
      let index = -1
      let found = false

      while ((index = listeners.indexOf(nullOrFn)) >= 0) {
        listeners.splice(index, 1)
        this._events[type].splice(index, 1)
        found = true
      }
      return found
    } else {
      return delete this._events[type]
    }
  }

  async emit(type: SymbolKey, ...args: unknown[]) {
    assertType(type)
    const listeners = this.listeners(type)

    const onceListeners = []
    if (listeners && listeners.length) {
      for (let i = 0; i < listeners.length; i++) {
        const event = listeners[i]
        const rlt = event.apply(this, args)
        if (isPromise(rlt)) {
          await rlt
        }
        if (this._events[type] && this._events[type][i] && this._events[type][i][TYPE_KEY_NAME] === 'once') {
          onceListeners.push(event)
        }
      }
      onceListeners.forEach((event) => this.removeListener(type, event))

      return true
    }
    return false
  }

  emitSync(type: SymbolKey, ...args: unknown[]) {
    assertType(type)
    const listeners = this.listeners(type)
    const onceListeners = []
    if (listeners && listeners.length) {
      for (let i = 0; i < listeners.length; i++) {
        const event = listeners[i]
        event.apply(this, args)

        if (this._events[type] && this._events[type][i] && this._events[type][i][TYPE_KEY_NAME] === 'once') {
          onceListeners.push(event)
        }
      }
      onceListeners.forEach((event) => this.removeListener(type, event))

      return true
    }
    return false
  }
}

export default AwaitEventEmitter
