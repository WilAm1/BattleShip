/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/Player.js":
/*!*******************************!*\
  !*** ./src/modules/Player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _gameBoard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameBoard */ "./src/modules/gameBoard.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship */ "./src/modules/ship.js");



class Player {
  #possibleMoves = [];
  constructor(name, isComputer) {
    this.name = name;
    this.isComputer = isComputer;
    this.gb = new _gameBoard__WEBPACK_IMPORTED_MODULE_0__["default"]();
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


/***/ }),

/***/ "./src/modules/components/board.js":
/*!*****************************************!*\
  !*** ./src/modules/components/board.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const generateBoard = (board, cb) => {
  // * generates a grid Board
  const array = [];
  board.forEach((row, rowIdx) => {
    row.forEach((column, colIdx) => {
      const cell = document.createElement("div");
      cell.dataset.coordinates = JSON.stringify([rowIdx, colIdx]);
      cell.classList.add("cell");
      cell.classList.add("active");
      cell.draggable = false;
      if (cb) {
        cell.addEventListener("click", cb);
      }
      array.push(cell);
    });
  });
  return array;
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (generateBoard);


/***/ }),

/***/ "./src/modules/game.js":
/*!*****************************!*\
  !*** ./src/modules/game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/board */ "./src/modules/components/board.js");
/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Player */ "./src/modules/Player.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ship */ "./src/modules/ship.js");
/* 
TODO Finish up the UI
TODO Refactor
*/





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
  e.target.style.opacity = 0.5;
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
      const newShip = new _ship__WEBPACK_IMPORTED_MODULE_2__["default"](shipLength);
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

  const shipElements = Object.entries(ships).map(makeShipElement);
  shipsContainer.append(...shipElements);

  const rotate = modal.querySelector("button");
  rotate.addEventListener("click", () => {
    shipElements.forEach((ship) => {
      ship.classList.toggle("vertical");
      ship.dataset.isVertical = Number(ship.dataset.isVertical) ? 0 : 1;
    });
  });

  const gb = (0,_components_board__WEBPACK_IMPORTED_MODULE_0__["default"])(player.gb.body);
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
        new _ship__WEBPACK_IMPORTED_MODULE_2__["default"](length)
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
        ship.style.backgroundColor = "white";
        // Displays the ships on the main gameBoard
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

  placeRandomShips(computer.gb, ships);
};

const endGame = (playerWin) => {
  const modal = createModal();
  modal.innerHTML = `
     <div class="modal-content">
     <p>${playerWin ? "You wins!" : "Computer wins!"}</p>
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
  const p1 = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]("p1");
  const bot = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]("bot", true);
  const newBoard = (0,_components_board__WEBPACK_IMPORTED_MODULE_0__["default"])(p1.gb.body);
  openingModal(p1, newBoard, bot);

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
    const attackedCell = newBoard.find(
      (div) => div.dataset.coordinates === JSON.stringify(enemyCoord)
    );

    markCell(attackedCell, enemySuccess);
    if (p1.gb.areAllSunked() || hasNoMovesLeft(this)) {
      endGame(false);
    }
  };

  const botBoard = (0,_components_board__WEBPACK_IMPORTED_MODULE_0__["default"])(bot.gb.body, onCellClick);

  document.querySelector("#player").replaceChildren(...newBoard);
  document.querySelector("#computer").replaceChildren(...botBoard);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameLoop);


/***/ }),

/***/ "./src/modules/gameBoard.js":
/*!**********************************!*\
  !*** ./src/modules/gameBoard.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GameBoard)
/* harmony export */ });
const SIZE = 10;

function GameBoard() {
  // Fills 100 cells with null. Map is important in order to create new array and not just a reference
  const body = new Array(SIZE).fill(null).map(() => new Array(SIZE).fill(null));
  const _shipArray = [];
  const _missedAttacks = [];
  const _hitAttacks = [];

  const shipCoordinates = (col, row, isVertical, length) => {
    const arr = [];
    for (let i = 0; i < length; i += 1) {
      arr.push(isVertical ? [row + i, col] : [row, col + i]);
    }
    return arr;
  };

  const placeShip = ({ x: col, y: row, isVertical }, ship) => {
    const coordinates = shipCoordinates(col, row, isVertical, ship.length);
    // * Check if there is already another ship there
    const isAvailable = coordinates.every(
      ([y, x]) =>
        body[y] !== undefined && body[y][x] !== undefined && !body[y][x]
    );
    if (!isAvailable) return false;
    coordinates.forEach((coord) => {
      const [y, x] = coord;
      body[y][x] = true;
    });
    _shipArray.push({ coordinates, ship });
    return true;
  };

  const receiveAttack = (coor) => {
    const [row, col] = coor;
    // check if already been placed/missed same spot
    if (_missedAttacks.filter(([y, x]) => y === row && x === col).length)
      return false;
    if (_hitAttacks.filter(([y, x]) => y === row && x === col).length)
      return false;
    // record the coordinate of missed shot
    if (!body[row][col]) {
      _missedAttacks.push([row, col]);
      return false;
    }
    // send hit function to ship
    let index = null;
    const shipObject = _shipArray.find((obj) =>
      obj.coordinates.find(([y, x], idx) => {
        if (y === coor[0] && x === coor[1]) {
          index = idx;
          return true;
        }
      })
    );
    _hitAttacks.push(coor);
    shipObject.ship.hit(index);
    return true;
  };

  const getMissedAttacks = () => _missedAttacks;

  const areAllSunked = () => {
    return _shipArray.every(({ ship }) => ship.isSunk());
  };

  return { body, placeShip, receiveAttack, getMissedAttacks, areAllSunked };
}


/***/ }),

/***/ "./src/modules/ship.js":
/*!*****************************!*\
  !*** ./src/modules/ship.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ship)
/* harmony export */ });
function Ship(len = 3) {
  const body = new Array(len).fill(false);

  const { length } = body;
  const hit = (position) => {
    if (body[position]) return false;
    body[position] = true;
    return body[position];
  };

  const isSunk = () => body.every((part) => part);

  return { length, hit, isSunk };
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/game */ "./src/modules/game.js");


window.addEventListener("DOMContentLoaded", _modules_game__WEBPACK_IMPORTED_MODULE_0__["default"]);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBOztBQUVBLGlFQUFlLFFBQVEsRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDL094Qjs7QUFFZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixZQUFZO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1Qiw0QkFBNEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsc0JBQXNCLG1CQUFtQjtBQUN6QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLCtCQUErQixNQUFNO0FBQ3JDOztBQUVBLFdBQVc7QUFDWDs7Ozs7Ozs7Ozs7Ozs7O0FDbkVlO0FBQ2Y7O0FBRUEsVUFBVSxTQUFTO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsV0FBVztBQUNYOzs7Ozs7O1VDYkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05zQzs7QUFFdEMsNENBQTRDLHFEQUFRIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL1BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvY29tcG9uZW50cy9ib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZUJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZUJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gICNwb3NzaWJsZU1vdmVzID0gW107XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGlzQ29tcHV0ZXIpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuaXNDb21wdXRlciA9IGlzQ29tcHV0ZXI7XG4gICAgdGhpcy5nYiA9IG5ldyBHYW1lQm9hcmQoKTtcbiAgICBpZiAodGhpcy5pc0NvbXB1dGVyKSB7XG4gICAgICB0aGlzLiNwb3NzaWJsZU1vdmVzID0gdGhpcy5nZW5lcmF0ZU1vdmVzKHRoaXMuZ2IuYm9keS5sZW5ndGgpO1xuICAgIH1cbiAgfVxuICBnZXQgcG9zc2libGVNb3ZlcygpIHtcbiAgICByZXR1cm4gdGhpcy4jcG9zc2libGVNb3ZlcztcbiAgfVxuICBnZW5lcmF0ZU1vdmVzKGxlbikge1xuICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsZW47IGorKykge1xuICAgICAgICBhcnJheS5wdXNoKFtpLCBqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuICBhdHRhY2tFbmVteShjb29yZCwgZW5lbXkpIHtcbiAgICAvLyBhdHRhY2sgdGhlIGVuZW15IHNoaXBcbiAgICByZXR1cm4gZW5lbXkuZ2IucmVjZWl2ZUF0dGFjayhjb29yZCk7XG4gIH1cbiAgYXR0YWNrUmFuZG9tbHkoZW5lbXkpIHtcbiAgICBpZiAoIXRoaXMuaXNDb21wdXRlcikgcmV0dXJuIFtdO1xuICAgIC8vIFBpY2tzIGEgcmFuZG9tIG51bWJlciBmcm9tIHRoZSBsaXN0IGFuZCByZW1vdmVzIGl0XG4gICAgY29uc3QgcmFuZEludCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuI3Bvc3NpYmxlTW92ZXMubGVuZ3RoKTtcbiAgICBjb25zdCBbY29vcmRdID0gdGhpcy4jcG9zc2libGVNb3Zlcy5zcGxpY2UocmFuZEludCwgMSk7XG4gICAgY29uc3Qgc3VjY2VzcyA9IHRoaXMuYXR0YWNrRW5lbXkoY29vcmQsIGVuZW15KTtcbiAgICByZXR1cm4geyBjb29yZCwgaGl0OiBzdWNjZXNzIH07XG4gIH1cbiAgaXNHYW1lT3ZlcigpIHtcbiAgICAvLyBJZiB0aGVyZSBhcmUgbm8gbW92ZXMgbGVmdFxuICAgIHJldHVybiAhdGhpcy4jcG9zc2libGVNb3Zlcy5sZW5ndGg7XG4gIH1cbn1cbiIsImNvbnN0IGdlbmVyYXRlQm9hcmQgPSAoYm9hcmQsIGNiKSA9PiB7XG4gIC8vICogZ2VuZXJhdGVzIGEgZ3JpZCBCb2FyZFxuICBjb25zdCBhcnJheSA9IFtdO1xuICBib2FyZC5mb3JFYWNoKChyb3csIHJvd0lkeCkgPT4ge1xuICAgIHJvdy5mb3JFYWNoKChjb2x1bW4sIGNvbElkeCkgPT4ge1xuICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBjZWxsLmRhdGFzZXQuY29vcmRpbmF0ZXMgPSBKU09OLnN0cmluZ2lmeShbcm93SWR4LCBjb2xJZHhdKTtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICBjZWxsLmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgaWYgKGNiKSB7XG4gICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNiKTtcbiAgICAgIH1cbiAgICAgIGFycmF5LnB1c2goY2VsbCk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gYXJyYXk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZUJvYXJkO1xuIiwiLyogXG5UT0RPIEZpbmlzaCB1cCB0aGUgVUlcblRPRE8gUmVmYWN0b3JcbiovXG5cbmltcG9ydCBnZW5lcmF0ZUJvYXJkIGZyb20gXCIuL2NvbXBvbmVudHMvYm9hcmRcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vUGxheWVyXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmNvbnN0IGhhc05vTW92ZXNMZWZ0ID0gKGNlbGwpID0+IHtcbiAgcmV0dXJuICFjZWxsLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5hY3RpdmVcIikubGVuZ3RoO1xufTtcblxuY29uc3QgY3JlYXRlTW9kYWwgPSAoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZChcIm1vZGFsXCIpO1xuICByZXR1cm4gbW9kYWw7XG59O1xuXG5jb25zdCBvbkRyYWcgPSAoZSkgPT4ge1xuICBjb25zdCBtZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkoZS50YXJnZXQuZGF0YXNldCk7XG4gIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJ0ZXh0L3BsYWluXCIsIG1lc3NhZ2UpO1xuICBlLnRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMC41O1xufTtcblxuY29uc3Qgb25EcmFnRW5kID0gKGUpID0+IHtcbiAgZS50YXJnZXQuc3R5bGUub3BhY2l0eSA9IDE7XG59O1xuXG5jb25zdCBtYWtlU2hpcEVsZW1lbnQgPSAoW3NoaXBOYW1lLCBsZW5ndGhdKSA9PiB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICBlbGVtZW50LmRhdGFzZXQuc2hpcE5hbWUgPSBzaGlwTmFtZTtcbiAgZWxlbWVudC5kYXRhc2V0LnNoaXBMZW5ndGggPSBsZW5ndGg7XG4gIGVsZW1lbnQuZGF0YXNldC5pc1ZlcnRpY2FsID0gMDtcbiAgZWxlbWVudC5kcmFnZ2FibGUgPSB0cnVlO1xuICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgb25EcmFnKTtcbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VuZFwiLCBvbkRyYWdFbmQpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNlbGwpO1xuICB9XG4gIHJldHVybiBlbGVtZW50O1xufTtcbmNvbnN0IHNoaXBDb29yZGluYXRlcyA9IChjb2wsIHJvdywgaXNWZXJ0aWNhbCwgbGVuZ3RoKSA9PiB7XG4gIGNvbnN0IGFyciA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgYXJyLnB1c2goaXNWZXJ0aWNhbCA/IFtyb3cgKyBpLCBjb2xdIDogW3JvdywgY29sICsgaV0pO1xuICB9XG4gIHJldHVybiBhcnI7XG59O1xuY29uc3QgZ2V0UmFuZG9tQ29vcmRpbmF0ZSA9IChsZW4pID0+IHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxlbik7XG59O1xuXG4vLyBQbGFjZXMgcmFuZG9taXplZCBjb29yZGluYXRlcyBvbiBlbmVteSBTaGlwc1xuY29uc3QgcGxhY2VSYW5kb21TaGlwcyA9IChnYW1lQm9hcmQsIHNoaXBzKSA9PiB7XG4gIE9iamVjdC52YWx1ZXMoc2hpcHMpLmZvckVhY2goKHNoaXBMZW5ndGgpID0+IHtcbiAgICBsZXQgaXNTdWNjZXNzID0gZmFsc2U7XG4gICAgd2hpbGUgKCFpc1N1Y2Nlc3MpIHtcbiAgICAgIGNvbnN0IGNvbCA9IGdldFJhbmRvbUNvb3JkaW5hdGUoZ2FtZUJvYXJkLmJvZHkubGVuZ3RoKTtcbiAgICAgIGNvbnN0IHJvdyA9IGdldFJhbmRvbUNvb3JkaW5hdGUoZ2FtZUJvYXJkLmJvZHkubGVuZ3RoKTtcbiAgICAgIGNvbnN0IGlzVmVydGljYWwgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpO1xuICAgICAgY29uc3QgbmV3U2hpcCA9IG5ldyBTaGlwKHNoaXBMZW5ndGgpO1xuICAgICAgaXNTdWNjZXNzID0gZ2FtZUJvYXJkLnBsYWNlU2hpcCh7IHg6IGNvbCwgeTogcm93LCBpc1ZlcnRpY2FsIH0sIG5ld1NoaXApO1xuICAgIH1cbiAgfSk7XG59O1xuXG5jb25zdCBvcGVuaW5nTW9kYWwgPSAocGxheWVyLCBib2FyZCwgY29tcHV0ZXIpID0+IHtcbiAgY29uc3Qgc2hpcHMgPSB7XG4gICAgQ2FycmllcjogNSxcbiAgICBCYXR0bGVzaGlwOiA0LFxuICAgIERlc3Ryb3llcjogMyxcbiAgICBTdWJtYXJpbmU6IDMsXG4gICAgXCJQYXRyb2wgQm9hdFwiOiAyLFxuICB9O1xuXG4gIGNvbnN0IG1vZGFsID0gY3JlYXRlTW9kYWwoKTtcbiAgbW9kYWwuaW5uZXJIVE1MID0gYFxuICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICA8cD5XZWxjb21lIHRvIEJhdHRsZXNoaXA8L3A+XG4gIDxkaXYgY2xhc3M9XCJ3cmFwcGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1pbmktZ2FtZWJvYXJkXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNoaXBzXCI+XG4gICAgICAgIDxwPlBsYWNlIHlvdXIgc2hpcHMgYnkgZHJhZ2dpbmcgYW5kIGRyb3BwaW5nIGl0IGludG8gdGhlIGJvYXJkPC9wPlxuICAgICAgICA8YnV0dG9uPlJvdGF0ZSDwn5SDPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuICA8L2Rpdj5cbiAgYDtcblxuICBjb25zdCBzaGlwc0NvbnRhaW5lciA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcHNcIik7XG5cbiAgY29uc3Qgc2hpcEVsZW1lbnRzID0gT2JqZWN0LmVudHJpZXMoc2hpcHMpLm1hcChtYWtlU2hpcEVsZW1lbnQpO1xuICBzaGlwc0NvbnRhaW5lci5hcHBlbmQoLi4uc2hpcEVsZW1lbnRzKTtcblxuICBjb25zdCByb3RhdGUgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uXCIpO1xuICByb3RhdGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBzaGlwRWxlbWVudHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgc2hpcC5jbGFzc0xpc3QudG9nZ2xlKFwidmVydGljYWxcIik7XG4gICAgICBzaGlwLmRhdGFzZXQuaXNWZXJ0aWNhbCA9IE51bWJlcihzaGlwLmRhdGFzZXQuaXNWZXJ0aWNhbCkgPyAwIDogMTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgY29uc3QgZ2IgPSBnZW5lcmF0ZUJvYXJkKHBsYXllci5nYi5ib2R5KTtcbiAgZ2IuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbnRlclwiLCAoZSkgPT4ge1xuICAgICAgZS50YXJnZXQuc3R5bGUub3BhY2l0eSA9IDAuNTtcbiAgICB9KTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgKGUpID0+IHtcbiAgICAgIGUudGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgIH0pO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS50YXJnZXQuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICBjb25zdCBbeSwgeF0gPSBKU09OLnBhcnNlKGUudGFyZ2V0LmRhdGFzZXQuY29vcmRpbmF0ZXMpO1xuICAgICAgbGV0IHtcbiAgICAgICAgc2hpcE5hbWUsXG4gICAgICAgIHNoaXBMZW5ndGg6IGxlbmd0aCxcbiAgICAgICAgaXNWZXJ0aWNhbCxcbiAgICAgIH0gPSBKU09OLnBhcnNlKGUuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJ0ZXh0XCIpKTtcbiAgICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpO1xuICAgICAgaXNWZXJ0aWNhbCA9IE51bWJlcihpc1ZlcnRpY2FsKTtcblxuICAgICAgY29uc3QgcG9zc2liZUNvb3JkaW5hdGVzID0gc2hpcENvb3JkaW5hdGVzKHgsIHksIGlzVmVydGljYWwsIGxlbmd0aCk7XG4gICAgICBjb25zdCBpc1NoaXBTdWNjZXNzZnVsID0gcGxheWVyLmdiLnBsYWNlU2hpcChcbiAgICAgICAge1xuICAgICAgICAgIHgsXG4gICAgICAgICAgeSxcbiAgICAgICAgICBpc1ZlcnRpY2FsLFxuICAgICAgICB9LFxuICAgICAgICBuZXcgU2hpcChsZW5ndGgpXG4gICAgICApO1xuXG4gICAgICBpZiAoIWlzU2hpcFN1Y2Nlc3NmdWwpIHJldHVybjtcbiAgICAgIGNvbnN0IG15Q29vcmQgPSBnYi5maWx0ZXIoKGNlbGwpID0+IHtcbiAgICAgICAgY29uc3QgW3ksIHhdID0gSlNPTi5wYXJzZShjZWxsLmRhdGFzZXQuY29vcmRpbmF0ZXMpO1xuICAgICAgICBmb3IgKGNvbnN0IFtyb3csIGNvbF0gb2YgcG9zc2liZUNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgaWYgKHJvdyA9PT0geSAmJiBjb2wgPT09IHgpIHtcbiAgICAgICAgICAgIHJldHVybiBjZWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIERpc3BsYXkgdGhlIHNoaXBzXG4gICAgICBteUNvb3JkLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgc2hpcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgIC8vIERpc3BsYXlzIHRoZSBzaGlwcyBvbiB0aGUgbWFpbiBnYW1lQm9hcmRcbiAgICAgICAgYm9hcmQuZmluZChcbiAgICAgICAgICAobWFpblNoaXApID0+XG4gICAgICAgICAgICBtYWluU2hpcC5kYXRhc2V0LmNvb3JkaW5hdGVzID09PSBzaGlwLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICB9KTtcblxuICAgICAgLy8gUmVtb3ZlcyB0aGUgU2hpcFxuICAgICAgY29uc3Qgc2hpcE5vZGUgPSBzaGlwc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgW2RhdGEtc2hpcC1uYW1lPVwiJHtzaGlwTmFtZX1cImBcbiAgICAgICk7XG4gICAgICBzaGlwTm9kZS5yZW1vdmUoKTtcblxuICAgICAgLy8gQ2hlY2sgaWYgU2hpcHMgYXJlIHN0aWxsIHByZXNlbnQgb24gc2hpcFxuICAgICAgaWYgKCFzaGlwc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLnNoaXBcIikpIHtcbiAgICAgICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIubWluaS1nYW1lYm9hcmRcIikuYXBwZW5kKC4uLmdiKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbCk7XG5cbiAgcGxhY2VSYW5kb21TaGlwcyhjb21wdXRlci5nYiwgc2hpcHMpO1xufTtcblxuY29uc3QgZW5kR2FtZSA9IChwbGF5ZXJXaW4pID0+IHtcbiAgY29uc3QgbW9kYWwgPSBjcmVhdGVNb2RhbCgpO1xuICBtb2RhbC5pbm5lckhUTUwgPSBgXG4gICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgIDxwPiR7cGxheWVyV2luID8gXCJZb3Ugd2lucyFcIiA6IFwiQ29tcHV0ZXIgd2lucyFcIn08L3A+XG4gICAgIDxidXR0b24+UGxheSBBZ2FpbjwvYnV0dG9uPlxuICAgPC9kaXY+XG4gICAgIGA7XG4gIG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBnYW1lTG9vcCgpO1xuICB9KTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbCk7XG59O1xuXG4vLyBtZXRob2QgdGhhdCBtYXJrcyB0aGUgY2VsbFxuY29uc3QgbWFya0NlbGwgPSAoY2VsbCwgaXNTaGlwKSA9PiB7XG4gIGNlbGwuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gIGlmIChpc1NoaXApIHtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJpc1NoaXBcIik7XG4gIH1cbn07XG5cbmNvbnN0IGdhbWVMb29wID0gKCkgPT4ge1xuICBjb25zdCBwMSA9IG5ldyBQbGF5ZXIoXCJwMVwiKTtcbiAgY29uc3QgYm90ID0gbmV3IFBsYXllcihcImJvdFwiLCB0cnVlKTtcbiAgY29uc3QgbmV3Qm9hcmQgPSBnZW5lcmF0ZUJvYXJkKHAxLmdiLmJvZHkpO1xuICBvcGVuaW5nTW9kYWwocDEsIG5ld0JvYXJkLCBib3QpO1xuXG4gIC8vICAgcDEuZ2IucGxhY2VTaGlwKHsgeDogMCwgeTogMCB9LCBuZXcgU2hpcCgpKTtcbiAgLy8gICBib3QuZ2IucGxhY2VTaGlwKHsgeDogMSwgeTogMSB9LCBuZXcgU2hpcCgpKTtcblxuICBjb25zdCBvbkNlbGxDbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBjbGlja2VkQ29vcmQgPSBKU09OLnBhcnNlKHRoaXMuZGF0YXNldC5jb29yZGluYXRlcyk7XG4gICAgLy8gUmV0dXJucyBib29sIHNoaXAgaXMgaGl0XG4gICAgY29uc3Qgc3VjY2VzcyA9IHAxLmF0dGFja0VuZW15KGNsaWNrZWRDb29yZCwgYm90KTtcbiAgICBtYXJrQ2VsbCh0aGlzLCBzdWNjZXNzKTtcblxuICAgIGlmIChib3QuZ2IuYXJlQWxsU3Vua2VkKCkgfHwgYm90LmlzR2FtZU92ZXIoKSkge1xuICAgICAgZW5kR2FtZSh0cnVlKTtcbiAgICB9XG5cbiAgICAvLyBFbmVteSBDb21wXG4gICAgY29uc3QgeyBjb29yZDogZW5lbXlDb29yZCwgaGl0OiBlbmVteVN1Y2Nlc3MgfSA9IGJvdC5hdHRhY2tSYW5kb21seShwMSk7XG4gICAgY29uc3QgYXR0YWNrZWRDZWxsID0gbmV3Qm9hcmQuZmluZChcbiAgICAgIChkaXYpID0+IGRpdi5kYXRhc2V0LmNvb3JkaW5hdGVzID09PSBKU09OLnN0cmluZ2lmeShlbmVteUNvb3JkKVxuICAgICk7XG5cbiAgICBtYXJrQ2VsbChhdHRhY2tlZENlbGwsIGVuZW15U3VjY2Vzcyk7XG4gICAgaWYgKHAxLmdiLmFyZUFsbFN1bmtlZCgpIHx8IGhhc05vTW92ZXNMZWZ0KHRoaXMpKSB7XG4gICAgICBlbmRHYW1lKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYm90Qm9hcmQgPSBnZW5lcmF0ZUJvYXJkKGJvdC5nYi5ib2R5LCBvbkNlbGxDbGljayk7XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwbGF5ZXJcIikucmVwbGFjZUNoaWxkcmVuKC4uLm5ld0JvYXJkKTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb21wdXRlclwiKS5yZXBsYWNlQ2hpbGRyZW4oLi4uYm90Qm9hcmQpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZUxvb3A7XG4iLCJjb25zdCBTSVpFID0gMTA7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdhbWVCb2FyZCgpIHtcbiAgLy8gRmlsbHMgMTAwIGNlbGxzIHdpdGggbnVsbC4gTWFwIGlzIGltcG9ydGFudCBpbiBvcmRlciB0byBjcmVhdGUgbmV3IGFycmF5IGFuZCBub3QganVzdCBhIHJlZmVyZW5jZVxuICBjb25zdCBib2R5ID0gbmV3IEFycmF5KFNJWkUpLmZpbGwobnVsbCkubWFwKCgpID0+IG5ldyBBcnJheShTSVpFKS5maWxsKG51bGwpKTtcbiAgY29uc3QgX3NoaXBBcnJheSA9IFtdO1xuICBjb25zdCBfbWlzc2VkQXR0YWNrcyA9IFtdO1xuICBjb25zdCBfaGl0QXR0YWNrcyA9IFtdO1xuXG4gIGNvbnN0IHNoaXBDb29yZGluYXRlcyA9IChjb2wsIHJvdywgaXNWZXJ0aWNhbCwgbGVuZ3RoKSA9PiB7XG4gICAgY29uc3QgYXJyID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgYXJyLnB1c2goaXNWZXJ0aWNhbCA/IFtyb3cgKyBpLCBjb2xdIDogW3JvdywgY29sICsgaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9ICh7IHg6IGNvbCwgeTogcm93LCBpc1ZlcnRpY2FsIH0sIHNoaXApID0+IHtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHNoaXBDb29yZGluYXRlcyhjb2wsIHJvdywgaXNWZXJ0aWNhbCwgc2hpcC5sZW5ndGgpO1xuICAgIC8vICogQ2hlY2sgaWYgdGhlcmUgaXMgYWxyZWFkeSBhbm90aGVyIHNoaXAgdGhlcmVcbiAgICBjb25zdCBpc0F2YWlsYWJsZSA9IGNvb3JkaW5hdGVzLmV2ZXJ5KFxuICAgICAgKFt5LCB4XSkgPT5cbiAgICAgICAgYm9keVt5XSAhPT0gdW5kZWZpbmVkICYmIGJvZHlbeV1beF0gIT09IHVuZGVmaW5lZCAmJiAhYm9keVt5XVt4XVxuICAgICk7XG4gICAgaWYgKCFpc0F2YWlsYWJsZSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICBjb25zdCBbeSwgeF0gPSBjb29yZDtcbiAgICAgIGJvZHlbeV1beF0gPSB0cnVlO1xuICAgIH0pO1xuICAgIF9zaGlwQXJyYXkucHVzaCh7IGNvb3JkaW5hdGVzLCBzaGlwIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAoY29vcikgPT4ge1xuICAgIGNvbnN0IFtyb3csIGNvbF0gPSBjb29yO1xuICAgIC8vIGNoZWNrIGlmIGFscmVhZHkgYmVlbiBwbGFjZWQvbWlzc2VkIHNhbWUgc3BvdFxuICAgIGlmIChfbWlzc2VkQXR0YWNrcy5maWx0ZXIoKFt5LCB4XSkgPT4geSA9PT0gcm93ICYmIHggPT09IGNvbCkubGVuZ3RoKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChfaGl0QXR0YWNrcy5maWx0ZXIoKFt5LCB4XSkgPT4geSA9PT0gcm93ICYmIHggPT09IGNvbCkubGVuZ3RoKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIHJlY29yZCB0aGUgY29vcmRpbmF0ZSBvZiBtaXNzZWQgc2hvdFxuICAgIGlmICghYm9keVtyb3ddW2NvbF0pIHtcbiAgICAgIF9taXNzZWRBdHRhY2tzLnB1c2goW3JvdywgY29sXSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIHNlbmQgaGl0IGZ1bmN0aW9uIHRvIHNoaXBcbiAgICBsZXQgaW5kZXggPSBudWxsO1xuICAgIGNvbnN0IHNoaXBPYmplY3QgPSBfc2hpcEFycmF5LmZpbmQoKG9iaikgPT5cbiAgICAgIG9iai5jb29yZGluYXRlcy5maW5kKChbeSwgeF0sIGlkeCkgPT4ge1xuICAgICAgICBpZiAoeSA9PT0gY29vclswXSAmJiB4ID09PSBjb29yWzFdKSB7XG4gICAgICAgICAgaW5kZXggPSBpZHg7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgICBfaGl0QXR0YWNrcy5wdXNoKGNvb3IpO1xuICAgIHNoaXBPYmplY3Quc2hpcC5oaXQoaW5kZXgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGdldE1pc3NlZEF0dGFja3MgPSAoKSA9PiBfbWlzc2VkQXR0YWNrcztcblxuICBjb25zdCBhcmVBbGxTdW5rZWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIF9zaGlwQXJyYXkuZXZlcnkoKHsgc2hpcCB9KSA9PiBzaGlwLmlzU3VuaygpKTtcbiAgfTtcblxuICByZXR1cm4geyBib2R5LCBwbGFjZVNoaXAsIHJlY2VpdmVBdHRhY2ssIGdldE1pc3NlZEF0dGFja3MsIGFyZUFsbFN1bmtlZCB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2hpcChsZW4gPSAzKSB7XG4gIGNvbnN0IGJvZHkgPSBuZXcgQXJyYXkobGVuKS5maWxsKGZhbHNlKTtcblxuICBjb25zdCB7IGxlbmd0aCB9ID0gYm9keTtcbiAgY29uc3QgaGl0ID0gKHBvc2l0aW9uKSA9PiB7XG4gICAgaWYgKGJvZHlbcG9zaXRpb25dKSByZXR1cm4gZmFsc2U7XG4gICAgYm9keVtwb3NpdGlvbl0gPSB0cnVlO1xuICAgIHJldHVybiBib2R5W3Bvc2l0aW9uXTtcbiAgfTtcblxuICBjb25zdCBpc1N1bmsgPSAoKSA9PiBib2R5LmV2ZXJ5KChwYXJ0KSA9PiBwYXJ0KTtcblxuICByZXR1cm4geyBsZW5ndGgsIGhpdCwgaXNTdW5rIH07XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBnYW1lTG9vcCBmcm9tIFwiLi9tb2R1bGVzL2dhbWVcIjtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGdhbWVMb29wKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==