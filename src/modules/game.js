/* 
TODO Refactor (Marking functions)
TODO Display Own Ships
TODO Add Ending Game and remove alerts
TODO Add Initialize ships
TODO Add Randomize enemy ships
TODO Inherit Player Class Computer Class
*/

import generateBoard from "./components/board";
import Player from "./Player";
import Ship from "./ship";

// method that marks the cell
const markCell = (cell) => {
  cell.classList.add("disabled");
  cell.classList.remove("active");
};
const markShipCell = (cell) => {
  cell.classList.add("isShip");
};
const hasNoMovesLeft = (cell) => {
  return !cell.parentElement.querySelectorAll(".active").length;
};

const gameLoop = () => {
  const p1 = new Player("p1");
  const bot = new Player("bot", true);
  // Populate with predetermined coordinates
  p1.gb.placeShip({ x: 0, y: 0 }, new Ship());
  bot.gb.placeShip({ x: 0, y: 0 }, new Ship());
  const onCellClick = function () {
    const clickedCoord = JSON.parse(this.dataset.coordinates);
    // console.log(clickedCoord);
    // Returns bool ship is hit
    console.log(hasNoMovesLeft(this));
    const success = p1.attackEnemy(clickedCoord, bot);

    markCell(this);
    if (success) {
      markShipCell(this);
    }
    if (bot.gb.areAllSunked() || bot.isGameOver()) {
      alert("you win!");
      return true;
    }
    // Enemy Comp
    const { coord: enemyCoord, hit: enemySuccess } = bot.attackRandomly(p1);
    // console.log(JSON.stringify(enemyCoord));
    const myCell = newBoard.find(
      (div) => div.dataset.coordinates === JSON.stringify(enemyCoord)
    );
    markCell(myCell);
    if (enemySuccess) {
      markShipCell(myCell);
    }
    if (p1.gb.areAllSunked() || hasNoMovesLeft()) {
      alert("Yow lose!");
    }
  };

  // Generate Boards
  const newBoard = generateBoard(p1.gb.body);
  const botBoard = generateBoard(bot.gb.body, onCellClick);

  document.querySelector("#player").append(...newBoard);
  document.querySelector("#computer").append(...botBoard);
};

export default gameLoop;
