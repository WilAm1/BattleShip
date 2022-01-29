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
        cell.addEventListener("click", cb, { once: true });
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

  const gb = (0,_components_board__WEBPACK_IMPORTED_MODULE_0__["default"])(player.gb.body);
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
  const player = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]("player");
  const bot = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]("bot", true);
  const newBoard = (0,_components_board__WEBPACK_IMPORTED_MODULE_0__["default"])(player.gb.body);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFQSxpRUFBZSxRQUFRLEVBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ2hQeEI7O0FBRWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsWUFBWTtBQUNoQztBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIsNEJBQTRCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLHNCQUFzQixtQkFBbUI7QUFDekM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSwrQkFBK0IsTUFBTTtBQUNyQzs7QUFFQSxXQUFXO0FBQ1g7Ozs7Ozs7Ozs7Ozs7OztBQ25FZTtBQUNmOztBQUVBLFVBQVUsU0FBUztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFdBQVc7QUFDWDs7Ozs7OztVQ2JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOc0M7O0FBRXRDLDRDQUE0QyxxREFBUSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICAjcG9zc2libGVNb3ZlcyA9IFtdO1xuICBjb25zdHJ1Y3RvcihuYW1lLCBpc0NvbXB1dGVyKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmlzQ29tcHV0ZXIgPSBpc0NvbXB1dGVyO1xuICAgIHRoaXMuZ2IgPSBuZXcgR2FtZUJvYXJkKCk7XG4gICAgaWYgKHRoaXMuaXNDb21wdXRlcikge1xuICAgICAgdGhpcy4jcG9zc2libGVNb3ZlcyA9IHRoaXMuZ2VuZXJhdGVNb3Zlcyh0aGlzLmdiLmJvZHkubGVuZ3RoKTtcbiAgICB9XG4gIH1cbiAgZ2V0IHBvc3NpYmxlTW92ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Bvc3NpYmxlTW92ZXM7XG4gIH1cbiAgZ2VuZXJhdGVNb3ZlcyhsZW4pIHtcbiAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgYXJyYXkucHVzaChbaSwgal0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cbiAgYXR0YWNrRW5lbXkoY29vcmQsIGVuZW15KSB7XG4gICAgLy8gYXR0YWNrIHRoZSBlbmVteSBzaGlwXG4gICAgcmV0dXJuIGVuZW15LmdiLnJlY2VpdmVBdHRhY2soY29vcmQpO1xuICB9XG4gIGF0dGFja1JhbmRvbWx5KGVuZW15KSB7XG4gICAgaWYgKCF0aGlzLmlzQ29tcHV0ZXIpIHJldHVybiBbXTtcbiAgICAvLyBQaWNrcyBhIHJhbmRvbSBudW1iZXIgZnJvbSB0aGUgbGlzdCBhbmQgcmVtb3ZlcyBpdFxuICAgIGNvbnN0IHJhbmRJbnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLiNwb3NzaWJsZU1vdmVzLmxlbmd0aCk7XG4gICAgY29uc3QgW2Nvb3JkXSA9IHRoaXMuI3Bvc3NpYmxlTW92ZXMuc3BsaWNlKHJhbmRJbnQsIDEpO1xuICAgIGNvbnN0IHN1Y2Nlc3MgPSB0aGlzLmF0dGFja0VuZW15KGNvb3JkLCBlbmVteSk7XG4gICAgcmV0dXJuIHsgY29vcmQsIGhpdDogc3VjY2VzcyB9O1xuICB9XG4gIGlzR2FtZU92ZXIoKSB7XG4gICAgLy8gSWYgdGhlcmUgYXJlIG5vIG1vdmVzIGxlZnRcbiAgICByZXR1cm4gIXRoaXMuI3Bvc3NpYmxlTW92ZXMubGVuZ3RoO1xuICB9XG59XG4iLCJjb25zdCBnZW5lcmF0ZUJvYXJkID0gKGJvYXJkLCBjYikgPT4ge1xuICAvLyAqIGdlbmVyYXRlcyBhIGdyaWQgQm9hcmRcbiAgY29uc3QgYXJyYXkgPSBbXTtcbiAgYm9hcmQuZm9yRWFjaCgocm93LCByb3dJZHgpID0+IHtcbiAgICByb3cuZm9yRWFjaCgoY29sdW1uLCBjb2xJZHgpID0+IHtcbiAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgY2VsbC5kYXRhc2V0LmNvb3JkaW5hdGVzID0gSlNPTi5zdHJpbmdpZnkoW3Jvd0lkeCwgY29sSWR4XSk7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgY2VsbC5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgIGlmIChjYikge1xuICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYiwgeyBvbmNlOiB0cnVlIH0pO1xuICAgICAgfVxuICAgICAgYXJyYXkucHVzaChjZWxsKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBhcnJheTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlQm9hcmQ7XG4iLCIvKiBcblRPRE8gUmVmYWN0b3JcbiovXG5cbmltcG9ydCBnZW5lcmF0ZUJvYXJkIGZyb20gXCIuL2NvbXBvbmVudHMvYm9hcmRcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vUGxheWVyXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmNvbnN0IGhhc05vTW92ZXNMZWZ0ID0gKGNlbGwpID0+IHtcbiAgcmV0dXJuICFjZWxsLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5hY3RpdmVcIikubGVuZ3RoO1xufTtcblxuY29uc3QgY3JlYXRlTW9kYWwgPSAoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZChcIm1vZGFsXCIpO1xuICByZXR1cm4gbW9kYWw7XG59O1xuXG5jb25zdCBvbkRyYWcgPSAoZSkgPT4ge1xuICBjb25zdCBtZXNzYWdlID0gSlNPTi5zdHJpbmdpZnkoZS50YXJnZXQuZGF0YXNldCk7XG4gIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJ0ZXh0L3BsYWluXCIsIG1lc3NhZ2UpO1xuICBlLnRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMC4zO1xufTtcblxuY29uc3Qgb25EcmFnRW5kID0gKGUpID0+IHtcbiAgZS50YXJnZXQuc3R5bGUub3BhY2l0eSA9IDE7XG59O1xuXG5jb25zdCBtYWtlU2hpcEVsZW1lbnQgPSAoW3NoaXBOYW1lLCBsZW5ndGhdKSA9PiB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICBlbGVtZW50LmRhdGFzZXQuc2hpcE5hbWUgPSBzaGlwTmFtZTtcbiAgZWxlbWVudC5kYXRhc2V0LnNoaXBMZW5ndGggPSBsZW5ndGg7XG4gIGVsZW1lbnQuZGF0YXNldC5pc1ZlcnRpY2FsID0gMDtcbiAgZWxlbWVudC5kcmFnZ2FibGUgPSB0cnVlO1xuICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgb25EcmFnKTtcbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VuZFwiLCBvbkRyYWdFbmQpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNlbGwpO1xuICB9XG4gIHJldHVybiBlbGVtZW50O1xufTtcbmNvbnN0IHNoaXBDb29yZGluYXRlcyA9IChjb2wsIHJvdywgaXNWZXJ0aWNhbCwgbGVuZ3RoKSA9PiB7XG4gIGNvbnN0IGFyciA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgYXJyLnB1c2goaXNWZXJ0aWNhbCA/IFtyb3cgKyBpLCBjb2xdIDogW3JvdywgY29sICsgaV0pO1xuICB9XG4gIHJldHVybiBhcnI7XG59O1xuY29uc3QgZ2V0UmFuZG9tQ29vcmRpbmF0ZSA9IChsZW4pID0+IHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxlbik7XG59O1xuXG4vLyBQbGFjZXMgcmFuZG9taXplZCBjb29yZGluYXRlcyBvbiBlbmVteSBTaGlwc1xuY29uc3QgcGxhY2VSYW5kb21TaGlwcyA9IChnYW1lQm9hcmQsIHNoaXBzKSA9PiB7XG4gIE9iamVjdC52YWx1ZXMoc2hpcHMpLmZvckVhY2goKHNoaXBMZW5ndGgpID0+IHtcbiAgICBsZXQgaXNTdWNjZXNzID0gZmFsc2U7XG4gICAgd2hpbGUgKCFpc1N1Y2Nlc3MpIHtcbiAgICAgIGNvbnN0IGNvbCA9IGdldFJhbmRvbUNvb3JkaW5hdGUoZ2FtZUJvYXJkLmJvZHkubGVuZ3RoKTtcbiAgICAgIGNvbnN0IHJvdyA9IGdldFJhbmRvbUNvb3JkaW5hdGUoZ2FtZUJvYXJkLmJvZHkubGVuZ3RoKTtcbiAgICAgIGNvbnN0IGlzVmVydGljYWwgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpO1xuICAgICAgY29uc3QgbmV3U2hpcCA9IG5ldyBTaGlwKHNoaXBMZW5ndGgpO1xuICAgICAgaXNTdWNjZXNzID0gZ2FtZUJvYXJkLnBsYWNlU2hpcCh7IHg6IGNvbCwgeTogcm93LCBpc1ZlcnRpY2FsIH0sIG5ld1NoaXApO1xuICAgIH1cbiAgfSk7XG59O1xuXG5jb25zdCBvcGVuaW5nTW9kYWwgPSAocGxheWVyLCBib2FyZCwgY29tcHV0ZXIpID0+IHtcbiAgY29uc3Qgc2hpcHMgPSB7XG4gICAgQ2FycmllcjogNSxcbiAgICBCYXR0bGVzaGlwOiA0LFxuICAgIERlc3Ryb3llcjogMyxcbiAgICBTdWJtYXJpbmU6IDMsXG4gICAgXCJQYXRyb2wgQm9hdFwiOiAyLFxuICB9O1xuXG4gIGNvbnN0IG1vZGFsID0gY3JlYXRlTW9kYWwoKTtcbiAgbW9kYWwuaW5uZXJIVE1MID0gYFxuICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPlxuICA8aDI+V0VMQ09NRSBUTyBCQVRUTEVTSElQPC9oMj5cbiAgPGRpdiBjbGFzcz1cIndyYXBwZXJcIj5cbiAgICA8ZGl2IGNsYXNzPVwibWluaS1nYW1lYm9hcmRcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2hpcHMtd3JhcHBlclwiPlxuICAgICAgPGRpdiBjbGFzcz1cImluc3RydWN0aW9uXCI+XG4gICAgICAgIDxwPlBMQUNFIFlPVVIgU0hJUFMgQlkgRFJBR0dJTkcgQU5EIERST1BQSU5HIElUIElOVE8gVEhFIEJPQVJEPC9wPlxuICAgICAgICA8YnV0dG9uPlJvdGF0ZSDwn5SDPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzaGlwc1wiPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuICA8L2Rpdj5cbiAgYDtcblxuICBjb25zdCBzaGlwc0NvbnRhaW5lciA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcHNcIik7XG5cbiAgY29uc3Qgc2hpcEVsZW1lbnRzID0gT2JqZWN0LmVudHJpZXMoc2hpcHMpLm1hcChtYWtlU2hpcEVsZW1lbnQpO1xuICBzaGlwc0NvbnRhaW5lci5hcHBlbmQoLi4uc2hpcEVsZW1lbnRzKTtcblxuICBjb25zdCByb3RhdGUgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uXCIpO1xuICByb3RhdGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBzaGlwRWxlbWVudHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgc2hpcC5jbGFzc0xpc3QudG9nZ2xlKFwidmVydGljYWxcIik7XG4gICAgICBzaGlwLmRhdGFzZXQuaXNWZXJ0aWNhbCA9IE51bWJlcihzaGlwLmRhdGFzZXQuaXNWZXJ0aWNhbCkgPyAwIDogMTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgY29uc3QgZ2IgPSBnZW5lcmF0ZUJvYXJkKHBsYXllci5nYi5ib2R5KTtcbiAgZ2IuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbnRlclwiLCAoZSkgPT4ge1xuICAgICAgZS50YXJnZXQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgfSk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIChlKSA9PiB7XG4gICAgICBlLnRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICB9KTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUudGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgY29uc3QgW3ksIHhdID0gSlNPTi5wYXJzZShlLnRhcmdldC5kYXRhc2V0LmNvb3JkaW5hdGVzKTtcbiAgICAgIGxldCB7XG4gICAgICAgIHNoaXBOYW1lLFxuICAgICAgICBzaGlwTGVuZ3RoOiBsZW5ndGgsXG4gICAgICAgIGlzVmVydGljYWwsXG4gICAgICB9ID0gSlNPTi5wYXJzZShlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwidGV4dFwiKSk7XG4gICAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKTtcbiAgICAgIGlzVmVydGljYWwgPSBOdW1iZXIoaXNWZXJ0aWNhbCk7XG5cbiAgICAgIGNvbnN0IHBvc3NpYmVDb29yZGluYXRlcyA9IHNoaXBDb29yZGluYXRlcyh4LCB5LCBpc1ZlcnRpY2FsLCBsZW5ndGgpO1xuICAgICAgY29uc3QgaXNTaGlwU3VjY2Vzc2Z1bCA9IHBsYXllci5nYi5wbGFjZVNoaXAoXG4gICAgICAgIHtcbiAgICAgICAgICB4LFxuICAgICAgICAgIHksXG4gICAgICAgICAgaXNWZXJ0aWNhbCxcbiAgICAgICAgfSxcbiAgICAgICAgbmV3IFNoaXAobGVuZ3RoKVxuICAgICAgKTtcblxuICAgICAgaWYgKCFpc1NoaXBTdWNjZXNzZnVsKSByZXR1cm47XG4gICAgICBjb25zdCBteUNvb3JkID0gZ2IuZmlsdGVyKChjZWxsKSA9PiB7XG4gICAgICAgIGNvbnN0IFt5LCB4XSA9IEpTT04ucGFyc2UoY2VsbC5kYXRhc2V0LmNvb3JkaW5hdGVzKTtcbiAgICAgICAgZm9yIChjb25zdCBbcm93LCBjb2xdIG9mIHBvc3NpYmVDb29yZGluYXRlcykge1xuICAgICAgICAgIGlmIChyb3cgPT09IHkgJiYgY29sID09PSB4KSB7XG4gICAgICAgICAgICByZXR1cm4gY2VsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBEaXNwbGF5IHRoZSBzaGlwc1xuICAgICAgbXlDb29yZC5mb3JFYWNoKChzaGlwKSA9PiB7XG4gICAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZChcImlzU2hpcFwiKTtcbiAgICAgICAgLy8gRGlzcGxheXMgdGhlIHNoaXBzIG9uIHRoZSBtYWluIGdhbWVCb2FyZFxuICAgICAgICBib2FyZFxuICAgICAgICAgIC5maW5kKFxuICAgICAgICAgICAgKG1haW5TaGlwKSA9PlxuICAgICAgICAgICAgICBtYWluU2hpcC5kYXRhc2V0LmNvb3JkaW5hdGVzID09PSBzaGlwLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgICApXG4gICAgICAgICAgLmNsYXNzTGlzdC5hZGQoXCJpc1NoaXBcIik7XG4gICAgICB9KTtcblxuICAgICAgLy8gUmVtb3ZlcyB0aGUgU2hpcFxuICAgICAgY29uc3Qgc2hpcE5vZGUgPSBzaGlwc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgW2RhdGEtc2hpcC1uYW1lPVwiJHtzaGlwTmFtZX1cImBcbiAgICAgICk7XG4gICAgICBzaGlwTm9kZS5yZW1vdmUoKTtcblxuICAgICAgLy8gQ2hlY2sgaWYgU2hpcHMgYXJlIHN0aWxsIHByZXNlbnQgb24gc2hpcFxuICAgICAgaWYgKCFzaGlwc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLnNoaXBcIikpIHtcbiAgICAgICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIubWluaS1nYW1lYm9hcmRcIikuYXBwZW5kKC4uLmdiKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbCk7XG5cbiAgcGxhY2VSYW5kb21TaGlwcyhjb21wdXRlci5nYiwgc2hpcHMpO1xufTtcblxuY29uc3QgZW5kR2FtZSA9IChwbGF5ZXJXaW4pID0+IHtcbiAgY29uc3QgbW9kYWwgPSBjcmVhdGVNb2RhbCgpO1xuICBtb2RhbC5pbm5lckhUTUwgPSBgXG4gICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgIDxwPiR7cGxheWVyV2luID8gXCJQbGF5ZXIgd2lucyFcIiA6IFwiQ29tcHV0ZXIgd2lucyFcIn08L3A+XG4gICAgIDxidXR0b24+UGxheSBBZ2FpbjwvYnV0dG9uPlxuICAgPC9kaXY+XG4gICAgIGA7XG4gIG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICBnYW1lTG9vcCgpO1xuICB9KTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbCk7XG59O1xuXG4vLyBtZXRob2QgdGhhdCBtYXJrcyB0aGUgY2VsbFxuY29uc3QgbWFya0NlbGwgPSAoY2VsbCwgaXNTaGlwKSA9PiB7XG4gIGNlbGwuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gIGlmIChpc1NoaXApIHtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJpc1NoaXBcIik7XG4gIH1cbn07XG5cbmNvbnN0IGdhbWVMb29wID0gKCkgPT4ge1xuICBjb25zdCBwbGF5ZXIgPSBuZXcgUGxheWVyKFwicGxheWVyXCIpO1xuICBjb25zdCBib3QgPSBuZXcgUGxheWVyKFwiYm90XCIsIHRydWUpO1xuICBjb25zdCBuZXdCb2FyZCA9IGdlbmVyYXRlQm9hcmQocGxheWVyLmdiLmJvZHkpO1xuICBvcGVuaW5nTW9kYWwocGxheWVyLCBuZXdCb2FyZCwgYm90KTtcbiAgY29uc3Qgb25DZWxsQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY2xpY2tlZENvb3JkID0gSlNPTi5wYXJzZSh0aGlzLmRhdGFzZXQuY29vcmRpbmF0ZXMpO1xuICAgIC8vIFJldHVybnMgYm9vbCBzaGlwIGlzIGhpdFxuICAgIGNvbnN0IHN1Y2Nlc3MgPSBwbGF5ZXIuYXR0YWNrRW5lbXkoY2xpY2tlZENvb3JkLCBib3QpO1xuICAgIG1hcmtDZWxsKHRoaXMsIHN1Y2Nlc3MpO1xuXG4gICAgaWYgKGJvdC5nYi5hcmVBbGxTdW5rZWQoKSB8fCBib3QuaXNHYW1lT3ZlcigpKSB7XG4gICAgICBlbmRHYW1lKHRydWUpO1xuICAgIH1cblxuICAgIC8vIEVuZW15IENvbXB1dGVyXG4gICAgY29uc3QgeyBjb29yZDogZW5lbXlDb29yZCwgaGl0OiBlbmVteVN1Y2Nlc3MgfSA9IGJvdC5hdHRhY2tSYW5kb21seShwbGF5ZXIpO1xuICAgIGNvbnN0IGF0dGFja2VkQ2VsbCA9IG5ld0JvYXJkLmZpbmQoXG4gICAgICAoZGl2KSA9PiBkaXYuZGF0YXNldC5jb29yZGluYXRlcyA9PT0gSlNPTi5zdHJpbmdpZnkoZW5lbXlDb29yZClcbiAgICApO1xuXG4gICAgbWFya0NlbGwoYXR0YWNrZWRDZWxsLCBlbmVteVN1Y2Nlc3MpO1xuICAgIGlmIChwbGF5ZXIuZ2IuYXJlQWxsU3Vua2VkKCkgfHwgaGFzTm9Nb3Zlc0xlZnQodGhpcykpIHtcbiAgICAgIGVuZEdhbWUoZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBib3RCb2FyZCA9IGdlbmVyYXRlQm9hcmQoYm90LmdiLmJvZHksIG9uQ2VsbENsaWNrKTtcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYXllclwiKS5yZXBsYWNlQ2hpbGRyZW4oLi4ubmV3Qm9hcmQpO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbXB1dGVyXCIpLnJlcGxhY2VDaGlsZHJlbiguLi5ib3RCb2FyZCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lTG9vcDtcbiIsImNvbnN0IFNJWkUgPSAxMDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2FtZUJvYXJkKCkge1xuICAvLyBGaWxscyAxMDAgY2VsbHMgd2l0aCBudWxsLiBNYXAgaXMgaW1wb3J0YW50IGluIG9yZGVyIHRvIGNyZWF0ZSBuZXcgYXJyYXkgYW5kIG5vdCBqdXN0IGEgcmVmZXJlbmNlXG4gIGNvbnN0IGJvZHkgPSBuZXcgQXJyYXkoU0laRSkuZmlsbChudWxsKS5tYXAoKCkgPT4gbmV3IEFycmF5KFNJWkUpLmZpbGwobnVsbCkpO1xuICBjb25zdCBfc2hpcEFycmF5ID0gW107XG4gIGNvbnN0IF9taXNzZWRBdHRhY2tzID0gW107XG4gIGNvbnN0IF9oaXRBdHRhY2tzID0gW107XG5cbiAgY29uc3Qgc2hpcENvb3JkaW5hdGVzID0gKGNvbCwgcm93LCBpc1ZlcnRpY2FsLCBsZW5ndGgpID0+IHtcbiAgICBjb25zdCBhcnIgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBhcnIucHVzaChpc1ZlcnRpY2FsID8gW3JvdyArIGksIGNvbF0gOiBbcm93LCBjb2wgKyBpXSk7XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gKHsgeDogY29sLCB5OiByb3csIGlzVmVydGljYWwgfSwgc2hpcCkgPT4ge1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gc2hpcENvb3JkaW5hdGVzKGNvbCwgcm93LCBpc1ZlcnRpY2FsLCBzaGlwLmxlbmd0aCk7XG4gICAgLy8gKiBDaGVjayBpZiB0aGVyZSBpcyBhbHJlYWR5IGFub3RoZXIgc2hpcCB0aGVyZVxuICAgIGNvbnN0IGlzQXZhaWxhYmxlID0gY29vcmRpbmF0ZXMuZXZlcnkoXG4gICAgICAoW3ksIHhdKSA9PlxuICAgICAgICBib2R5W3ldICE9PSB1bmRlZmluZWQgJiYgYm9keVt5XVt4XSAhPT0gdW5kZWZpbmVkICYmICFib2R5W3ldW3hdXG4gICAgKTtcbiAgICBpZiAoIWlzQXZhaWxhYmxlKSByZXR1cm4gZmFsc2U7XG4gICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgIGNvbnN0IFt5LCB4XSA9IGNvb3JkO1xuICAgICAgYm9keVt5XVt4XSA9IHRydWU7XG4gICAgfSk7XG4gICAgX3NoaXBBcnJheS5wdXNoKHsgY29vcmRpbmF0ZXMsIHNoaXAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUF0dGFjayA9IChjb29yKSA9PiB7XG4gICAgY29uc3QgW3JvdywgY29sXSA9IGNvb3I7XG4gICAgLy8gY2hlY2sgaWYgYWxyZWFkeSBiZWVuIHBsYWNlZC9taXNzZWQgc2FtZSBzcG90XG4gICAgaWYgKF9taXNzZWRBdHRhY2tzLmZpbHRlcigoW3ksIHhdKSA9PiB5ID09PSByb3cgJiYgeCA9PT0gY29sKS5sZW5ndGgpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgaWYgKF9oaXRBdHRhY2tzLmZpbHRlcigoW3ksIHhdKSA9PiB5ID09PSByb3cgJiYgeCA9PT0gY29sKS5sZW5ndGgpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gcmVjb3JkIHRoZSBjb29yZGluYXRlIG9mIG1pc3NlZCBzaG90XG4gICAgaWYgKCFib2R5W3Jvd11bY29sXSkge1xuICAgICAgX21pc3NlZEF0dGFja3MucHVzaChbcm93LCBjb2xdKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gc2VuZCBoaXQgZnVuY3Rpb24gdG8gc2hpcFxuICAgIGxldCBpbmRleCA9IG51bGw7XG4gICAgY29uc3Qgc2hpcE9iamVjdCA9IF9zaGlwQXJyYXkuZmluZCgob2JqKSA9PlxuICAgICAgb2JqLmNvb3JkaW5hdGVzLmZpbmQoKFt5LCB4XSwgaWR4KSA9PiB7XG4gICAgICAgIGlmICh5ID09PSBjb29yWzBdICYmIHggPT09IGNvb3JbMV0pIHtcbiAgICAgICAgICBpbmRleCA9IGlkeDtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICAgIF9oaXRBdHRhY2tzLnB1c2goY29vcik7XG4gICAgc2hpcE9iamVjdC5zaGlwLmhpdChpbmRleCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgZ2V0TWlzc2VkQXR0YWNrcyA9ICgpID0+IF9taXNzZWRBdHRhY2tzO1xuXG4gIGNvbnN0IGFyZUFsbFN1bmtlZCA9ICgpID0+IHtcbiAgICByZXR1cm4gX3NoaXBBcnJheS5ldmVyeSgoeyBzaGlwIH0pID0+IHNoaXAuaXNTdW5rKCkpO1xuICB9O1xuXG4gIHJldHVybiB7IGJvZHksIHBsYWNlU2hpcCwgcmVjZWl2ZUF0dGFjaywgZ2V0TWlzc2VkQXR0YWNrcywgYXJlQWxsU3Vua2VkIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaGlwKGxlbiA9IDMpIHtcbiAgY29uc3QgYm9keSA9IG5ldyBBcnJheShsZW4pLmZpbGwoZmFsc2UpO1xuXG4gIGNvbnN0IHsgbGVuZ3RoIH0gPSBib2R5O1xuICBjb25zdCBoaXQgPSAocG9zaXRpb24pID0+IHtcbiAgICBpZiAoYm9keVtwb3NpdGlvbl0pIHJldHVybiBmYWxzZTtcbiAgICBib2R5W3Bvc2l0aW9uXSA9IHRydWU7XG4gICAgcmV0dXJuIGJvZHlbcG9zaXRpb25dO1xuICB9O1xuXG4gIGNvbnN0IGlzU3VuayA9ICgpID0+IGJvZHkuZXZlcnkoKHBhcnQpID0+IHBhcnQpO1xuXG4gIHJldHVybiB7IGxlbmd0aCwgaGl0LCBpc1N1bmsgfTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGdhbWVMb29wIGZyb20gXCIuL21vZHVsZXMvZ2FtZVwiO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZ2FtZUxvb3ApO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9