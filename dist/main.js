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
      console.log(ship.dataset.isVertical);
      ship.dataset.isVertical = Number(ship.dataset.isVertical) ? 0 : 1;
    });
  });

  // TODO Add function that will populate ships on the player side! Make it remove the ship
  // TODO Ship names and Instruction on Modal Content
  // TODO Populate Computer with random ships

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFZO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1Qiw0QkFBNEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLHNCQUFzQixtQkFBbUI7QUFDekM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSwrQkFBK0IsTUFBTTtBQUNyQzs7QUFFQSxXQUFXO0FBQ1g7Ozs7Ozs7Ozs7Ozs7OztBQ2xFZTtBQUNmOztBQUVBLFVBQVUsU0FBUztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFdBQVc7QUFDWDs7Ozs7OztVQ2JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOc0M7O0FBRXRDLDRDQUE0QyxxREFBUSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICAjcG9zc2libGVNb3ZlcyA9IFtdO1xuICBjb25zdHJ1Y3RvcihuYW1lLCBpc0NvbXB1dGVyKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmlzQ29tcHV0ZXIgPSBpc0NvbXB1dGVyO1xuICAgIHRoaXMuZ2IgPSBuZXcgR2FtZUJvYXJkKCk7XG4gICAgaWYgKHRoaXMuaXNDb21wdXRlcikge1xuICAgICAgdGhpcy4jcG9zc2libGVNb3ZlcyA9IHRoaXMuZ2VuZXJhdGVNb3Zlcyh0aGlzLmdiLmJvZHkubGVuZ3RoKTtcbiAgICB9XG4gIH1cbiAgZ2V0IHBvc3NpYmxlTW92ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Bvc3NpYmxlTW92ZXM7XG4gIH1cbiAgZ2VuZXJhdGVNb3ZlcyhsZW4pIHtcbiAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgYXJyYXkucHVzaChbaSwgal0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cbiAgYXR0YWNrRW5lbXkoY29vcmQsIGVuZW15KSB7XG4gICAgLy8gYXR0YWNrIHRoZSBlbmVteSBzaGlwXG4gICAgcmV0dXJuIGVuZW15LmdiLnJlY2VpdmVBdHRhY2soY29vcmQpO1xuICB9XG4gIGF0dGFja1JhbmRvbWx5KGVuZW15KSB7XG4gICAgaWYgKCF0aGlzLmlzQ29tcHV0ZXIpIHJldHVybiBbXTtcbiAgICAvLyBQaWNrcyBhIHJhbmRvbSBudW1iZXIgZnJvbSB0aGUgbGlzdCBhbmQgcmVtb3ZlcyBpdFxuICAgIGNvbnN0IHJhbmRJbnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLiNwb3NzaWJsZU1vdmVzLmxlbmd0aCk7XG4gICAgY29uc3QgW2Nvb3JkXSA9IHRoaXMuI3Bvc3NpYmxlTW92ZXMuc3BsaWNlKHJhbmRJbnQsIDEpO1xuICAgIGNvbnN0IHN1Y2Nlc3MgPSB0aGlzLmF0dGFja0VuZW15KGNvb3JkLCBlbmVteSk7XG4gICAgcmV0dXJuIHsgY29vcmQsIGhpdDogc3VjY2VzcyB9O1xuICB9XG4gIGlzR2FtZU92ZXIoKSB7XG4gICAgLy8gSWYgdGhlcmUgYXJlIG5vIG1vdmVzIGxlZnRcbiAgICByZXR1cm4gIXRoaXMuI3Bvc3NpYmxlTW92ZXMubGVuZ3RoO1xuICB9XG59XG4iLCJjb25zdCBnZW5lcmF0ZUJvYXJkID0gKGJvYXJkLCBjYikgPT4ge1xuICAvLyAqIGdlbmVyYXRlcyBhIGdyaWQgQm9hcmRcbiAgY29uc3QgYXJyYXkgPSBbXTtcbiAgYm9hcmQuZm9yRWFjaCgocm93LCByb3dJZHgpID0+IHtcbiAgICByb3cuZm9yRWFjaCgoY29sdW1uLCBjb2xJZHgpID0+IHtcbiAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgY2VsbC5kYXRhc2V0LmNvb3JkaW5hdGVzID0gSlNPTi5zdHJpbmdpZnkoW3Jvd0lkeCwgY29sSWR4XSk7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgY2VsbC5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgIGlmIChjYikge1xuICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYik7XG4gICAgICB9XG4gICAgICBhcnJheS5wdXNoKGNlbGwpO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGFycmF5O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVCb2FyZDtcbiIsIi8qIFxuKiBSZWZhY3RvciAoTWFya2luZyBmdW5jdGlvbnMpXG4qIEFkZCBFbmRpbmcgR2FtZSBhbmQgcmVtb3ZlIGFsZXJ0c1xuVE9ETyBBZGQgSW5pdGlhbGl6ZSBzaGlwc1xuVE9ETyBEaXNwbGF5IE93biBTaGlwc1xuVE9ETyBBZGQgUmFuZG9taXplIGVuZW15IHNoaXBzXG5UT0RPIEluaGVyaXQgUGxheWVyIENsYXNzIENvbXB1dGVyIENsYXNzXG4qL1xuXG5pbXBvcnQgZ2VuZXJhdGVCb2FyZCBmcm9tIFwiLi9jb21wb25lbnRzL2JvYXJkXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL1BsYXllclwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi9nYW1lQm9hcmRcIjtcblxuY29uc3QgaGFzTm9Nb3Zlc0xlZnQgPSAoY2VsbCkgPT4ge1xuICByZXR1cm4gIWNlbGwucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFjdGl2ZVwiKS5sZW5ndGg7XG59O1xuXG5jb25zdCBjcmVhdGVNb2RhbCA9ICgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwibW9kYWxcIik7XG4gIHJldHVybiBtb2RhbDtcbn07XG4vLyAqIFJlbW92ZXMgY2hpbGQgdXNpbmcgcGFyZW50RWxlbWVudC5yZW1vZXZDaGlsZCBhbmQgYXBwZW5kQ2hpbGRcbmNvbnN0IG9uRHJhZyA9IChlKSA9PiB7XG4gIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeShlLnRhcmdldC5kYXRhc2V0KTtcbiAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgbWVzc2FnZSk7XG4gIGUudGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAwLjU7XG59O1xuXG5jb25zdCBvbkRyYWdFbmQgPSAoZSkgPT4ge1xuICBlLnRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMTtcbn07XG5jb25zdCBvbkRyb3AgPSAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnN0IGRhdGEgPSBlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwidGV4dFwiKTtcbn07XG5jb25zdCBtYWtlU2hpcEVsZW1lbnQgPSAoW3NoaXBOYW1lLCBsZW5ndGhdKSA9PiB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICBlbGVtZW50LmRhdGFzZXQuc2hpcE5hbWUgPSBzaGlwTmFtZTtcbiAgZWxlbWVudC5kYXRhc2V0LnNoaXBMZW5ndGggPSBsZW5ndGg7XG4gIGVsZW1lbnQuZGF0YXNldC5pc1ZlcnRpY2FsID0gMDtcbiAgZWxlbWVudC5kcmFnZ2FibGUgPSB0cnVlO1xuICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgb25EcmFnKTtcbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VuZFwiLCBvbkRyYWdFbmQpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNlbGwpO1xuICB9XG4gIHJldHVybiBlbGVtZW50O1xufTtcbmNvbnN0IHNoaXBDb29yZGluYXRlcyA9IChjb2wsIHJvdywgaXNWZXJ0aWNhbCwgbGVuZ3RoKSA9PiB7XG4gIGNvbnN0IGFyciA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgYXJyLnB1c2goaXNWZXJ0aWNhbCA/IFtyb3cgKyBpLCBjb2xdIDogW3JvdywgY29sICsgaV0pO1xuICB9XG4gIHJldHVybiBhcnI7XG59O1xuXG5jb25zdCBvcGVuaW5nTW9kYWwgPSAocGxheWVyLCBib2FyZCkgPT4ge1xuICAvL2luaXRpbGlhemUgbW9kYWxcbiAgY29uc3QgbW9kYWwgPSBjcmVhdGVNb2RhbCgpO1xuICAvLyBDcmVhdGUgbW9kZWw7XG4gIG1vZGFsLmlubmVySFRNTCA9IGBcbiAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgPHA+V2VsY29tZSB0byBCYXR0bGVzaGlwPC9wPlxuICA8c3Bhbj48L3NwYW4+XG4gIDxkaXYgY2xhc3M9XCJ3cmFwcGVyXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1pbmktZ2FtZWJvYXJkXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNoaXBzXCI+XG4gICAgICAgIDxidXR0b24+Um90YXRlIPCflIM8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDwvZGl2PlxuICBgO1xuICBjb25zdCBzaGlwc0NvbnRhaW5lciA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcHNcIik7XG4gIC8vIFRPRE8gQWRkIGRyYWdnYWJsZSBTaGlwc1xuICBjb25zdCBzaGlwcyA9IHtcbiAgICBDYXJyaWVyOiA1LFxuICAgIEJhdHRsZXNoaXA6IDQsXG4gICAgRGVzdHJveWVyOiAzLFxuICAgIFN1Ym1hcmluZTogMyxcbiAgICBcIlBhdHJvbCBCb2F0XCI6IDIsXG4gIH07XG5cbiAgY29uc3Qgc2hpcEVsZW1lbnRzID0gT2JqZWN0LmVudHJpZXMoc2hpcHMpLm1hcChtYWtlU2hpcEVsZW1lbnQpO1xuICBzaGlwc0NvbnRhaW5lci5hcHBlbmQoLi4uc2hpcEVsZW1lbnRzKTtcbiAgY29uc3Qgcm90YXRlID0gbW9kYWwucXVlcnlTZWxlY3RvcihcImJ1dHRvblwiKTtcbiAgcm90YXRlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgc2hpcEVsZW1lbnRzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIHNoaXAuY2xhc3NMaXN0LnRvZ2dsZShcInZlcnRpY2FsXCIpO1xuICAgICAgY29uc29sZS5sb2coc2hpcC5kYXRhc2V0LmlzVmVydGljYWwpO1xuICAgICAgc2hpcC5kYXRhc2V0LmlzVmVydGljYWwgPSBOdW1iZXIoc2hpcC5kYXRhc2V0LmlzVmVydGljYWwpID8gMCA6IDE7XG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIFRPRE8gQWRkIGZ1bmN0aW9uIHRoYXQgd2lsbCBwb3B1bGF0ZSBzaGlwcyBvbiB0aGUgcGxheWVyIHNpZGUhIE1ha2UgaXQgcmVtb3ZlIHRoZSBzaGlwXG4gIC8vIFRPRE8gU2hpcCBuYW1lcyBhbmQgSW5zdHJ1Y3Rpb24gb24gTW9kYWwgQ29udGVudFxuICAvLyBUT0RPIFBvcHVsYXRlIENvbXB1dGVyIHdpdGggcmFuZG9tIHNoaXBzXG5cbiAgY29uc3QgZ2IgPSBnZW5lcmF0ZUJvYXJkKHBsYXllci5nYi5ib2R5KTtcbiAgZ2IuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbnRlclwiLCAoZSkgPT4ge1xuICAgICAgZS50YXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJncmVlblwiO1xuICAgIH0pO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCAoZSkgPT4ge1xuICAgICAgZS50YXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJcIjtcbiAgICB9KTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGNvbnN0IFt5LCB4XSA9IEpTT04ucGFyc2UoZS50YXJnZXQuZGF0YXNldC5jb29yZGluYXRlcyk7XG4gICAgICBsZXQge1xuICAgICAgICBzaGlwTmFtZSxcbiAgICAgICAgc2hpcExlbmd0aDogbGVuZ3RoLFxuICAgICAgICBpc1ZlcnRpY2FsLFxuICAgICAgfSA9IEpTT04ucGFyc2UoZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHRcIikpO1xuICAgICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aCk7XG4gICAgICBpc1ZlcnRpY2FsID0gTnVtYmVyKGlzVmVydGljYWwpO1xuXG4gICAgICBjb25zdCBwb3NzaWJlQ29vcmRpbmF0ZXMgPSBzaGlwQ29vcmRpbmF0ZXMoeCwgeSwgaXNWZXJ0aWNhbCwgbGVuZ3RoKTtcbiAgICAgIGNvbnN0IGlzU2hpcFN1Y2Nlc3NmdWwgPSBwbGF5ZXIuZ2IucGxhY2VTaGlwKFxuICAgICAgICB7XG4gICAgICAgICAgeCxcbiAgICAgICAgICB5LFxuICAgICAgICAgIGlzVmVydGljYWwsXG4gICAgICAgIH0sXG4gICAgICAgIG5ldyBTaGlwKGxlbmd0aClcbiAgICAgICk7XG4gICAgICBpZiAoaXNTaGlwU3VjY2Vzc2Z1bCkge1xuICAgICAgICBjb25zdCBteUNvb3JkID0gZ2IuZmlsdGVyKChjZWxsKSA9PiB7XG4gICAgICAgICAgY29uc3QgW3ksIHhdID0gSlNPTi5wYXJzZShjZWxsLmRhdGFzZXQuY29vcmRpbmF0ZXMpO1xuICAgICAgICAgIGZvciAoY29uc3QgW3JvdywgY29sXSBvZiBwb3NzaWJlQ29vcmRpbmF0ZXMpIHtcbiAgICAgICAgICAgIGlmIChyb3cgPT09IHkgJiYgY29sID09PSB4KSB7XG4gICAgICAgICAgICAgIHJldHVybiBjZWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIERpc3BwbGF5IHRoZSBzaGlwc1xuICAgICAgICBteUNvb3JkLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgICBzaGlwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICBib2FyZC5maW5kKFxuICAgICAgICAgICAgKG1haW5TaGlwKSA9PlxuICAgICAgICAgICAgICBtYWluU2hpcC5kYXRhc2V0LmNvb3JkaW5hdGVzID09PSBzaGlwLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgICApLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLm1pbmktZ2FtZWJvYXJkXCIpLmFwcGVuZCguLi5nYik7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobW9kYWwpO1xufTtcblxuY29uc3QgZW5kR2FtZSA9IChwbGF5ZXJXaW4pID0+IHtcbiAgY29uc3QgbW9kYWwgPSBjcmVhdGVNb2RhbCgpO1xuICBtb2RhbC5pbm5lckhUTUwgPSBgXG4gICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgIDxwPiR7cGxheWVyV2luID8gXCJZb3Ugd2luIVwiIDogXCJDb21wIHdpbiFcIn08L3A+XG4gICAgIDxidXR0b24+UGxheSBBZ2FpbjwvYnV0dG9uPlxuICAgPC9kaXY+XG4gICAgIGA7XG4gIG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBnYW1lTG9vcCgpO1xuICAgIG1vZGFsLnJlbW92ZSgpO1xuICB9KTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbCk7XG59O1xuXG4vLyBtZXRob2QgdGhhdCBtYXJrcyB0aGUgY2VsbFxuY29uc3QgbWFya0NlbGwgPSAoY2VsbCwgaXNTaGlwKSA9PiB7XG4gIGNlbGwuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gIGlmIChpc1NoaXApIHtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJpc1NoaXBcIik7XG4gIH1cbn07XG5cbmNvbnN0IGdhbWVMb29wID0gKCkgPT4ge1xuICBjb25zdCBwMSA9IG5ldyBQbGF5ZXIoXCJwMVwiKTtcbiAgY29uc3QgYm90ID0gbmV3IFBsYXllcihcImJvdFwiLCB0cnVlKTtcbiAgY29uc3QgbmV3Qm9hcmQgPSBnZW5lcmF0ZUJvYXJkKHAxLmdiLmJvZHkpO1xuICBvcGVuaW5nTW9kYWwocDEsIG5ld0JvYXJkKTtcblxuICAvLyAgIHAxLmdiLnBsYWNlU2hpcCh7IHg6IDAsIHk6IDAgfSwgbmV3IFNoaXAoKSk7XG4gIC8vICAgYm90LmdiLnBsYWNlU2hpcCh7IHg6IDEsIHk6IDEgfSwgbmV3IFNoaXAoKSk7XG5cbiAgY29uc3Qgb25DZWxsQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY2xpY2tlZENvb3JkID0gSlNPTi5wYXJzZSh0aGlzLmRhdGFzZXQuY29vcmRpbmF0ZXMpO1xuICAgIC8vIFJldHVybnMgYm9vbCBzaGlwIGlzIGhpdFxuICAgIGNvbnN0IHN1Y2Nlc3MgPSBwMS5hdHRhY2tFbmVteShjbGlja2VkQ29vcmQsIGJvdCk7XG4gICAgbWFya0NlbGwodGhpcywgc3VjY2Vzcyk7XG5cbiAgICBpZiAoYm90LmdiLmFyZUFsbFN1bmtlZCgpIHx8IGJvdC5pc0dhbWVPdmVyKCkpIHtcbiAgICAgIGVuZEdhbWUodHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8gRW5lbXkgQ29tcFxuICAgIGNvbnN0IHsgY29vcmQ6IGVuZW15Q29vcmQsIGhpdDogZW5lbXlTdWNjZXNzIH0gPSBib3QuYXR0YWNrUmFuZG9tbHkocDEpO1xuICAgIC8vIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGVuZW15Q29vcmQpKTtcbiAgICBjb25zdCBhdHRhY2tlZENlbGwgPSBuZXdCb2FyZC5maW5kKFxuICAgICAgKGRpdikgPT4gZGl2LmRhdGFzZXQuY29vcmRpbmF0ZXMgPT09IEpTT04uc3RyaW5naWZ5KGVuZW15Q29vcmQpXG4gICAgKTtcblxuICAgIG1hcmtDZWxsKGF0dGFja2VkQ2VsbCwgZW5lbXlTdWNjZXNzKTtcbiAgICBpZiAocDEuZ2IuYXJlQWxsU3Vua2VkKCkgfHwgaGFzTm9Nb3Zlc0xlZnQodGhpcykpIHtcbiAgICAgIGVuZEdhbWUoZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBib3RCb2FyZCA9IGdlbmVyYXRlQm9hcmQoYm90LmdiLmJvZHksIG9uQ2VsbENsaWNrKTtcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYXllclwiKS5yZXBsYWNlQ2hpbGRyZW4oLi4ubmV3Qm9hcmQpO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbXB1dGVyXCIpLnJlcGxhY2VDaGlsZHJlbiguLi5ib3RCb2FyZCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lTG9vcDtcbiIsImNvbnN0IFNJWkUgPSAxMDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2FtZUJvYXJkKCkge1xuICAvLyBGaWxscyAxMDAgY2VsbHMgd2l0aCBudWxsLiBNYXAgaXMgaW1wb3J0YW50IGluIG9yZGVyIHRvIGNyZWF0ZSBuZXcgYXJyYXkgYW5kIG5vdCBqdXN0IGEgcmVmZXJlbmNlXG4gIGNvbnN0IGJvZHkgPSBuZXcgQXJyYXkoU0laRSkuZmlsbChudWxsKS5tYXAoKCkgPT4gbmV3IEFycmF5KFNJWkUpLmZpbGwobnVsbCkpO1xuICBjb25zdCBfc2hpcEFycmF5ID0gW107XG4gIGNvbnN0IF9taXNzZWRBdHRhY2tzID0gW107XG4gIGNvbnN0IF9oaXRBdHRhY2tzID0gW107XG5cbiAgY29uc3Qgc2hpcENvb3JkaW5hdGVzID0gKGNvbCwgcm93LCBpc1ZlcnRpY2FsLCBsZW5ndGgpID0+IHtcbiAgICBjb25zdCBhcnIgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBhcnIucHVzaChpc1ZlcnRpY2FsID8gW3JvdyArIGksIGNvbF0gOiBbcm93LCBjb2wgKyBpXSk7XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gKHsgeDogY29sLCB5OiByb3csIGlzVmVydGljYWwgfSwgc2hpcCkgPT4ge1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gc2hpcENvb3JkaW5hdGVzKGNvbCwgcm93LCBpc1ZlcnRpY2FsLCBzaGlwLmxlbmd0aCk7XG4gICAgLy8gKiBDaGVjayBpZiB0aGVyZSBpcyBhbHJlYWR5IGFub3RoZXIgc2hpcCB0aGVyZVxuICAgIGNvbnN0IGlzQXZhaWxhYmxlID0gY29vcmRpbmF0ZXMuZXZlcnkoXG4gICAgICAoW3ksIHhdKSA9PiAhYm9keVt5XVt4XSAmJiBib2R5W3ldW3hdICE9PSB1bmRlZmluZWRcbiAgICApO1xuICAgIGlmICghaXNBdmFpbGFibGUpIHJldHVybiBmYWxzZTtcbiAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgY29uc3QgW3ksIHhdID0gY29vcmQ7XG4gICAgICBib2R5W3ldW3hdID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBfc2hpcEFycmF5LnB1c2goeyBjb29yZGluYXRlcywgc2hpcCB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCByZWNlaXZlQXR0YWNrID0gKGNvb3IpID0+IHtcbiAgICBjb25zdCBbcm93LCBjb2xdID0gY29vcjtcbiAgICAvLyBjaGVjayBpZiBhbHJlYWR5IGJlZW4gcGxhY2VkL21pc3NlZCBzYW1lIHNwb3RcbiAgICBpZiAoX21pc3NlZEF0dGFja3MuZmlsdGVyKChbeSwgeF0pID0+IHkgPT09IHJvdyAmJiB4ID09PSBjb2wpLmxlbmd0aClcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAoX2hpdEF0dGFja3MuZmlsdGVyKChbeSwgeF0pID0+IHkgPT09IHJvdyAmJiB4ID09PSBjb2wpLmxlbmd0aClcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICAvLyByZWNvcmQgdGhlIGNvb3JkaW5hdGUgb2YgbWlzc2VkIHNob3RcbiAgICBpZiAoIWJvZHlbcm93XVtjb2xdKSB7XG4gICAgICBfbWlzc2VkQXR0YWNrcy5wdXNoKFtyb3csIGNvbF0pO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBzZW5kIGhpdCBmdW5jdGlvbiB0byBzaGlwXG4gICAgbGV0IGluZGV4ID0gbnVsbDtcbiAgICBjb25zdCBzaGlwT2JqZWN0ID0gX3NoaXBBcnJheS5maW5kKChvYmopID0+XG4gICAgICBvYmouY29vcmRpbmF0ZXMuZmluZCgoW3ksIHhdLCBpZHgpID0+IHtcbiAgICAgICAgaWYgKHkgPT09IGNvb3JbMF0gJiYgeCA9PT0gY29vclsxXSkge1xuICAgICAgICAgIGluZGV4ID0gaWR4O1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gICAgX2hpdEF0dGFja3MucHVzaChjb29yKTtcbiAgICBzaGlwT2JqZWN0LnNoaXAuaGl0KGluZGV4KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBnZXRNaXNzZWRBdHRhY2tzID0gKCkgPT4gX21pc3NlZEF0dGFja3M7XG5cbiAgY29uc3QgYXJlQWxsU3Vua2VkID0gKCkgPT4ge1xuICAgIHJldHVybiBfc2hpcEFycmF5LmV2ZXJ5KCh7IHNoaXAgfSkgPT4gc2hpcC5pc1N1bmsoKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgYm9keSwgcGxhY2VTaGlwLCByZWNlaXZlQXR0YWNrLCBnZXRNaXNzZWRBdHRhY2tzLCBhcmVBbGxTdW5rZWQgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNoaXAobGVuID0gMykge1xuICBjb25zdCBib2R5ID0gbmV3IEFycmF5KGxlbikuZmlsbChmYWxzZSk7XG5cbiAgY29uc3QgeyBsZW5ndGggfSA9IGJvZHk7XG4gIGNvbnN0IGhpdCA9IChwb3NpdGlvbikgPT4ge1xuICAgIGlmIChib2R5W3Bvc2l0aW9uXSkgcmV0dXJuIGZhbHNlO1xuICAgIGJvZHlbcG9zaXRpb25dID0gdHJ1ZTtcbiAgICByZXR1cm4gYm9keVtwb3NpdGlvbl07XG4gIH07XG5cbiAgY29uc3QgaXNTdW5rID0gKCkgPT4gYm9keS5ldmVyeSgocGFydCkgPT4gcGFydCk7XG5cbiAgcmV0dXJuIHsgbGVuZ3RoLCBoaXQsIGlzU3VuayB9O1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgZ2FtZUxvb3AgZnJvbSBcIi4vbW9kdWxlcy9nYW1lXCI7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBnYW1lTG9vcCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=