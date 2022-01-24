import { test, expect, describe } from "@jest/globals";
import Ship from "../ship";

describe("ship factory function", () => {
  const ship = Ship();
  test("is available", () => {
    expect(ship).not.toBeUndefined();
  });
  test("Have length", () => {
    expect(ship.length).toBeGreaterThan(0);
    expect(ship.length).toBe(3);
  });
  test("Have hit() method", () => {
    expect(ship.hit(1)).toBe(true);
    expect(ship.hit(1)).toBe(false);
  });
  test("Have isSunk() method", () => {
    ship.hit(0);
    ship.hit(2);
    expect(ship.isSunk()).not.toBeUndefined();
    expect(ship.isSunk()).toBe(true);
  });
});
