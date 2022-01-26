import { test, describe, expect, beforeEach } from "@jest/globals";
import GameBoard from "../gameBoard";
import Ship from "../ship";

describe("Game Board Factory Function", () => {
  let gb;
  beforeEach(() => {
    gb = GameBoard();
  });
  const testObjArr = new Array(10).fill(new Array(10).fill(null));
  testObjArr[0][0] = true;
  testObjArr[0][1] = true;
  testObjArr[0][2] = true;
  test("GameBoard is there", () => {
    expect(gb).not.toBeUndefined();
  });

  test("have 10 array values", () => {
    expect(gb.body).toHaveLength(10);
  });
  test("have 10 array values on one value", () => {
    expect(gb.body[0]).toHaveLength(10);
  });

  test("Place a ship on coordinates", () => {
    gb.body[0][0] = true;
    gb.body[0][1] = true;
    gb.body[0][2] = true;
    expect(gb.body).toEqual(testObjArr);
  });

  test("Place a ship on Coordinates (horizontally) ", () => {
    gb.placeShip({ x: 0, y: 0, isVertical: false }, Ship());
    expect(gb.body[0]).toEqual([
      ...new Array(3).fill(true),
      ...new Array(7).fill(null),
    ]);
  });

  test("Place a ship vertically", () => {
    gb.placeShip({ x: 0, y: 1, isVertical: true }, Ship());
    expect([gb.body[1][0], gb.body[2][0], gb.body[3][0]]).toEqual([
      true,
      true,
      true,
    ]);
  });
  test("Place multiple ships", () => {
    gb.placeShip({ x: 0, y: 1, isVertical: true }, Ship());
    expect(gb.placeShip({ x: 0, y: 1, isVertical: true }, Ship())).toBe(false);
  });
  test("Should be able to recieve attack", () => {
    gb.placeShip({ x: 0, y: 0 }, Ship());
    expect(gb.recieveAttack).not.toBeUndefined();
    expect(gb.recieveAttack([0, 0])).toBe(true);
    expect(gb.recieveAttack([0, 0])).toBe(false);
  });
  test("Should record missed attacks", () => {
    gb.placeShip({ x: 0, y: 0 }, Ship());
    gb.recieveAttack([5, 5]);
    expect(gb.getMissedAttacks()).toEqual([[5, 5]]);
  });
  test("should report whether ships are sunked 1", () => {
    gb.placeShip({ x: 0, y: 0 }, Ship());
    gb.recieveAttack([0, 0]);
    gb.recieveAttack([0, 1]);
    gb.recieveAttack([0, 2]);
    expect(gb.areAllSunked()).toBe(true);
  });

  test("should report whether ships are sunked 2", () => {
    gb.placeShip({ x: 0, y: 0 }, Ship());
    gb.placeShip({ x: 4, y: 0 }, Ship());
    gb.recieveAttack([0, 0]);
    gb.recieveAttack([0, 1]);
    gb.recieveAttack([0, 2]);
    gb.recieveAttack([0, 4]);
    gb.recieveAttack([0, 5]);
    gb.recieveAttack([0, 6]);
    expect(gb.areAllSunked()).toBe(true);
  });
});
