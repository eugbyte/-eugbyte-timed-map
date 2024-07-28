import { describe, it, expect } from "vitest";
import { timedMapFactory, Strategy } from "./timed-map.factory";
import type { TimedMap } from "./timed-map.types";

describe("test mapFactory", () => {
  it("strategy ticker should be created", async () => {
    const cache: TimedMap<string, number> = timedMapFactory(Strategy.TICKER);
    expect(cache).toBeTruthy();

    // remember to dispose of the cache after use, e.g. in a browser tab, since the cache uses setTimeout / setInterval internally.
    cache.dispose();
  }, 7000);

  it("strategy timeout should be created", () => {
    const cache: TimedMap<number, number> = timedMapFactory(Strategy.TIMEOUT);
    expect(cache).toBeTruthy();
    cache.dispose();
  });

  it("default strategy should be created", () => {
    const cache: TimedMap<number, Record<string, string>> = timedMapFactory();
    expect(cache).toBeTruthy();
    cache.dispose();
  });
});
