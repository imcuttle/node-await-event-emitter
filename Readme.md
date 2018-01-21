# await-event-emitter

Await events library like EventEmitter

[![build status](https://img.shields.io/travis/imcuttle/node-await-event-emitter/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/node-await-event-emitter)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/node-await-event-emitter.svg?style=flat-square)](https://codecov.io/github/imcuttle/node-await-event-emitter?branch=master)
[![NPM version](https://img.shields.io/npm/v/await-event-emitter.svg?style=flat-square)](https://www.npmjs.com/package/await-event-emitter)
[![NPM Downloads](https://img.shields.io/npm/dm/await-event-emitter.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/await-event-emitter)

## Why?

The concept of Webpack plugin has lots of lifecycle hooks, they implement this via EventEmitter.
In the primitive [events](https://nodejs.org/dist/latest-v8.x/docs/api/events.html) module on nodejs, the usage as follows
```javascript
const EventEmitter = require('events')
const emitter = new EventEmitter()

emitter
  .on('event', () => {
    // do something *synchronously*
  })
  .emit('event', '...arguments')
```
The listener must be **synchronous**, that is way i wrote it.  
And await-event-emitter support synchronous emitter magically :smile:

## Installation
```bash
npm install --save await-event-emitter
```

## Usage
```javascript
const AwaitEventEmitter = require('await-event-emitter')

const emitter = new AwaitEventEmitter()
const tick = () => 
  new Promise(resolve => {
    setTimeout(() => {
      console.log('tick')
      resolve()
    }, 1000)
  })

emitter
  .on('event', async () => {
    // wait to print
    await tick()
  })

async function run() {
  // NOTE: it's important to `await` the reset process
  await emitter.emit('event', '...arguments')
  await emitter.emit('event', 'again')

  // support emit it synchronously
  emitter.emitSync('event', 'again')
}

run()
```

## API

### Class `AwaitEventEmitter`
- `addListener(event, listener)` : AwaitEventEmitter   
  alias: `on`
- `once(event, listener)` 
- `prependListener(event, listener)` : AwaitEventEmitter  
  alias: `prepend`
- `prependOnceListener(event, listener)` : AwaitEventEmitter  
  alias: `prependOnce`
- `removeListener(event, listener)` : AwaitEventEmitter    
  alias: `off`
- `listeners(event)` : []
- `emit(event, ...args)` : Promise.resolve(boolean)  
  emit listeners asynchronously, we recommended await it resolved the result
- `emitSync(event, ...args)` : boolean
  emit listeners synchronously
  
## Test
```bash
npm test
```
