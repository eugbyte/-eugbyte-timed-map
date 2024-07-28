import { TickerMap } from "./ticker-map";
import { TimeoutMap } from "./timeout-map";
import { TimedMap } from "./timed-map.types";

export type Abc = 1;

export enum Strategy {
  /**
   * Cache is expected to be used perpetually, e.g. in a backend server, https://stackoverflow.com/a/53127712/6514532.
   * Uses setInterval under the hood.
   */
  TICKER = 0,
  /**
   * Cache is expected to not be used perpetually, e.g. in a browser tab.
   * Uses setTimeout under the hood to create multiple timeoputs.
   * It is possible to [run out of timeout ids](https://stackoverflow.com/questions/53102524/does-javascript-run-out-of-timeout-ids) as each id must be unique
   */
  TIMEOUT,
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop#adding_messages
// https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#reasons_for_delays_longer_than_specified
export function timedMapFactory<K, V>(
  strategy = Strategy.TICKER
): TimedMap<K, V> {
  switch (strategy) {
    case Strategy.TICKER:
      return new TickerMap();
    case Strategy.TIMEOUT:
      return new TimeoutMap();
    default:
      return new TickerMap();
  }
}
