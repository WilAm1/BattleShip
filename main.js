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
/* harmony import */ var _gameBoard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gameBoard */ "./src/modules/gameBoard.js");
/* 
* Refactor (Marking functions)
* Add Ending Game and remove alerts
TODO Add Initialize ships
TODO Display Own Ships
TODO Add Randomize enemy ships
TODO Inherit Player Class Computer Class
*/






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
  <span></span>
  <div class="wrapper">
    <div class="mini-gameboard"></div>
    <div class="ships">
        <button>Rotate 🔃</button>
    </div>
  </div>
  </div>
  `;
  const shipsContainer = modal.querySelector(".ships");
  // TODO Add draggable Ships
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
      ship.dataset.isVertical = ship.dataset.isVertical ? 0 : 1;
    });
  });

  // TODO HOVER it to the GameBoard
  // TODO on drag-end Place the ship on the Board
  // Add function that will populate ships on the player side!
  // Must be able to display the ships
  // Ship names
  // Populate with predetermined coordinates

  const gb = (0,_components_board__WEBPACK_IMPORTED_MODULE_0__["default"])(player.gb.body);
  gb.forEach((cell) => {
    cell.addEventListener("dragenter", (e) => {
      e.target.style.backgroundColor = "green";
    });
    cell.addEventListener("dragleave", (e) => {
      e.target.style.backgroundColor = "";
    });
    cell.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    cell.addEventListener("drop", (e) => {
      e.preventDefault();
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
      console.log(possibeCoordinates);
      if (isShipSuccessful) {
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
          console.log(ship);
          board.find(
            (mainShip) =>
              mainShip.dataset.coordinates === ship.dataset.coordinates
          ).style.backgroundColor = "white";
        });
      }
    });
  });
  modal.querySelector(".mini-gameboard").append(...gb);
  document.body.appendChild(modal);
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
  const p1 = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]("p1");
  const bot = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]("bot", true);
  const newBoard = (0,_components_board__WEBPACK_IMPORTED_MODULE_0__["default"])(p1.gb.body);
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
      ([y, x]) => !body[y][x] && body[y][x] !== undefined
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

  const length = { body };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCLDRCQUE0QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsc0JBQXNCLG1CQUFtQjtBQUN6QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLCtCQUErQixNQUFNO0FBQ3JDOztBQUVBLFdBQVc7QUFDWDs7Ozs7Ozs7Ozs7Ozs7O0FDbEVlO0FBQ2Y7O0FBRUEsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsV0FBVztBQUNYOzs7Ozs7O1VDYkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05zQzs7QUFFdEMsNENBQTRDLHFEQUFRIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL1BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvY29tcG9uZW50cy9ib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZUJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZUJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gICNwb3NzaWJsZU1vdmVzID0gW107XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGlzQ29tcHV0ZXIpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuaXNDb21wdXRlciA9IGlzQ29tcHV0ZXI7XG4gICAgdGhpcy5nYiA9IG5ldyBHYW1lQm9hcmQoKTtcbiAgICBpZiAodGhpcy5pc0NvbXB1dGVyKSB7XG4gICAgICB0aGlzLiNwb3NzaWJsZU1vdmVzID0gdGhpcy5nZW5lcmF0ZU1vdmVzKHRoaXMuZ2IuYm9keS5sZW5ndGgpO1xuICAgIH1cbiAgfVxuICBnZXQgcG9zc2libGVNb3ZlcygpIHtcbiAgICByZXR1cm4gdGhpcy4jcG9zc2libGVNb3ZlcztcbiAgfVxuICBnZW5lcmF0ZU1vdmVzKGxlbikge1xuICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsZW47IGorKykge1xuICAgICAgICBhcnJheS5wdXNoKFtpLCBqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuICBhdHRhY2tFbmVteShjb29yZCwgZW5lbXkpIHtcbiAgICAvLyBhdHRhY2sgdGhlIGVuZW15IHNoaXBcbiAgICByZXR1cm4gZW5lbXkuZ2IucmVjZWl2ZUF0dGFjayhjb29yZCk7XG4gIH1cbiAgYXR0YWNrUmFuZG9tbHkoZW5lbXkpIHtcbiAgICBpZiAoIXRoaXMuaXNDb21wdXRlcikgcmV0dXJuIFtdO1xuICAgIC8vIFBpY2tzIGEgcmFuZG9tIG51bWJlciBmcm9tIHRoZSBsaXN0IGFuZCByZW1vdmVzIGl0XG4gICAgY29uc3QgcmFuZEludCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuI3Bvc3NpYmxlTW92ZXMubGVuZ3RoKTtcbiAgICBjb25zdCBbY29vcmRdID0gdGhpcy4jcG9zc2libGVNb3Zlcy5zcGxpY2UocmFuZEludCwgMSk7XG4gICAgY29uc3Qgc3VjY2VzcyA9IHRoaXMuYXR0YWNrRW5lbXkoY29vcmQsIGVuZW15KTtcbiAgICByZXR1cm4geyBjb29yZCwgaGl0OiBzdWNjZXNzIH07XG4gIH1cbiAgaXNHYW1lT3ZlcigpIHtcbiAgICAvLyBJZiB0aGVyZSBhcmUgbm8gbW92ZXMgbGVmdFxuICAgIHJldHVybiAhdGhpcy4jcG9zc2libGVNb3Zlcy5sZW5ndGg7XG4gIH1cbn1cbiIsImNvbnN0IGdlbmVyYXRlQm9hcmQgPSAoYm9hcmQsIGNiKSA9PiB7XG4gIC8vICogZ2VuZXJhdGVzIGEgZ3JpZCBCb2FyZFxuICBjb25zdCBhcnJheSA9IFtdO1xuICBib2FyZC5mb3JFYWNoKChyb3csIHJvd0lkeCkgPT4ge1xuICAgIHJvdy5mb3JFYWNoKChjb2x1bW4sIGNvbElkeCkgPT4ge1xuICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBjZWxsLmRhdGFzZXQuY29vcmRpbmF0ZXMgPSBKU09OLnN0cmluZ2lmeShbcm93SWR4LCBjb2xJZHhdKTtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gICAgICBjZWxsLmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgaWYgKGNiKSB7XG4gICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNiKTtcbiAgICAgIH1cbiAgICAgIGFycmF5LnB1c2goY2VsbCk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gYXJyYXk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZUJvYXJkO1xuIiwiLyogXG4qIFJlZmFjdG9yIChNYXJraW5nIGZ1bmN0aW9ucylcbiogQWRkIEVuZGluZyBHYW1lIGFuZCByZW1vdmUgYWxlcnRzXG5UT0RPIEFkZCBJbml0aWFsaXplIHNoaXBzXG5UT0RPIERpc3BsYXkgT3duIFNoaXBzXG5UT0RPIEFkZCBSYW5kb21pemUgZW5lbXkgc2hpcHNcblRPRE8gSW5oZXJpdCBQbGF5ZXIgQ2xhc3MgQ29tcHV0ZXIgQ2xhc3NcbiovXG5cbmltcG9ydCBnZW5lcmF0ZUJvYXJkIGZyb20gXCIuL2NvbXBvbmVudHMvYm9hcmRcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vUGxheWVyXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5pbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuXG5jb25zdCBoYXNOb01vdmVzTGVmdCA9IChjZWxsKSA9PiB7XG4gIHJldHVybiAhY2VsbC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYWN0aXZlXCIpLmxlbmd0aDtcbn07XG5cbmNvbnN0IGNyZWF0ZU1vZGFsID0gKCkgPT4ge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIG1vZGFsLmNsYXNzTGlzdC5hZGQoXCJtb2RhbFwiKTtcbiAgcmV0dXJuIG1vZGFsO1xufTtcbi8vICogUmVtb3ZlcyBjaGlsZCB1c2luZyBwYXJlbnRFbGVtZW50LnJlbW9ldkNoaWxkIGFuZCBhcHBlbmRDaGlsZFxuY29uc3Qgb25EcmFnID0gKGUpID0+IHtcbiAgY29uc3QgbWVzc2FnZSA9IEpTT04uc3RyaW5naWZ5KGUudGFyZ2V0LmRhdGFzZXQpO1xuICBlLmRhdGFUcmFuc2Zlci5zZXREYXRhKFwidGV4dC9wbGFpblwiLCBtZXNzYWdlKTtcbiAgZS50YXJnZXQuc3R5bGUub3BhY2l0eSA9IDAuNTtcbn07XG5cbmNvbnN0IG9uRHJhZ0VuZCA9IChlKSA9PiB7XG4gIGUudGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAxO1xufTtcbmNvbnN0IG9uRHJvcCA9IChlKSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgY29uc3QgZGF0YSA9IGUuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJ0ZXh0XCIpO1xufTtcbmNvbnN0IG1ha2VTaGlwRWxlbWVudCA9IChbc2hpcE5hbWUsIGxlbmd0aF0pID0+IHtcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG4gIGVsZW1lbnQuZGF0YXNldC5zaGlwTmFtZSA9IHNoaXBOYW1lO1xuICBlbGVtZW50LmRhdGFzZXQuc2hpcExlbmd0aCA9IGxlbmd0aDtcbiAgZWxlbWVudC5kYXRhc2V0LmlzVmVydGljYWwgPSAwO1xuICBlbGVtZW50LmRyYWdnYWJsZSA9IHRydWU7XG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCBvbkRyYWcpO1xuICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnZW5kXCIsIG9uRHJhZ0VuZCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2VsbCk7XG4gIH1cbiAgcmV0dXJuIGVsZW1lbnQ7XG59O1xuY29uc3Qgc2hpcENvb3JkaW5hdGVzID0gKGNvbCwgcm93LCBpc1ZlcnRpY2FsLCBsZW5ndGgpID0+IHtcbiAgY29uc3QgYXJyID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICBhcnIucHVzaChpc1ZlcnRpY2FsID8gW3JvdyArIGksIGNvbF0gOiBbcm93LCBjb2wgKyBpXSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn07XG5cbmNvbnN0IG9wZW5pbmdNb2RhbCA9IChwbGF5ZXIsIGJvYXJkKSA9PiB7XG4gIC8vaW5pdGlsaWF6ZSBtb2RhbFxuICBjb25zdCBtb2RhbCA9IGNyZWF0ZU1vZGFsKCk7XG4gIC8vIENyZWF0ZSBtb2RlbDtcbiAgbW9kYWwuaW5uZXJIVE1MID0gYFxuICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICA8cD5XZWxjb21lIHRvIEJhdHRsZXNoaXA8L3A+XG4gIDxzcGFuPjwvc3Bhbj5cbiAgPGRpdiBjbGFzcz1cIndyYXBwZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwibWluaS1nYW1lYm9hcmRcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2hpcHNcIj5cbiAgICAgICAgPGJ1dHRvbj5Sb3RhdGUg8J+UgzwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPC9kaXY+XG4gIGA7XG4gIGNvbnN0IHNoaXBzQ29udGFpbmVyID0gbW9kYWwucXVlcnlTZWxlY3RvcihcIi5zaGlwc1wiKTtcbiAgLy8gVE9ETyBBZGQgZHJhZ2dhYmxlIFNoaXBzXG4gIGNvbnN0IHNoaXBzID0ge1xuICAgIENhcnJpZXI6IDUsXG4gICAgQmF0dGxlc2hpcDogNCxcbiAgICBEZXN0cm95ZXI6IDMsXG4gICAgU3VibWFyaW5lOiAzLFxuICAgIFwiUGF0cm9sIEJvYXRcIjogMixcbiAgfTtcblxuICBjb25zdCBzaGlwRWxlbWVudHMgPSBPYmplY3QuZW50cmllcyhzaGlwcykubWFwKG1ha2VTaGlwRWxlbWVudCk7XG4gIHNoaXBzQ29udGFpbmVyLmFwcGVuZCguLi5zaGlwRWxlbWVudHMpO1xuICBjb25zdCByb3RhdGUgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uXCIpO1xuICByb3RhdGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBzaGlwRWxlbWVudHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgc2hpcC5jbGFzc0xpc3QudG9nZ2xlKFwidmVydGljYWxcIik7XG4gICAgICBzaGlwLmRhdGFzZXQuaXNWZXJ0aWNhbCA9IHNoaXAuZGF0YXNldC5pc1ZlcnRpY2FsID8gMCA6IDE7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIFRPRE8gSE9WRVIgaXQgdG8gdGhlIEdhbWVCb2FyZFxuICAvLyBUT0RPIG9uIGRyYWctZW5kIFBsYWNlIHRoZSBzaGlwIG9uIHRoZSBCb2FyZFxuICAvLyBBZGQgZnVuY3Rpb24gdGhhdCB3aWxsIHBvcHVsYXRlIHNoaXBzIG9uIHRoZSBwbGF5ZXIgc2lkZSFcbiAgLy8gTXVzdCBiZSBhYmxlIHRvIGRpc3BsYXkgdGhlIHNoaXBzXG4gIC8vIFNoaXAgbmFtZXNcbiAgLy8gUG9wdWxhdGUgd2l0aCBwcmVkZXRlcm1pbmVkIGNvb3JkaW5hdGVzXG5cbiAgY29uc3QgZ2IgPSBnZW5lcmF0ZUJvYXJkKHBsYXllci5nYi5ib2R5KTtcbiAgZ2IuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbnRlclwiLCAoZSkgPT4ge1xuICAgICAgZS50YXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJncmVlblwiO1xuICAgIH0pO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCAoZSkgPT4ge1xuICAgICAgZS50YXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJcIjtcbiAgICB9KTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IFt5LCB4XSA9IEpTT04ucGFyc2UoZS50YXJnZXQuZGF0YXNldC5jb29yZGluYXRlcyk7XG4gICAgICBsZXQge1xuICAgICAgICBzaGlwTmFtZSxcbiAgICAgICAgc2hpcExlbmd0aDogbGVuZ3RoLFxuICAgICAgICBpc1ZlcnRpY2FsLFxuICAgICAgfSA9IEpTT04ucGFyc2UoZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHRcIikpO1xuICAgICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aCk7XG4gICAgICBpc1ZlcnRpY2FsID0gTnVtYmVyKGlzVmVydGljYWwpO1xuXG4gICAgICBjb25zdCBwb3NzaWJlQ29vcmRpbmF0ZXMgPSBzaGlwQ29vcmRpbmF0ZXMoeCwgeSwgaXNWZXJ0aWNhbCwgbGVuZ3RoKTtcbiAgICAgIGNvbnN0IGlzU2hpcFN1Y2Nlc3NmdWwgPSBwbGF5ZXIuZ2IucGxhY2VTaGlwKFxuICAgICAgICB7XG4gICAgICAgICAgeCxcbiAgICAgICAgICB5LFxuICAgICAgICAgIGlzVmVydGljYWwsXG4gICAgICAgIH0sXG4gICAgICAgIG5ldyBTaGlwKGxlbmd0aClcbiAgICAgICk7XG4gICAgICBjb25zb2xlLmxvZyhwb3NzaWJlQ29vcmRpbmF0ZXMpO1xuICAgICAgaWYgKGlzU2hpcFN1Y2Nlc3NmdWwpIHtcbiAgICAgICAgY29uc3QgbXlDb29yZCA9IGdiLmZpbHRlcigoY2VsbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IFt5LCB4XSA9IEpTT04ucGFyc2UoY2VsbC5kYXRhc2V0LmNvb3JkaW5hdGVzKTtcbiAgICAgICAgICBmb3IgKGNvbnN0IFtyb3csIGNvbF0gb2YgcG9zc2liZUNvb3JkaW5hdGVzKSB7XG4gICAgICAgICAgICBpZiAocm93ID09PSB5ICYmIGNvbCA9PT0geCkge1xuICAgICAgICAgICAgICByZXR1cm4gY2VsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBEaXNwcGxheSB0aGUgc2hpcHNcbiAgICAgICAgbXlDb29yZC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICAgICAgc2hpcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgY29uc29sZS5sb2coc2hpcCk7XG4gICAgICAgICAgYm9hcmQuZmluZChcbiAgICAgICAgICAgIChtYWluU2hpcCkgPT5cbiAgICAgICAgICAgICAgbWFpblNoaXAuZGF0YXNldC5jb29yZGluYXRlcyA9PT0gc2hpcC5kYXRhc2V0LmNvb3JkaW5hdGVzXG4gICAgICAgICAgKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbiAgbW9kYWwucXVlcnlTZWxlY3RvcihcIi5taW5pLWdhbWVib2FyZFwiKS5hcHBlbmQoLi4uZ2IpO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZGFsKTtcbn07XG5cbmNvbnN0IGVuZEdhbWUgPSAocGxheWVyV2luKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gY3JlYXRlTW9kYWwoKTtcbiAgbW9kYWwuaW5uZXJIVE1MID0gYFxuICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICAgICA8cD4ke3BsYXllcldpbiA/IFwiWW91IHdpbiFcIiA6IFwiQ29tcCB3aW4hXCJ9PC9wPlxuICAgICA8YnV0dG9uPlBsYXkgQWdhaW48L2J1dHRvbj5cbiAgIDwvZGl2PlxuICAgICBgO1xuICBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgZ2FtZUxvb3AoKTtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgfSk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobW9kYWwpO1xufTtcblxuLy8gbWV0aG9kIHRoYXQgbWFya3MgdGhlIGNlbGxcbmNvbnN0IG1hcmtDZWxsID0gKGNlbGwsIGlzU2hpcCkgPT4ge1xuICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcbiAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICBpZiAoaXNTaGlwKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaXNTaGlwXCIpO1xuICB9XG59O1xuXG5jb25zdCBnYW1lTG9vcCA9ICgpID0+IHtcbiAgY29uc3QgcDEgPSBuZXcgUGxheWVyKFwicDFcIik7XG4gIGNvbnN0IGJvdCA9IG5ldyBQbGF5ZXIoXCJib3RcIiwgdHJ1ZSk7XG4gIGNvbnN0IG5ld0JvYXJkID0gZ2VuZXJhdGVCb2FyZChwMS5nYi5ib2R5KTtcbiAgb3BlbmluZ01vZGFsKHAxLCBuZXdCb2FyZCk7XG5cbiAgLy8gICBwMS5nYi5wbGFjZVNoaXAoeyB4OiAwLCB5OiAwIH0sIG5ldyBTaGlwKCkpO1xuICAvLyAgIGJvdC5nYi5wbGFjZVNoaXAoeyB4OiAxLCB5OiAxIH0sIG5ldyBTaGlwKCkpO1xuXG4gIGNvbnN0IG9uQ2VsbENsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGNsaWNrZWRDb29yZCA9IEpTT04ucGFyc2UodGhpcy5kYXRhc2V0LmNvb3JkaW5hdGVzKTtcbiAgICAvLyBSZXR1cm5zIGJvb2wgc2hpcCBpcyBoaXRcbiAgICBjb25zdCBzdWNjZXNzID0gcDEuYXR0YWNrRW5lbXkoY2xpY2tlZENvb3JkLCBib3QpO1xuICAgIG1hcmtDZWxsKHRoaXMsIHN1Y2Nlc3MpO1xuXG4gICAgaWYgKGJvdC5nYi5hcmVBbGxTdW5rZWQoKSB8fCBib3QuaXNHYW1lT3ZlcigpKSB7XG4gICAgICBlbmRHYW1lKHRydWUpO1xuICAgIH1cblxuICAgIC8vIEVuZW15IENvbXBcbiAgICBjb25zdCB7IGNvb3JkOiBlbmVteUNvb3JkLCBoaXQ6IGVuZW15U3VjY2VzcyB9ID0gYm90LmF0dGFja1JhbmRvbWx5KHAxKTtcbiAgICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShlbmVteUNvb3JkKSk7XG4gICAgY29uc3QgYXR0YWNrZWRDZWxsID0gbmV3Qm9hcmQuZmluZChcbiAgICAgIChkaXYpID0+IGRpdi5kYXRhc2V0LmNvb3JkaW5hdGVzID09PSBKU09OLnN0cmluZ2lmeShlbmVteUNvb3JkKVxuICAgICk7XG5cbiAgICBtYXJrQ2VsbChhdHRhY2tlZENlbGwsIGVuZW15U3VjY2Vzcyk7XG4gICAgaWYgKHAxLmdiLmFyZUFsbFN1bmtlZCgpIHx8IGhhc05vTW92ZXNMZWZ0KHRoaXMpKSB7XG4gICAgICBlbmRHYW1lKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgYm90Qm9hcmQgPSBnZW5lcmF0ZUJvYXJkKGJvdC5nYi5ib2R5LCBvbkNlbGxDbGljayk7XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwbGF5ZXJcIikucmVwbGFjZUNoaWxkcmVuKC4uLm5ld0JvYXJkKTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjb21wdXRlclwiKS5yZXBsYWNlQ2hpbGRyZW4oLi4uYm90Qm9hcmQpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZUxvb3A7XG4iLCJjb25zdCBTSVpFID0gMTA7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdhbWVCb2FyZCgpIHtcbiAgLy8gRmlsbHMgMTAwIGNlbGxzIHdpdGggbnVsbC4gTWFwIGlzIGltcG9ydGFudCBpbiBvcmRlciB0byBjcmVhdGUgbmV3IGFycmF5IGFuZCBub3QganVzdCBhIHJlZmVyZW5jZVxuICBjb25zdCBib2R5ID0gbmV3IEFycmF5KFNJWkUpLmZpbGwobnVsbCkubWFwKCgpID0+IG5ldyBBcnJheShTSVpFKS5maWxsKG51bGwpKTtcbiAgY29uc3QgX3NoaXBBcnJheSA9IFtdO1xuICBjb25zdCBfbWlzc2VkQXR0YWNrcyA9IFtdO1xuICBjb25zdCBfaGl0QXR0YWNrcyA9IFtdO1xuXG4gIGNvbnN0IHNoaXBDb29yZGluYXRlcyA9IChjb2wsIHJvdywgaXNWZXJ0aWNhbCwgbGVuZ3RoKSA9PiB7XG4gICAgY29uc3QgYXJyID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgYXJyLnB1c2goaXNWZXJ0aWNhbCA/IFtyb3cgKyBpLCBjb2xdIDogW3JvdywgY29sICsgaV0pO1xuICAgIH1cbiAgICByZXR1cm4gYXJyO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9ICh7IHg6IGNvbCwgeTogcm93LCBpc1ZlcnRpY2FsIH0sIHNoaXApID0+IHtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHNoaXBDb29yZGluYXRlcyhjb2wsIHJvdywgaXNWZXJ0aWNhbCwgc2hpcC5sZW5ndGgpO1xuICAgIC8vICogQ2hlY2sgaWYgdGhlcmUgaXMgYWxyZWFkeSBhbm90aGVyIHNoaXAgdGhlcmVcbiAgICBjb25zdCBpc0F2YWlsYWJsZSA9IGNvb3JkaW5hdGVzLmV2ZXJ5KFxuICAgICAgKFt5LCB4XSkgPT4gIWJvZHlbeV1beF0gJiYgYm9keVt5XVt4XSAhPT0gdW5kZWZpbmVkXG4gICAgKTtcbiAgICBpZiAoIWlzQXZhaWxhYmxlKSByZXR1cm4gZmFsc2U7XG4gICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgIGNvbnN0IFt5LCB4XSA9IGNvb3JkO1xuICAgICAgYm9keVt5XVt4XSA9IHRydWU7XG4gICAgfSk7XG4gICAgX3NoaXBBcnJheS5wdXNoKHsgY29vcmRpbmF0ZXMsIHNoaXAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUF0dGFjayA9IChjb29yKSA9PiB7XG4gICAgY29uc3QgW3JvdywgY29sXSA9IGNvb3I7XG4gICAgLy8gY2hlY2sgaWYgYWxyZWFkeSBiZWVuIHBsYWNlZC9taXNzZWQgc2FtZSBzcG90XG4gICAgaWYgKF9taXNzZWRBdHRhY2tzLmZpbHRlcigoW3ksIHhdKSA9PiB5ID09PSByb3cgJiYgeCA9PT0gY29sKS5sZW5ndGgpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgaWYgKF9oaXRBdHRhY2tzLmZpbHRlcigoW3ksIHhdKSA9PiB5ID09PSByb3cgJiYgeCA9PT0gY29sKS5sZW5ndGgpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gcmVjb3JkIHRoZSBjb29yZGluYXRlIG9mIG1pc3NlZCBzaG90XG4gICAgaWYgKCFib2R5W3Jvd11bY29sXSkge1xuICAgICAgX21pc3NlZEF0dGFja3MucHVzaChbcm93LCBjb2xdKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gc2VuZCBoaXQgZnVuY3Rpb24gdG8gc2hpcFxuICAgIGxldCBpbmRleCA9IG51bGw7XG4gICAgY29uc3Qgc2hpcE9iamVjdCA9IF9zaGlwQXJyYXkuZmluZCgob2JqKSA9PlxuICAgICAgb2JqLmNvb3JkaW5hdGVzLmZpbmQoKFt5LCB4XSwgaWR4KSA9PiB7XG4gICAgICAgIGlmICh5ID09PSBjb29yWzBdICYmIHggPT09IGNvb3JbMV0pIHtcbiAgICAgICAgICBpbmRleCA9IGlkeDtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICAgIF9oaXRBdHRhY2tzLnB1c2goY29vcik7XG4gICAgc2hpcE9iamVjdC5zaGlwLmhpdChpbmRleCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgZ2V0TWlzc2VkQXR0YWNrcyA9ICgpID0+IF9taXNzZWRBdHRhY2tzO1xuXG4gIGNvbnN0IGFyZUFsbFN1bmtlZCA9ICgpID0+IHtcbiAgICByZXR1cm4gX3NoaXBBcnJheS5ldmVyeSgoeyBzaGlwIH0pID0+IHNoaXAuaXNTdW5rKCkpO1xuICB9O1xuXG4gIHJldHVybiB7IGJvZHksIHBsYWNlU2hpcCwgcmVjZWl2ZUF0dGFjaywgZ2V0TWlzc2VkQXR0YWNrcywgYXJlQWxsU3Vua2VkIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaGlwKGxlbiA9IDMpIHtcbiAgY29uc3QgYm9keSA9IG5ldyBBcnJheShsZW4pLmZpbGwoZmFsc2UpO1xuXG4gIGNvbnN0IGxlbmd0aCA9IHsgYm9keSB9O1xuICBjb25zdCBoaXQgPSAocG9zaXRpb24pID0+IHtcbiAgICBpZiAoYm9keVtwb3NpdGlvbl0pIHJldHVybiBmYWxzZTtcbiAgICBib2R5W3Bvc2l0aW9uXSA9IHRydWU7XG4gICAgcmV0dXJuIGJvZHlbcG9zaXRpb25dO1xuICB9O1xuXG4gIGNvbnN0IGlzU3VuayA9ICgpID0+IGJvZHkuZXZlcnkoKHBhcnQpID0+IHBhcnQpO1xuXG4gIHJldHVybiB7IGxlbmd0aCwgaGl0LCBpc1N1bmsgfTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGdhbWVMb29wIGZyb20gXCIuL21vZHVsZXMvZ2FtZVwiO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZ2FtZUxvb3ApO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9