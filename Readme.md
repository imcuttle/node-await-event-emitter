# await-events
await events library like EventEmitter

[![build status](https://img.shields.io/travis/imcuttle/node-await-events/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/node-await-events)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/node-await-events.svg?style=flat-square)](https://codecov.io/github/imcuttle/node-await-events?branch=master)
[![NPM version](https://img.shields.io/npm/v/node-await-events.svg?style=flat-square)](https://www.npmjs.com/package/node-await-events)
[![NPM Downloads](https://img.shields.io/npm/dm/node-await-events.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/node-await-events)

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

## Installation
```bash
npm install --save await-events
```

## Usage
```javascript
const AwaitEventEmitter = require('await-events')

const emitter = new AwaitEventEmitter()
const tick = () => 
  new Promise(resolve => {
    setTimeout(() => {
      console.log('tick')
      resolve()
    })
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
}

run()
```

## Test
```bash
npm test
```
