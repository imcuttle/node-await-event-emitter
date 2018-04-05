/**
 * @file: AwaitEventEmitter
 * @author: Cuttle Cong
 * @date: 2017/11/1
 * @description:
 */
const isPromise= require('is-promise')
const TYPE_KEYNAME = typeof Symbol === 'function' ? Symbol('--[[await-event-emitter]]--') : '--[[await-event-emitter]]--'

function assertType(type) {
  if (typeof type !== 'string' && typeof type !== 'symbol') {
    throw new TypeError('type is not type of string or symbol!')
  }
}

function assertFn(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('fn is not type of Function!')
  }
}

function alwaysListener(fn) {
  return {
    [TYPE_KEYNAME]: 'always',
    fn
  }
}
function onceListener(fn) {
  return {
    [TYPE_KEYNAME]: 'once',
    fn
  }
}

function AwaitEventEmitter() {
  this._events = {}
}

function on(type, fn) {
  assertType(type)
  assertFn(fn)
  this._events[type] = this._events[type] || []
  this._events[type].push(alwaysListener(fn))
  return this
}

function prepend(type, fn) {
  assertType(type)
  assertFn(fn)
  this._events[type] = this._events[type] || []
  this._events[type].unshift(alwaysListener(fn))
  return this
}

function prependOnce(type, fn) {
  assertType(type)
  assertFn(fn)
  this._events[type] = this._events[type] || []
  this._events[type].unshift(onceListener(fn))
  return this
}

function listeners(type) {
  return (this._events[type] || []).map(x => x.fn)
}

function once(type, fn) {
  assertType(type)
  assertFn(fn)
  this._events[type] = this._events[type] || []
  this._events[type].push(onceListener(fn))
  return this
}

function removeListener(type, nullOrFn) {
  assertType(type)

  const listeners = this.listeners(type)
  if (typeof nullOrFn === 'function') {
    let index, found = false
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

async function emit(type, ...args) {
  assertType(type)
  const listeners = this.listeners(type)

  const onceListeners = []
  if (listeners && listeners.length) {
    for(let i = 0; i < listeners.length; i++) {
      const event = listeners[i]
      const rlt = event.apply(this, args)
      if (isPromise(rlt)) {
        await rlt
      }
      if (this._events[type][i][TYPE_KEYNAME] === 'once') {
        onceListeners.push(event)
      }
    }
    onceListeners.forEach(event =>
      this.removeListener(type, event)
    )

    return true
  }
  return false
}

function emitSync(type, ...args) {
  assertType(type)
  const listeners = this.listeners(type)
  const onceListeners = []
  if (listeners && listeners.length) {
    for(let i = 0; i < listeners.length; i++) {
      const event = listeners[i]
      event.apply(this, args)

      if (this._events[type][i][TYPE_KEYNAME] === 'once') {
        onceListeners.push(event)
      }
    }
    onceListeners.forEach(event =>
      this.removeListener(type, event)
    )

    return true
  }
  return false
}

AwaitEventEmitter.prototype.on = AwaitEventEmitter.prototype.addListener = on
AwaitEventEmitter.prototype.once = once
AwaitEventEmitter.prototype.prependListener = prepend
AwaitEventEmitter.prototype.prependOnceListener = prependOnce
AwaitEventEmitter.prototype.off = AwaitEventEmitter.prototype.removeListener = removeListener
AwaitEventEmitter.prototype.emit = emit
AwaitEventEmitter.prototype.emitSync = emitSync
AwaitEventEmitter.prototype.listeners = listeners

if (typeof module !== 'undefined') {
  module.exports = AwaitEventEmitter
}
