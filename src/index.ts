/**
 * Serial await events library like EventEmitter
 * Initially forked from AwaitEventsEmitter
 */

import isPromise from 'is-promise';

type SymbolKey = string | symbol;
type AnyFunction = (...args: any[]) => any;

interface Listener {
  type: string;
  fn: AnyFunction;
}

function assertType(type: any) {
  if (typeof type !== 'string' && typeof type !== 'symbol') {
    throw new TypeError('type is not string or number!');
  }
}

function assertFn(fn: AnyFunction) {
  if (typeof fn !== 'function') {
    throw new TypeError('fn is not type of Function!');
  }
}

function alwaysListener(fn: AnyFunction): Listener {
  return {
    type: 'always',
    fn,
  };
}

function onceListener(fn: AnyFunction): Listener {
  return {
    type: 'once',
    fn,
  };
}

export class SerialAwaitEventEmitter {
  _events: Record<SymbolKey, Array<Listener>> = {};
  protected _restartEmit = false;

  /**
   * Alias for `on`
   * @see on
   * @param eventName
   * @param listener
   */
  addListener(eventName: SymbolKey, listener: AnyFunction) {
    return this.on(eventName, listener);
  }

  /**
   * Adds the function to the end of listeners list
   * @param eventName
   * @param listener
   */
  on(eventName: SymbolKey, listener: AnyFunction) {
    assertType(eventName);
    assertFn(listener);
    this._events[eventName] = this._events[eventName] || [];
    this._events[eventName].push(alwaysListener(listener));
    return this;
  }

  /**
   * Adds a one-time listener function to the end of listeners list
   * @param eventName
   * @param listener
   */
  once(eventName: SymbolKey, listener: AnyFunction) {
    assertType(eventName);
    assertFn(listener);
    this._events[eventName] = this._events[eventName] || [];
    this._events[eventName].push(onceListener(listener));
    return this;
  }

  /**
   * Alias for `prepend`
   * @see prepend
   * @param eventName
   * @param listener
   */
  prependListener(eventName: SymbolKey, listener: AnyFunction) {
    return this.prepend(eventName, listener);
  }

  /**
   * Adds a listener function to the beginning of listeners list
   * Gets called every time emit is run
   * Will also be called when added by another listener while running emit
   * @param eventName
   * @param listener
   */
  prepend(eventName: SymbolKey, listener: AnyFunction) {
    assertType(eventName);
    assertFn(listener);
    this._events[eventName] = this._events[eventName] || [];
    // works with splice and unshift
    // this._events[type].splice(0, 0, alwaysListener(fn));
    this._events[eventName].unshift(alwaysListener(listener));
    this._restartEmit = true;
    return this;
  }

  /**
   * Alias for `prependOnce`
   * @see prependOnce
   * @param eventName
   * @param listener
   */
  prependOnceListener(eventName: SymbolKey, listener: AnyFunction) {
    return this.prependOnce(eventName, listener);
  }

  /**
   * Adds a one-time listener function to the beginning of listeners list
   * Gets removed from listeners list after being called once
   * Will also be called when added by another listener while running emit
   * @param eventName
   * @param listener
   */
  prependOnce(eventName: SymbolKey, listener: AnyFunction) {
    assertType(eventName);
    assertFn(listener);
    this._events[eventName] = this._events[eventName] || [];
    // works with splice and unshift
    // this._events[type].splice(0, 0, onceListener(fn));
    this._events[eventName].unshift(onceListener(listener));
    this._restartEmit = true;
    return this;
  }

  /**
   * Returns current list of listeners
   * @param eventName
   */
  listeners(eventName: SymbolKey) {
    return (this._events[eventName] || []).filter((val) => val).map((x) => x.fn);
  }

  /**
   * Removes all listeners, or those of the specified eventName
   * @param eventName
   */
  removeAllListeners(eventName?: SymbolKey) {
    if (eventName && this._events[eventName]) this._events[eventName] = [];

    if (eventName === undefined) {
      this._events = {};
    }
    return this;
  }

  /**
   * Removes the specified listener from the listener array for the event.
   * @param eventName
   * @param nullOrFn
   */
  off(eventName: SymbolKey, nullOrFn?: AnyFunction) {
    assertType(eventName);

    if (typeof nullOrFn === 'function') {
      this._events[eventName].forEach((value, index) => {
        if (value.fn === nullOrFn) {
          delete this._events[eventName][index];
        }
      });
    }

    return this;
  }

  /**
   * Alias for `off`
   * @see off
   * @param eventName
   * @param nullOrFn
   */
  removeListener(eventName: SymbolKey, nullOrFn?: AnyFunction) {
    return this.off(eventName, nullOrFn);
  }

  /**
   * Serially calls with `await` each of the listeners registered for the event, in the order they were
   * registered, passing the supplied arguments to each.
   *
   * Returns true if the event had listeners, false otherwise.
   *
   * Will execute prepended listeners added while running, re-starting the list from beginning, with once listeners
   * already executed removed.
   * @param eventName
   * @param args
   */
  async emit(eventName: SymbolKey, ...args: unknown[]) {
    assertType(eventName);

    if (this._events[eventName] && this._events[eventName].length) {
      loopEmitEvents: while (true) {
        this._restartEmit = false;
        for (const listener of this._events[eventName]) {
          if (!this._events[eventName].includes(listener) || !listener) continue;
          if (this._restartEmit) {
            this._restartEmit = false;
            // will restart the while
            // @see https://stackoverflow.com/a/8766950
            continue loopEmitEvents;
          }
          const event = listener.fn;
          const rlt = event.apply(this, args);
          if (isPromise(rlt)) {
            await rlt;
          }
          if (listener.type === 'once') {
            // splice won't work, as it will affect the current loop
            const index = this._events[eventName].indexOf(listener, 0);
            delete this._events[eventName][index];
          }
        }
        // after loop is finished, break the while
        // @see https://stackoverflow.com/a/8766950
        break;
      }

      return true;
    }
    return false;
  }

  /**
   * Synchronously calls each of the listeners registered for the event named eventName, in the order they were registered, passing the supplied arguments to each.
   *
   * Returns true if the event had listeners, false otherwise.
   *
   * Does almost the same thing as `EventEmitter.emit`
   * @param eventName
   * @param args
   */
  emitSync(eventName: SymbolKey, ...args: unknown[]) {
    assertType(eventName);
    if (this._events[eventName] && this._events[eventName].length) {
      for (const listener of this._events[eventName]) {
        const event = listener.fn;
        event.apply(this, args);

        if (listener.type === 'once') {
          // splice won't work, as it will affect the current loop
          const index = this._events[eventName].indexOf(listener, 0);
          delete this._events[eventName][index];
        }
      }

      return true;
    }
    return false;
  }
}
