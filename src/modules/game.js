/* 
* Refactor (Marking functions)
* Add Ending Game and remove alerts
* Add Initialize ships
* Display Own Ships
TODO Add Randomize enemy ships
TODO Inherit Player Class Computer Class
*/

import generateBoard from "./components/board";
import Player from "./Player";
import Ship from "./ship";
import GameBoard from "./gameBoard";

const hasNoMovesLeft = (cell) => {
  return !cell.parentElement.querySelectorAll(".active").length;
};

const createModal = () => {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  return modal;
};
// * Removes child using parentElement.remoevChild and appendChild
const onDrag = (e) => {
  const message = JSON.stringify(e.target.dataset);
  e.dataTransfer.setData("text/plain", message);
  e.target.style.opacity = 0.5;
};

const onDragEnd = (e) => {
  e.target.style.opacity = 1;
};
const onDrop = (e) => {
  e.preventDefault();
  const data = e.dataTransfer.getData("text");
};
const makeShipElement = ([shipName, length]) => {
  const element = document.createElement("div");
  element.classList.add("ship");
  element.dataset.shipName = shipName;
  element.dataset.shipLength = length;
  element.dataset.isVertical = 0;
  element.draggable = true;
  element.addEventListener("dragstart", onDrag);
  element.addEventListener("dragend", onDragEnd);
  for (let i = 0; i < length; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    element.appendChild(cell);
  }
  return element;
};
const shipCoordinates = (col, row, isVertical, length) => {
  const arr = [];
  for (let i = 0; i < length; i += 1) {
    arr.push(isVertical ? [row + i, col] : [row, col + i]);
  }
  return arr;
};

const openingModal = (player, board) => {
  //initiliaze modal
  const modal = createModal();
  // Create model;
  modal.innerHTML = `
  <div class="modal-content">
  <p>Welcome to Battleship</p>
  <div class="wrapper">
    <div class="mini-gameboard"></div>
    <div class="ships">
        <p>Place your ships by dragging and dropping it into the board</p>
        <button>Rotate 🔃</button>
    </div>
  </div>
  </div>
  `;
  const shipsContainer = modal.querySelector(".ships");
  const ships = {
    Carrier: 5,
    Battleship: 4,
    Destroyer: 3,
    Submarine: 3,
    "Patrol Boat": 2,
  };

  const shipElements = Object.entries(ships).map(makeShipElement);
  shipsContainer.append(...shipElements);
  const rotate = modal.querySelector("button");
  rotate.addEventListener("click", () => {
    shipElements.forEach((ship) => {
      ship.classList.toggle("vertical");
      ship.dataset.isVertical = Number(ship.dataset.isVertical) ? 0 : 1;
    });
  });

  // * Add function that will populate ships on the player side! Make it remove the ship
  // * (Partial) Ship names and Instruction on Modal Content
  // * If there are no ships left, Remove the Modal Content and Start the Game!
  // TODO Populate Computer Board with random ships
  // TODO Refactor!

  const gb = generateBoard(player.gb.body);
  gb.forEach((cell) => {
    cell.addEventListener("dragenter", (e) => {
      e.target.style.opacity = 0.5;
    });
    cell.addEventListener("dragleave", (e) => {
      e.target.style.opacity = 1;
    });
    cell.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    cell.addEventListener("drop", (e) => {
      e.preventDefault();
      e.target.style.opacity = 1;
      const [y, x] = JSON.parse(e.target.dataset.coordinates);
      let {
        shipName,
        shipLength: length,
        isVertical,
      } = JSON.parse(e.dataTransfer.getData("text"));
      length = Number(length);
      isVertical = Number(isVertical);

      const possibeCoordinates = shipCoordinates(x, y, isVertical, length);
      const isShipSuccessful = player.gb.placeShip(
        {
          x,
          y,
          isVertical,
        },
        new Ship(length)
      );
      if (!isShipSuccessful) return;
      const myCoord = gb.filter((cell) => {
        const [y, x] = JSON.parse(cell.dataset.coordinates);
        for (const [row, col] of possibeCoordinates) {
          if (row === y && col === x) {
            return cell;
          }
        }
      });
      // Dispplay the ships
      myCoord.forEach((ship) => {
        ship.style.backgroundColor = "white";
        board.find(
          (mainShip) =>
            mainShip.dataset.coordinates === ship.dataset.coordinates
        ).style.backgroundColor = "white";
      });

      // Removes the Ship
      const shipNode = shipsContainer.querySelector(
        `[data-ship-name="${shipName}"`
      );
      shipNode.remove();
      // Check if Ships are still present on ship
      if (!shipsContainer.querySelector(".ship")) {
        modal.remove();
      }
    });
  });
  modal.querySelector(".mini-gameboard").append(...gb);
  document.body.appendChild(modal);
  // TODO Make the Placement of Random ships on Computer Board!
};

const endGame = (playerWin) => {
  const modal = createModal();
  modal.innerHTML = `
     <div class="modal-content">
     <p>${playerWin ? "You win!" : "Comp win!"}</p>
     <button>Play Again</button>
   </div>
     `;
  modal.querySelector("button").addEventListener("click", () => {
    gameLoop();
    modal.remove();
  });
  document.body.appendChild(modal);
};

// method that marks the cell
const markCell = (cell, isShip) => {
  cell.classList.add("disabled");
  cell.classList.remove("active");
  if (isShip) {
    cell.classList.add("isShip");
  }
};

const gameLoop = () => {
  const p1 = new Player("p1");
  const bot = new Player("bot", true);
  const newBoard = generateBoard(p1.gb.body);
  openingModal(p1, newBoard);

  //   p1.gb.placeShip({ x: 0, y: 0 }, new Ship());
  //   bot.gb.placeShip({ x: 1, y: 1 }, new Ship());

  const onCellClick = function () {
    const clickedCoord = JSON.parse(this.dataset.coordinates);
    // Returns bool ship is hit
    const success = p1.attackEnemy(clickedCoord, bot);
    markCell(this, success);

    if (bot.gb.areAllSunked() || bot.isGameOver()) {
      endGame(true);
    }

    // Enemy Comp
    const { coord: enemyCoord, hit: enemySuccess } = bot.attackRandomly(p1);
    // console.log(JSON.stringify(enemyCoord));
    const attackedCell = newBoard.find(
      (div) => div.dataset.coordinates === JSON.stringify(enemyCoord)
    );

    markCell(attackedCell, enemySuccess);
    if (p1.gb.areAllSunked() || hasNoMovesLeft(this)) {
      endGame(false);
    }
  };

  const botBoard = generateBoard(bot.gb.body, onCellClick);

  document.querySelector("#player").replaceChildren(...newBoard);
  document.querySelector("#computer").replaceChildren(...botBoard);
};

export default gameLoop;
