/* 
TODO Create the main game loop and a module for DOM interaction.
TODO The game loop should set up a new game by creating Players and Gameboards. 
For now just populate each Gameboard with predetermined coordinates. 
You can implement a system for allowing players to place their ships later.
TODO We’ll leave the HTML implementation up to you for now, but you should 
display both the player’s boards and render them using information from the Gameboard class.
TODO You need methods to render the gameboards and to take user input for
 attacking. For attacks, let the user click on a coordinate in the enemy Gameboard.

*/

import generateBoard from "./components/board";
import Player from "./Player";
import Ship from "./ship";

// method that marks the cell

const markCell = (cell) => {
  cell.classList.add("disabled");
};
const colorCell = (cell) => {
  cell.classList.add("isShip");
};
const game = () => {
  const p1 = new Player("p1");
  const bot = new Player("bot", true);
  // Populate with predetermined coordinates
  p1.gb.placeShip({ x: 0, y: 0 }, new Ship());
  bot.gb.placeShip({ x: 0, y: 0 }, new Ship());
  const onCellClick = function () {
    const coord = JSON.parse(this.dataset.coordinates);
    console.log(coord);
    // Return if coord is in the already missed
    const success = p1.attackEnemy(coord, bot);
    markCell(this);
    if (success) {
      colorCell(this);
    }
    const { coord: enemyCoord, hit: enemySuccess } = bot.attackRandomly(p1);
    console.log(JSON.stringify(enemyCoord));
    const myCell = newBoard.find(
      (div) => div.dataset.coordinates === JSON.stringify(enemyCoord)
    );
    markCell(myCell);
    if (enemySuccess) {
      colorCell(myCell);
    }
    // Display another color if hit a ship.
  };
  // Generate Boards
  const newBoard = generateBoard(p1.gb.body);
  const botBoard = generateBoard(bot.gb.body, onCellClick);
  document.querySelector("#player").append(...newBoard);
  document.querySelector("#computer").append(...botBoard);
};
export default game;
