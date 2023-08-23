import { SerialAwaitEventEmitter } from './index';

function tick(func: any) {
  return new Promise((resolve) => {
    setTimeout(() => {
      func();
      resolve(true);
    }, 1000);
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe('SerialAwaitEventEmitter', () => {
  it('on', () => {
    const emitter = new SerialAwaitEventEmitter();
    let flag = 1;
    const listener = async (a: any, b: any) => {
      flag = b;
    };
    emitter.on('event', listener);
    emitter.emit('event', 2, 4);
    emitter.emit('event', 2, 6);

    expect(flag).toEqual(6);
    expect(emitter._events['event'][0].fn).toEqual(listener);
  });

  it('once', () => {
    const emitter = new SerialAwaitEventEmitter();
    let flag = 1;
    const listener = (a: any, b: any) => {
      flag = b;
    };
    emitter.once('event', listener);
    emitter.emit('event', 2, 4);
    emitter.emit('event', 2, 6);

    expect(flag).toEqual(4);
    expect(emitter.listeners('event')).toEqual([]);
  });

  describe('prepend', () => {
    it('should prepend function', async () => {
      const emitter = new SerialAwaitEventEmitter();
      const testFn1 = jest.fn();
      const testFn2 = jest.fn();

      emitter.on('aa', testFn2);
      emitter.prepend('aa', testFn1);

      const listeners = emitter.listeners('aa');

      expect(listeners).toEqual(expect.arrayContaining([testFn1, testFn2]));
      expect(listeners[0]).toEqual(testFn1);
      expect(listeners[1]).toEqual(testFn2);
    });

    it('should prepend and execute function added while running', async () => {
      const emitter = new SerialAwaitEventEmitter();
      const testFn1 = jest.fn();
      const testFn2 = jest.fn();

      emitter.once('aa', function first() {
        emitter.prepend('aa', testFn1);
      });
      emitter.on('aa', testFn2);
      await emitter.emit('aa');

      const listeners = emitter.listeners('aa');

      expect(listeners).toEqual(expect.arrayContaining([testFn1, testFn2]));
      expect(testFn1).toBeCalledTimes(1);
      expect(testFn2).toBeCalledTimes(1);
    });
  });

  describe('prependOnce', () => {
    it('should prepend function', async () => {
      const emitter = new SerialAwaitEventEmitter();
      const testFn1 = jest.fn();
      const testFn2 = jest.fn();

      emitter.on('aa', testFn2);
      emitter.prependOnce('aa', testFn1);

      const listeners = emitter.listeners('aa');

      expect(listeners).toEqual(expect.arrayContaining([testFn1, testFn2]));
      expect(listeners[0]).toEqual(testFn1);
      expect(listeners[1]).toEqual(testFn2);
    });

    it('should prepend and execute function added while running', async () => {
      const emitter = new SerialAwaitEventEmitter();
      const testFn1 = jest.fn();
      const testFn2 = jest.fn();

      emitter.once('aa', function first() {
        emitter.prependOnce('aa', testFn1);
      });
      emitter.on('aa', testFn2);
      await emitter.emit('aa');

      const listeners = emitter.listeners('aa');

      expect(listeners).toEqual(expect.arrayContaining([testFn2]));
      expect(testFn1).toBeCalledTimes(1);
      expect(testFn2).toBeCalledTimes(1);
    });
  });

  it('prependListener', () => {
    const emitter = new SerialAwaitEventEmitter();
    let flag = 1;
    const listener = (a: any, b: any) => {
      flag = b;
    };
    emitter.addListener('event', (a: any, b: any) => {
      flag = b + 1;
    });
    emitter.prependListener('event', listener);
    emitter.emit('event', 2, 4);
    emitter.emit('event', 2, 6);

    expect(flag).toEqual(7);
    expect(emitter.listeners('event').length).toEqual(2);
    expect(emitter.listeners('event')[0]).toEqual(listener);
    expect(emitter.listeners('event')[1]).not.toEqual(listener);
  });

  it('sync!', () => {
    const emitter = new SerialAwaitEventEmitter();
    let flag = 1;
    const listener = async (a: any, b: any) => {
      flag = b;
    };
    emitter.addListener('event', async (a: any, b: any) => {
      flag = b + 1;
    });
    emitter.prependListener('event', listener);
    emitter.emitSync('event', 2, 4);
    emitter.emitSync('event', 2, 6);
    emitter.emitSync('event', 2, 9);

    expect(flag).toEqual(10);
    expect(emitter.listeners('event').length).toEqual(2);
    expect(emitter.listeners('event')[0]).toEqual(listener);
    expect(emitter.listeners('event')[1]).not.toEqual(listener);
  });

  it('removeListener', () => {
    const emitter = new SerialAwaitEventEmitter();
    let flag = 1;
    const listener = (a: any, b: any) => {
      flag = b;
    };
    emitter
      .addListener('event', listener)
      .prependListener('event', listener)
      .prependOnceListener('event', listener)
      .removeListener('event', listener);
    expect(emitter.listeners('event').length).toEqual(0);

    const listenerA = () => {
      return;
    };
    emitter.addListener('event', listener).prependListener('event', listenerA).removeListener('event', listener);
    expect(emitter.listeners('event').length).toEqual(1);
    expect(emitter.listeners('event')[0]).toEqual(listenerA);
  });

  it('prependOnceListener', () => {
    const emitter = new SerialAwaitEventEmitter();
    let flag = 1;
    const listener = (a: any, b: any) => {
      flag = b;
    };
    emitter.prependOnceListener('event', () => (flag = 5)).prependListener('event', listener);

    emitter.emit('event', 2, 1);
    expect(flag).toEqual(5);
    expect(emitter.listeners('event').length).toEqual(1);
  });

  describe('emit', () => {
    it('should execute sync operations in succession', async () => {
      const emitter = new SerialAwaitEventEmitter();
      let flag = 1;
      emitter.on('event', (a: any) => {
        flag = a;
      });
      emitter.on('event', (a: any) => {
        flag = a + 1;
      });
      emitter.emitSync('event', 4);
      expect(flag).toEqual(5);
    });

    it('should execute async with return', async () => {
      const emitter = new SerialAwaitEventEmitter();
      let flag = 1;
      emitter.on('event', (a: any, b: any) => {
        flag = b;
      });
      emitter.on('event', (a: any, b: any) => {
        return tick(() => (flag = b + 1));
      });
      await emitter.emit('event', 2, 4);
      expect(flag).toEqual(5);
    });

    it('should execute async with await', async () => {
      const emitter = new SerialAwaitEventEmitter();
      let flag = 1;
      emitter.on('event', (a: any, b: any) => {
        flag = b;
      });
      emitter.on('event', async (a: any, b: any) => {
        await tick(() => (flag = b + 1));
      });
      await emitter.emit('event', 2, 4);
      expect(flag).toEqual(5);
    });

    it('should execute async without await or return', async () => {
      const emitter = new SerialAwaitEventEmitter();
      let flag = 1;
      emitter.on('event', (a: any, b: any) => {
        flag = b;
      });
      emitter.on('event', (a: any, b: any) => {
        tick(() => (flag = b + 1));
      });
      await emitter.emit('event', 2, 4);
      expect(flag).toEqual(4);
      await sleep(1000);
      expect(flag).toEqual(5);
    });

    it('should allow in flight removal with removeListener', async () => {
      const emitter = new SerialAwaitEventEmitter();
      const testFn = jest.fn();

      emitter.on('aa', () => {
        emitter.removeListener('aa', testFn);
      });
      emitter.on('aa', testFn);

      await emitter.emit('aa');

      expect(testFn).not.toBeCalled();
    });

    it('should allow in flight removal with removeAllListeners', async () => {
      const emitter = new SerialAwaitEventEmitter();
      const testFn = jest.fn();

      emitter.on('aa', () => {
        emitter.removeAllListeners('aa');
      });
      emitter.on('aa', testFn);

      await emitter.emit('aa');

      expect(testFn).not.toBeCalled();
    });

    it('should run listeners after removing some', async () => {
      const emitter = new SerialAwaitEventEmitter();
      const testFn1 = jest.fn();
      const testFn2 = jest.fn();

      emitter.on('aa', testFn1);
      emitter.on('aa', () => {
        emitter.removeListener('aa', testFn1);
      });
      emitter.on('aa', testFn1);
      emitter.on('aa', testFn2);
      emitter.on('aa', testFn2);

      await emitter.emit('aa');

      expect(testFn1).toBeCalledTimes(1);
      expect(testFn2).toBeCalledTimes(2);
    });
  });

  describe('once', () => {
    it('should allow same function hooked', async () => {
      const emitter = new SerialAwaitEventEmitter();
      const testFn1 = jest.fn();

      emitter.once('aa', testFn1);
      emitter.once('aa', testFn1);

      await emitter.emit('aa');

      expect(testFn1).toBeCalledTimes(2);
    });

    it('should allow in flight removal with removeListener', async () => {
      const emitter = new SerialAwaitEventEmitter();
      const testFn1 = jest.fn();

      emitter.once('aa', testFn1);
      emitter.once('aa', () => {
        emitter.removeListener('aa', testFn1);
      });
      emitter.once('aa', testFn1);

      await emitter.emit('aa');

      expect(testFn1).toBeCalledTimes(1);
    });

    it('should allow in flight removal with removeAllListeners', async () => {
      const emitter = new SerialAwaitEventEmitter();
      const testFn1 = jest.fn();

      emitter.once('aa', testFn1);
      emitter.once('aa', () => {
        emitter.removeAllListeners('aa');
      });
      emitter.once('aa', testFn1);

      await emitter.emit('aa');

      expect(testFn1).toBeCalledTimes(1);
    });
  });

  describe('removeAllListeners', () => {
    it('should remove all listeners for event', () => {
      const emitter = new SerialAwaitEventEmitter();
      const testFn1 = jest.fn();
      const testFn2 = jest.fn();

      emitter.on('aa', testFn1);
      emitter.on('aa', testFn2);

      emitter.removeAllListeners('aa');

      expect(emitter.listeners('aa')).toEqual([]);
    });

    it('should remove all listeners for all events', () => {
      const emitter = new SerialAwaitEventEmitter();
      const testFn1 = jest.fn();
      const testFn2 = jest.fn();

      emitter.on('aa', testFn1);
      emitter.on('aa', testFn2);
      emitter.on('bb', testFn1);
      emitter.on('bb', testFn2);

      emitter.removeAllListeners();

      expect(emitter.listeners('aa')).toEqual([]);
      expect(emitter.listeners('bb')).toEqual([]);
    });
  });
});
