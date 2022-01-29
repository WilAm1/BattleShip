/* 
TODO Refactor
*/

import generateBoard from "./components/board";
import Player from "./Player";
import Ship from "./ship";

const hasNoMovesLeft = (cell) => {
  return !cell.parentElement.querySelectorAll(".active").length;
};

const createModal = () => {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  return modal;
};

const onDrag = (e) => {
  const message = JSON.stringify(e.target.dataset);
  e.dataTransfer.setData("text/plain", message);
  e.target.style.opacity = 0.3;
};

const onDragEnd = (e) => {
  e.target.style.opacity = 1;
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
const getRandomCoordinate = (len) => {
  return Math.floor(Math.random() * len);
};

// Places randomized coordinates on enemy Ships
const placeRandomShips = (gameBoard, ships) => {
  Object.values(ships).forEach((shipLength) => {
    let isSuccess = false;
    while (!isSuccess) {
      const col = getRandomCoordinate(gameBoard.body.length);
      const row = getRandomCoordinate(gameBoard.body.length);
      const isVertical = Math.round(Math.random());
      const newShip = new Ship(shipLength);
      isSuccess = gameBoard.placeShip({ x: col, y: row, isVertical }, newShip);
    }
  });
};

const openingModal = (player, board, computer) => {
  const ships = {
    Carrier: 5,
    Battleship: 4,
    Destroyer: 3,
    Submarine: 3,
    "Patrol Boat": 2,
  };

  const modal = createModal();
  modal.innerHTML = `
  <div class="modal-content">
  <h2>WELCOME TO BATTLESHIP</h2>
  <div class="wrapper">
    <div class="mini-gameboard"></div>
    <div class="ships-wrapper">
      <div class="instruction">
        <p>PLACE YOUR SHIPS BY DRAGGING AND DROPPING IT INTO THE BOARD</p>
        <button>Rotate 🔃</button>
      </div>
      <div class="ships">
      </div>
    </div>
  </div>
  </div>
  `;

  const shipsContainer = modal.querySelector(".ships");

  const shipElements = Object.entries(ships).map(makeShipElement);
  shipsContainer.append(...shipElements);

  const rotate = modal.querySelector("button");
  rotate.addEventListener("click", () => {
    shipElements.forEach((ship) => {
      ship.classList.toggle("vertical");
      ship.dataset.isVertical = Number(ship.dataset.isVertical) ? 0 : 1;
    });
  });

  const gb = generateBoard(player.gb.body);
  gb.forEach((cell) => {
    cell.addEventListener("dragenter", (e) => {
      e.target.style.opacity = 0;
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

      // Display the ships
      myCoord.forEach((ship) => {
        ship.classList.add("isShip");
        // Displays the ships on the main gameBoard
        board
          .find(
            (mainShip) =>
              mainShip.dataset.coordinates === ship.dataset.coordinates
          )
          .classList.add("isShip");
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

  placeRandomShips(computer.gb, ships);
};

const endGame = (playerWin) => {
  const modal = createModal();
  modal.innerHTML = `
     <div class="modal-content">
     <p>${playerWin ? "Player wins!" : "Computer wins!"}</p>
     <button>Play Again</button>
   </div>
     `;
  modal.querySelector("button").addEventListener("click", () => {
    modal.remove();
    gameLoop();
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
  const player = new Player("player");
  const bot = new Player("bot", true);
  const newBoard = generateBoard(player.gb.body);
  openingModal(player, newBoard, bot);
  const onCellClick = function () {
    const clickedCoord = JSON.parse(this.dataset.coordinates);
    // Returns bool ship is hit
    const success = player.attackEnemy(clickedCoord, bot);
    markCell(this, success);

    if (bot.gb.areAllSunked() || bot.isGameOver()) {
      endGame(true);
    }

    // Enemy Computer
    const { coord: enemyCoord, hit: enemySuccess } = bot.attackRandomly(player);
    const attackedCell = newBoard.find(
      (div) => div.dataset.coordinates === JSON.stringify(enemyCoord)
    );

    markCell(attackedCell, enemySuccess);
    if (player.gb.areAllSunked() || hasNoMovesLeft(this)) {
      endGame(false);
    }
  };

  const botBoard = generateBoard(bot.gb.body, onCellClick);

  document.querySelector("#player").replaceChildren(...newBoard);
  document.querySelector("#computer").replaceChildren(...botBoard);
};

export default gameLoop;
