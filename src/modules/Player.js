import GameBoard from "./gameBoard";

export default class Player {
  #possibleMoves = [];
  constructor(name, isComputer) {
    this.name = name;
    this.isComputer = isComputer;
    this.gb = new GameBoard();
    if (this.isComputer) {
      this.#possibleMoves = this.generateMoves(this.gb.body.length);
    }
  }
  get possibleMoves() {
    return this.#possibleMoves;
  }
  generateMoves(len) {
    const array = [];
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        array.push([i, j]);
      }
    }
    return array;
  }
  attackEnemy(coord, enemy) {
    // attack the enemy ship
    return enemy.gb.receiveAttack(coord);
  }
  attackRandomly(enemy) {
    if (!this.isComputer) return [];
    // Picks a random number from the list and removes it
    const randInt = Math.floor(Math.random() * this.#possibleMoves.length);
    const [coord] = this.#possibleMoves.splice(randInt, 1);
    const success = this.attackEnemy(coord, enemy);
    return { coord, hit: success };
  }
  isGameOver() {
    // If there are no moves left
    return !this.#possibleMoves.length;
  }
}
