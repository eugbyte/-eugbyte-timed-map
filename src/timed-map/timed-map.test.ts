import { afterAll, describe, expect, it } from "vitest";
import { TickerMap } from "./ticker-map";
import { TimeoutMap } from "./timeout-map";
import type { TimedMap } from "./timed-map.types";

function sleep(ms: number): Promise<unknown> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Test TimedMap", () => {
  const tickerMap: TimedMap<string, number> = new TickerMap();
  const timeoutMap: TimedMap<string, number> = new TimeoutMap();

  afterAll(() => {
    tickerMap.dispose();
    timeoutMap.dispose();
  });

  describe.each([tickerMap, timeoutMap])(
    "should be created",
    (cache: TimedMap<string, number>) => {
      it("should be created", () => {
        expect(cache).toBeTruthy();
      });

      it("item should be accessible", () => {
        cache.set("one", 1);
        const value: number | undefined = cache.get("one");
        expect(value).toBe(1);
        expect(cache.has("one")).toBeTruthy();
      });

      it("item should be removed", () => {
        cache.set("one", 1);
        const isPresent: boolean = cache.delete("one");
        expect(isPresent).toBeTruthy();

        const value: number | undefined = cache.get("one");
        expect(value).toBeUndefined();
      });

      it("item should be evicted after timeout", async () => {
        cache.set("one", 1);
        cache.setTimer("one", Date.now() + 1000, () => {
          cache.delete("one");
        });
        expect(cache.has("one")).toBeTruthy();

        await sleep(3000);
        expect(cache.has("one")).toBeFalsy();
      });

      it("callback should work", async () => {
        let msg = "";
        cache.set("one", 1);
        cache.setTimer("one", Date.now() + 1000, () => {
          msg = "callback executed";
        });

        await sleep(3000);
        expect(msg).toBe("callback executed");
      });
    }
  );
});
