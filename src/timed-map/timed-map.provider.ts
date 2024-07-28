import { TickerMap } from "./ticker-map";
import { TimeoutMap } from "./timeout-map";
import { TimedMap } from "./timed-map.types";

export enum Strategy {
  /**
   * Alternative strategy that uses setInterval under the hood.
   * Cache is expected to be used perpetually, e.g. in a backend server, https://stackoverflow.com/a/53127712/6514532.
   */
  TIMEOUTS = 0,
  /**
   * Cache is expected to not be used perpetually, e.g. in a browser tab.
   * This is because it is possible for
   */
  TICKER,
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop#adding_messages
// https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#reasons_for_delays_longer_than_specified
export function timedMapFactory<K, V>(
  strategy = Strategy.TICKER
): TimedMap<K, V> {
  switch (strategy) {
    case Strategy.TICKER:
      return new TickerMap();
    case Strategy.TIMEOUTS:
      return new TimeoutMap();
    default:
      return new TickerMap();
  }
}
