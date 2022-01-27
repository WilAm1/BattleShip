import GameBoard from "./gameBoard";
import Ship from "./ship";

export default class Player {
  #possibleMoves = [];
  constructor(name, isComputer) {
    this.name = name;
    this.isComputer = isComputer;
    this.gb = new GameBoard();
    // generate ships
    this.gb.placeShip({ x: 0, y: 0 }, new Ship());
    if (this.isComputer) {
      this.generateMoves();
    }
  }
  get possibleMoves() {
    return this.#possibleMoves;
  }
  generateMoves() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.#possibleMoves.push([i, j]);
      }
    }
  }
  attackEnemy(coord, enemyShip) {
    // attack the enemy ship
    enemyShip.gb.receiveAttack(coord);
  }
  attackRandomly(enemyShip) {
    if (!this.isComputer) return [];
    // Picks a random number from the list and removes it
    const randInt = Math.floor(Math.random() * this.#possibleMoves.length);
    const [coord] = this.#possibleMoves.splice(randInt, 1);
    this.attackEnemy(coord, enemyShip);
    return coord;
  }
  isGameOver() {
    // If there is no moves left
  }
}
