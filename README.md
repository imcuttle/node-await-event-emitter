# serial-await-event-emitter

Replicate node EventEmitter, but with await for each listener.

## Installation

```bash
npm i serial-await-event-emitter
```

## Usage

```js
import { SerialAwaitEventEmitter } from 'serial-await-event-emitter';

const emitter = new SerialAwaitEventEmitter()
const test = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log('test')
      resolve()
    }, 1000)
  })

emitter.on('event', async () => {
  // will wait 1000ms, then log
  await test()
})

async function run() {
  // emit is now run with await
  await emitter.emit('event', '...arguments')
  await emitter.emit('event', 'again')

  // also supports the classic sync method
  emitter.emitSync('event', 'again')
}

run()
```

One novelty feature is that adding, or prepending events while running is supported

```js
// example-prepend.ts
import { SerialAwaitEventEmitter } from 'serial-await-event-emitter';

const emitter = new SerialAwaitEventEmitter()

emitter.on('aa', function initial() {});
emitter.prependOnce('aa', function once() { emitter.prepend('aa', function prepended() {})});
emitter.on('aa', function add() { emitter.once('aa', function addedOnce() {})});
emitter.on('aa', function final() {});

await emitter.emit('aa');
// will run: once, prepended, initial, add, final, addedOnce

emitter.listeners('aa');
// [prepended, initial, add, final]
// once listeners are removed after running

await emitter.emit('aa');
// this time will run: prepended, initial, add, final, addedOnce
// add method adds addedOnce each time is run
// BE AWARE. prepending using `on` will result in an infinite listeners being added, and an infinite loop for emit.
```

```js
// example-remove.ts
import { SerialAwaitEventEmitter } from 'serial-await-event-emitter';

const emitter = new SerialAwaitEventEmitter()
const test1 = () => {};
const test2 = () => {};

emitter.on('bb', test1);
emitter.on('bb', () => {emitter.off('bb', test2)});
emitter.on('bb', test2);

await emitter.emit('bb');
// will run: test1, annonymous

emitter.listeners('bb');
// [test1, annonymous]


```

## License

MIT
