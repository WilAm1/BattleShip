import { test, describe, expect, beforeEach } from "@jest/globals";
import Player from "../Player";
import GameBoard from "../gameBoard";
import Ship from "../ship";

const samplePossibleMoves = [];
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    samplePossibleMoves.push([i, j]);
  }
}
describe("Player Test", () => {
  let p1, bot, dummyShip, dummyGB;
  beforeEach(() => {
    p1 = new Player("p1", false);
    bot = new Player("p2", true);
    dummyShip = Ship();
    dummyGB = GameBoard();
    dummyGB.placeShip({ x: 0, y: 0 }, dummyShip);
  });

  test("Attack Enemy", () => {
    // Y and X (row and column)
    p1.attackEnemy([0, 0], bot);
    p1.attackEnemy([0, 1], bot);
    p1.attackEnemy([0, 2], bot);
    expect(bot.gb.areAllSunked()).toBe(true);
  });
  test("Have 100 available moves for AI ", () => {
    expect(bot.possibleMoves.length).toEqual(samplePossibleMoves.length);
  });
  test("Attack Randomly", () => {
    const coord = bot.attackRandomly(p1);
    expect(coord.length).toBe(2);
    expect(bot.possibleMoves.length).toEqual(99);
    expect(p1.attackRandomly(bot)).toEqual([]);
  });
});
