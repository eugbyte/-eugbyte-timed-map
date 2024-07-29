# About

Like a regular JS `Map`, but with the ability to execute callbacks at the specified time.

A possible use case might be to stop displaying the gps position of vehicles on a map should data stop emitting after a specified time.

# Quick start example

```
import { timedMapFactory, Strategy, type TimedMap } from "@eugbyte/timed-maps";

const cache: TimedMap<string, number> = timedMapFactory();
cache.set("one", 1);

// 5000 ms from now, execute a callback w.r.t the key "one" that will delete the key.
cache.setTimer("one", Date.now() + 5000, () => {
    console.log("5 seconds has passed, callback triggered");
    cache.delete("one");
});

// cache inherits all methods from the native JS Map object, like `get`, `has`, `set` etc.
const value = cache.get("one");
console.log(value); // "1"

console.log(cache.has("one"));    // true

// demo purpose - create a sleep function for the time to pass
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
await sleep(6000);
console.log(cache.has("one")) // false
```

# More info

## Strategies

There are two strategies for the timed map. `Strategy.TIMEOUT` AND `Strategy.TICKER` (default).

```
let cache: TimedMap<string, number> = timedMapFactory(Strategy.TIMEOUT);
cache = timedMapFactory(Strategy.TICKER);
cache = timedMapFactory(); // defaults to `Strategy.TICKER`
```

|                                     | TICKER                                                                                                                                                             | TIMEOUT                                                                                                                                                                                                                                                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Default if not specified in factory | Yes                                                                                                                                                                | No                                                                                                                                                                                                                                                                                                                                   |
| How it works                        | Uses `setInterval` internally to check the specified timestamps periodically every second. The callbacks are stored in a priority queue, ordered by the timestamp. | Uses `setTimeout` internally to create multiple timeouts                                                                                                                                                                                                                                                                             |
| Use case                            | Cache is expected to be used perpetually, e.g. in a backend server                                                                                                 | Cache is expected to <b>not</b> be used perpetually, e.g. in a browser tab that will eventually close. The `setTimeout` id must be repeat. Since there is a maximum number the computer can handle, tt is possible to [run out of timeout ids](https://stackoverflow.com/questions/53102524/does-javascript-run-out-of-timeout-ids). |
| Precision                           | Since `setInterval` is used to check the specified timestamps every second, delays might be increased by a second.                                                 | High. However, see more below on "Precision".                                                                                                                                                                                                                                                                                        |

## Precision

The timeout value represents the <b>minimum</b> delay after which the message will be pushed into the queue.
Recall that JS uses an event loop and message queue, the latter which can be enqueued with intensive tasks. To [elaborate from MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop#adding_messages):

<i>"If there is no other message in the queue, and the stack is empty, the message is processed right after the delay. However, if there are messages, the setTimeout message will have to wait for other messages to be processed. For this reason, the second argument indicates a minimum time — not a guaranteed time."</i>

To improve performance, ensure that the callback specified in `setTimer` is not CPU intensive.

Additionally, note that if the `TICKER` strategy is used, the minimum delay might increased by a second, since `setInterval` is used internally to check the provided timestamps every second.

## Additional methods

### `getTimeout(key)`

Gets the timeout information w.r.t the specified key.

```
import { timedMapFactory, Strategy, type TimedMap, type TimeoutInfo } from "@eugbyte/timed-maps";

const cache: TimedMap<string, number> = timedMapFactory();
cache.set("one", 1);
cache.setTimer("one", Date.now() + 5000, () => {
    console.log("5 seconds has passed, callback triggered");
});

const timeoutInfo: TimeoutInfo | undefined = cache.getTimeout("one");
console.log(timeoutInfo); // { ttl: 5000, timestamp: 1722165571956, callback: [Function (anonymous)] }
```

### `getTimeouts()`

Returns a deep copy of all timeout informations.

```
const infos: Map<string, TimeoutInfo> = cache.getTimeouts();
```
