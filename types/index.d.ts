/**
 * Await events library like EventEmitter
 * @author imcuttle
 */
declare const isPromise: any
declare const TYPE_KEY_NAME: string | symbol
declare function assertType(type: any): void
declare type SymbolKey = string | any
declare function assertFn(fn: any): void
declare function alwaysListener(
  fn: any
): {
  [x: string]: any
  fn: any
}
declare function onceListener(
  fn: any
): {
  [x: string]: any
  fn: any
}
declare class AwaitEventEmitter {
  _events: Record<
    any | SymbolKey,
    Array<{
      fn: Function
    }>
  >
  addListener(type: SymbolKey, fn: Function): this
  on(type: SymbolKey, fn: Function): this
  prependListener(type: SymbolKey, fn: Function): this
  prepend(type: SymbolKey, fn: Function): this
  prependOnceListener(type: SymbolKey, fn: Function): this
  prependOnce(type: SymbolKey, fn: Function): this
  listeners(type: SymbolKey): Function[]
  once(type: SymbolKey, fn: Function): this
  removeAllListeners(type?: SymbolKey): void
  off(type: SymbolKey, nullOrFn?: Function): false | any[]
  removeListener(type: SymbolKey, nullOrFn?: Function): false | any[]
  emit(type: SymbolKey, ...args: unknown[]): Promise<boolean>
  emitSync(type: SymbolKey, ...args: unknown[]): boolean
}
