import { test, describe, expect } from "@jest/globals";
import GameBoard from "../gameBoard";
import Ship from "../ship";
/*
TODO Gameboards should be able to place ships at specific coordinates by calling the ship factory function.
TODO Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot.
TODO Gameboards should keep track of missed attacks so they can display them properly.
TODO Gameboards should be able to report whether or not all of their ships have been sunk.

*/

describe("Game Board Factory Function", () => {
  const gb = GameBoard();
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

  //   test("Place a ship on coordinates", () => {
  //     gb.body[0][0] = true;
  //     gb.body[0][1] = true;
  //     gb.body[0][2] = true;
  //     expect(gb.body).toEqual(testObjArr);
  //   });
  test("Place a ship on Coordinates", () => {
    gb.placeShip({ x: 0, y: 0, isVertical: false }, Ship());
    expect(gb.body[0]).toEqual([
      ...new Array(3).fill(true),
      ...new Array(7).fill(null),
    ]);
  });
});
