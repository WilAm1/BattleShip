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
* Add Initialize ships
* Display Own Ships
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
      ship.dataset.isVertical = Number(ship.dataset.isVertical) ? 0 : 1;
    });
  });

  // * Add function that will populate ships on the player side! Make it remove the ship
  // * (Partial) Ship names and Instruction on Modal Content
  // * If there are no ships left, Remove the Modal Content and Start the Game!
  // TODO Populate Computer Board with random ships
  // TODO Refactor!

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
  // Make the Placement of Random ships on Computer Board!
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7Ozs7O0FDdk94Qjs7QUFFZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixZQUFZO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1Qiw0QkFBNEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLHNCQUFzQixtQkFBbUI7QUFDekM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSwrQkFBK0IsTUFBTTtBQUNyQzs7QUFFQSxXQUFXO0FBQ1g7Ozs7Ozs7Ozs7Ozs7OztBQ2xFZTtBQUNmOztBQUVBLFVBQVUsU0FBUztBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFdBQVc7QUFDWDs7Ozs7OztVQ2JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOc0M7O0FBRXRDLDRDQUE0QyxxREFBUSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICAjcG9zc2libGVNb3ZlcyA9IFtdO1xuICBjb25zdHJ1Y3RvcihuYW1lLCBpc0NvbXB1dGVyKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmlzQ29tcHV0ZXIgPSBpc0NvbXB1dGVyO1xuICAgIHRoaXMuZ2IgPSBuZXcgR2FtZUJvYXJkKCk7XG4gICAgaWYgKHRoaXMuaXNDb21wdXRlcikge1xuICAgICAgdGhpcy4jcG9zc2libGVNb3ZlcyA9IHRoaXMuZ2VuZXJhdGVNb3Zlcyh0aGlzLmdiLmJvZHkubGVuZ3RoKTtcbiAgICB9XG4gIH1cbiAgZ2V0IHBvc3NpYmxlTW92ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Bvc3NpYmxlTW92ZXM7XG4gIH1cbiAgZ2VuZXJhdGVNb3ZlcyhsZW4pIHtcbiAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgYXJyYXkucHVzaChbaSwgal0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cbiAgYXR0YWNrRW5lbXkoY29vcmQsIGVuZW15KSB7XG4gICAgLy8gYXR0YWNrIHRoZSBlbmVteSBzaGlwXG4gICAgcmV0dXJuIGVuZW15LmdiLnJlY2VpdmVBdHRhY2soY29vcmQpO1xuICB9XG4gIGF0dGFja1JhbmRvbWx5KGVuZW15KSB7XG4gICAgaWYgKCF0aGlzLmlzQ29tcHV0ZXIpIHJldHVybiBbXTtcbiAgICAvLyBQaWNrcyBhIHJhbmRvbSBudW1iZXIgZnJvbSB0aGUgbGlzdCBhbmQgcmVtb3ZlcyBpdFxuICAgIGNvbnN0IHJhbmRJbnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLiNwb3NzaWJsZU1vdmVzLmxlbmd0aCk7XG4gICAgY29uc3QgW2Nvb3JkXSA9IHRoaXMuI3Bvc3NpYmxlTW92ZXMuc3BsaWNlKHJhbmRJbnQsIDEpO1xuICAgIGNvbnN0IHN1Y2Nlc3MgPSB0aGlzLmF0dGFja0VuZW15KGNvb3JkLCBlbmVteSk7XG4gICAgcmV0dXJuIHsgY29vcmQsIGhpdDogc3VjY2VzcyB9O1xuICB9XG4gIGlzR2FtZU92ZXIoKSB7XG4gICAgLy8gSWYgdGhlcmUgYXJlIG5vIG1vdmVzIGxlZnRcbiAgICByZXR1cm4gIXRoaXMuI3Bvc3NpYmxlTW92ZXMubGVuZ3RoO1xuICB9XG59XG4iLCJjb25zdCBnZW5lcmF0ZUJvYXJkID0gKGJvYXJkLCBjYikgPT4ge1xuICAvLyAqIGdlbmVyYXRlcyBhIGdyaWQgQm9hcmRcbiAgY29uc3QgYXJyYXkgPSBbXTtcbiAgYm9hcmQuZm9yRWFjaCgocm93LCByb3dJZHgpID0+IHtcbiAgICByb3cuZm9yRWFjaCgoY29sdW1uLCBjb2xJZHgpID0+IHtcbiAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgY2VsbC5kYXRhc2V0LmNvb3JkaW5hdGVzID0gSlNPTi5zdHJpbmdpZnkoW3Jvd0lkeCwgY29sSWR4XSk7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgY2VsbC5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgIGlmIChjYikge1xuICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYik7XG4gICAgICB9XG4gICAgICBhcnJheS5wdXNoKGNlbGwpO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGFycmF5O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVCb2FyZDtcbiIsIi8qIFxuKiBSZWZhY3RvciAoTWFya2luZyBmdW5jdGlvbnMpXG4qIEFkZCBFbmRpbmcgR2FtZSBhbmQgcmVtb3ZlIGFsZXJ0c1xuKiBBZGQgSW5pdGlhbGl6ZSBzaGlwc1xuKiBEaXNwbGF5IE93biBTaGlwc1xuVE9ETyBBZGQgUmFuZG9taXplIGVuZW15IHNoaXBzXG5UT0RPIEluaGVyaXQgUGxheWVyIENsYXNzIENvbXB1dGVyIENsYXNzXG4qL1xuXG5pbXBvcnQgZ2VuZXJhdGVCb2FyZCBmcm9tIFwiLi9jb21wb25lbnRzL2JvYXJkXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL1BsYXllclwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi9nYW1lQm9hcmRcIjtcblxuY29uc3QgaGFzTm9Nb3Zlc0xlZnQgPSAoY2VsbCkgPT4ge1xuICByZXR1cm4gIWNlbGwucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFjdGl2ZVwiKS5sZW5ndGg7XG59O1xuXG5jb25zdCBjcmVhdGVNb2RhbCA9ICgpID0+IHtcbiAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBtb2RhbC5jbGFzc0xpc3QuYWRkKFwibW9kYWxcIik7XG4gIHJldHVybiBtb2RhbDtcbn07XG4vLyAqIFJlbW92ZXMgY2hpbGQgdXNpbmcgcGFyZW50RWxlbWVudC5yZW1vZXZDaGlsZCBhbmQgYXBwZW5kQ2hpbGRcbmNvbnN0IG9uRHJhZyA9IChlKSA9PiB7XG4gIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeShlLnRhcmdldC5kYXRhc2V0KTtcbiAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgbWVzc2FnZSk7XG4gIGUudGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAwLjU7XG59O1xuXG5jb25zdCBvbkRyYWdFbmQgPSAoZSkgPT4ge1xuICBlLnRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMTtcbn07XG5jb25zdCBvbkRyb3AgPSAoZSkgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnN0IGRhdGEgPSBlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwidGV4dFwiKTtcbn07XG5jb25zdCBtYWtlU2hpcEVsZW1lbnQgPSAoW3NoaXBOYW1lLCBsZW5ndGhdKSA9PiB7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICBlbGVtZW50LmRhdGFzZXQuc2hpcE5hbWUgPSBzaGlwTmFtZTtcbiAgZWxlbWVudC5kYXRhc2V0LnNoaXBMZW5ndGggPSBsZW5ndGg7XG4gIGVsZW1lbnQuZGF0YXNldC5pc1ZlcnRpY2FsID0gMDtcbiAgZWxlbWVudC5kcmFnZ2FibGUgPSB0cnVlO1xuICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgb25EcmFnKTtcbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VuZFwiLCBvbkRyYWdFbmQpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNlbGwpO1xuICB9XG4gIHJldHVybiBlbGVtZW50O1xufTtcbmNvbnN0IHNoaXBDb29yZGluYXRlcyA9IChjb2wsIHJvdywgaXNWZXJ0aWNhbCwgbGVuZ3RoKSA9PiB7XG4gIGNvbnN0IGFyciA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgYXJyLnB1c2goaXNWZXJ0aWNhbCA/IFtyb3cgKyBpLCBjb2xdIDogW3JvdywgY29sICsgaV0pO1xuICB9XG4gIHJldHVybiBhcnI7XG59O1xuXG5jb25zdCBvcGVuaW5nTW9kYWwgPSAocGxheWVyLCBib2FyZCkgPT4ge1xuICAvL2luaXRpbGlhemUgbW9kYWxcbiAgY29uc3QgbW9kYWwgPSBjcmVhdGVNb2RhbCgpO1xuICAvLyBDcmVhdGUgbW9kZWw7XG4gIG1vZGFsLmlubmVySFRNTCA9IGBcbiAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgPHA+V2VsY29tZSB0byBCYXR0bGVzaGlwPC9wPlxuICA8ZGl2IGNsYXNzPVwid3JhcHBlclwiPlxuICAgIDxkaXYgY2xhc3M9XCJtaW5pLWdhbWVib2FyZFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzaGlwc1wiPlxuICAgICAgICA8cD5QbGFjZSB5b3VyIHNoaXBzIGJ5IGRyYWdnaW5nIGFuZCBkcm9wcGluZyBpdCBpbnRvIHRoZSBib2FyZDwvcD5cbiAgICAgICAgPGJ1dHRvbj5Sb3RhdGUg8J+UgzwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPC9kaXY+XG4gIGA7XG4gIGNvbnN0IHNoaXBzQ29udGFpbmVyID0gbW9kYWwucXVlcnlTZWxlY3RvcihcIi5zaGlwc1wiKTtcbiAgLy8gVE9ETyBBZGQgZHJhZ2dhYmxlIFNoaXBzXG4gIGNvbnN0IHNoaXBzID0ge1xuICAgIENhcnJpZXI6IDUsXG4gICAgQmF0dGxlc2hpcDogNCxcbiAgICBEZXN0cm95ZXI6IDMsXG4gICAgU3VibWFyaW5lOiAzLFxuICAgIFwiUGF0cm9sIEJvYXRcIjogMixcbiAgfTtcblxuICBjb25zdCBzaGlwRWxlbWVudHMgPSBPYmplY3QuZW50cmllcyhzaGlwcykubWFwKG1ha2VTaGlwRWxlbWVudCk7XG4gIHNoaXBzQ29udGFpbmVyLmFwcGVuZCguLi5zaGlwRWxlbWVudHMpO1xuICBjb25zdCByb3RhdGUgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uXCIpO1xuICByb3RhdGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBzaGlwRWxlbWVudHMuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgc2hpcC5jbGFzc0xpc3QudG9nZ2xlKFwidmVydGljYWxcIik7XG4gICAgICBzaGlwLmRhdGFzZXQuaXNWZXJ0aWNhbCA9IE51bWJlcihzaGlwLmRhdGFzZXQuaXNWZXJ0aWNhbCkgPyAwIDogMTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gKiBBZGQgZnVuY3Rpb24gdGhhdCB3aWxsIHBvcHVsYXRlIHNoaXBzIG9uIHRoZSBwbGF5ZXIgc2lkZSEgTWFrZSBpdCByZW1vdmUgdGhlIHNoaXBcbiAgLy8gKiAoUGFydGlhbCkgU2hpcCBuYW1lcyBhbmQgSW5zdHJ1Y3Rpb24gb24gTW9kYWwgQ29udGVudFxuICAvLyAqIElmIHRoZXJlIGFyZSBubyBzaGlwcyBsZWZ0LCBSZW1vdmUgdGhlIE1vZGFsIENvbnRlbnQgYW5kIFN0YXJ0IHRoZSBHYW1lIVxuICAvLyBUT0RPIFBvcHVsYXRlIENvbXB1dGVyIEJvYXJkIHdpdGggcmFuZG9tIHNoaXBzXG4gIC8vIFRPRE8gUmVmYWN0b3IhXG5cbiAgY29uc3QgZ2IgPSBnZW5lcmF0ZUJvYXJkKHBsYXllci5nYi5ib2R5KTtcbiAgZ2IuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbnRlclwiLCAoZSkgPT4ge1xuICAgICAgZS50YXJnZXQuc3R5bGUub3BhY2l0eSA9IDAuNTtcbiAgICB9KTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgKGUpID0+IHtcbiAgICAgIGUudGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgIH0pO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiZHJvcFwiLCAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZS50YXJnZXQuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICBjb25zdCBbeSwgeF0gPSBKU09OLnBhcnNlKGUudGFyZ2V0LmRhdGFzZXQuY29vcmRpbmF0ZXMpO1xuICAgICAgbGV0IHtcbiAgICAgICAgc2hpcE5hbWUsXG4gICAgICAgIHNoaXBMZW5ndGg6IGxlbmd0aCxcbiAgICAgICAgaXNWZXJ0aWNhbCxcbiAgICAgIH0gPSBKU09OLnBhcnNlKGUuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJ0ZXh0XCIpKTtcbiAgICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpO1xuICAgICAgaXNWZXJ0aWNhbCA9IE51bWJlcihpc1ZlcnRpY2FsKTtcblxuICAgICAgY29uc3QgcG9zc2liZUNvb3JkaW5hdGVzID0gc2hpcENvb3JkaW5hdGVzKHgsIHksIGlzVmVydGljYWwsIGxlbmd0aCk7XG4gICAgICBjb25zdCBpc1NoaXBTdWNjZXNzZnVsID0gcGxheWVyLmdiLnBsYWNlU2hpcChcbiAgICAgICAge1xuICAgICAgICAgIHgsXG4gICAgICAgICAgeSxcbiAgICAgICAgICBpc1ZlcnRpY2FsLFxuICAgICAgICB9LFxuICAgICAgICBuZXcgU2hpcChsZW5ndGgpXG4gICAgICApO1xuICAgICAgaWYgKCFpc1NoaXBTdWNjZXNzZnVsKSByZXR1cm47XG4gICAgICBjb25zdCBteUNvb3JkID0gZ2IuZmlsdGVyKChjZWxsKSA9PiB7XG4gICAgICAgIGNvbnN0IFt5LCB4XSA9IEpTT04ucGFyc2UoY2VsbC5kYXRhc2V0LmNvb3JkaW5hdGVzKTtcbiAgICAgICAgZm9yIChjb25zdCBbcm93LCBjb2xdIG9mIHBvc3NpYmVDb29yZGluYXRlcykge1xuICAgICAgICAgIGlmIChyb3cgPT09IHkgJiYgY29sID09PSB4KSB7XG4gICAgICAgICAgICByZXR1cm4gY2VsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gRGlzcHBsYXkgdGhlIHNoaXBzXG4gICAgICBteUNvb3JkLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgc2hpcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgIGJvYXJkLmZpbmQoXG4gICAgICAgICAgKG1haW5TaGlwKSA9PlxuICAgICAgICAgICAgbWFpblNoaXAuZGF0YXNldC5jb29yZGluYXRlcyA9PT0gc2hpcC5kYXRhc2V0LmNvb3JkaW5hdGVzXG4gICAgICAgICkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFJlbW92ZXMgdGhlIFNoaXBcbiAgICAgIGNvbnN0IHNoaXBOb2RlID0gc2hpcHNDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYFtkYXRhLXNoaXAtbmFtZT1cIiR7c2hpcE5hbWV9XCJgXG4gICAgICApO1xuICAgICAgc2hpcE5vZGUucmVtb3ZlKCk7XG4gICAgICAvLyBDaGVjayBpZiBTaGlwcyBhcmUgc3RpbGwgcHJlc2VudCBvbiBzaGlwXG4gICAgICBpZiAoIXNoaXBzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcFwiKSkge1xuICAgICAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIubWluaS1nYW1lYm9hcmRcIikuYXBwZW5kKC4uLmdiKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtb2RhbCk7XG4gIC8vIE1ha2UgdGhlIFBsYWNlbWVudCBvZiBSYW5kb20gc2hpcHMgb24gQ29tcHV0ZXIgQm9hcmQhXG59O1xuXG5jb25zdCBlbmRHYW1lID0gKHBsYXllcldpbikgPT4ge1xuICBjb25zdCBtb2RhbCA9IGNyZWF0ZU1vZGFsKCk7XG4gIG1vZGFsLmlubmVySFRNTCA9IGBcbiAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgPHA+JHtwbGF5ZXJXaW4gPyBcIllvdSB3aW4hXCIgOiBcIkNvbXAgd2luIVwifTwvcD5cbiAgICAgPGJ1dHRvbj5QbGF5IEFnYWluPC9idXR0b24+XG4gICA8L2Rpdj5cbiAgICAgYDtcbiAgbW9kYWwucXVlcnlTZWxlY3RvcihcImJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGdhbWVMb29wKCk7XG4gICAgbW9kYWwucmVtb3ZlKCk7XG4gIH0pO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZGFsKTtcbn07XG5cbi8vIG1ldGhvZCB0aGF0IG1hcmtzIHRoZSBjZWxsXG5jb25zdCBtYXJrQ2VsbCA9IChjZWxsLCBpc1NoaXApID0+IHtcbiAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XG4gIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgaWYgKGlzU2hpcCkge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImlzU2hpcFwiKTtcbiAgfVxufTtcblxuY29uc3QgZ2FtZUxvb3AgPSAoKSA9PiB7XG4gIGNvbnN0IHAxID0gbmV3IFBsYXllcihcInAxXCIpO1xuICBjb25zdCBib3QgPSBuZXcgUGxheWVyKFwiYm90XCIsIHRydWUpO1xuICBjb25zdCBuZXdCb2FyZCA9IGdlbmVyYXRlQm9hcmQocDEuZ2IuYm9keSk7XG4gIG9wZW5pbmdNb2RhbChwMSwgbmV3Qm9hcmQpO1xuXG4gIC8vICAgcDEuZ2IucGxhY2VTaGlwKHsgeDogMCwgeTogMCB9LCBuZXcgU2hpcCgpKTtcbiAgLy8gICBib3QuZ2IucGxhY2VTaGlwKHsgeDogMSwgeTogMSB9LCBuZXcgU2hpcCgpKTtcblxuICBjb25zdCBvbkNlbGxDbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBjbGlja2VkQ29vcmQgPSBKU09OLnBhcnNlKHRoaXMuZGF0YXNldC5jb29yZGluYXRlcyk7XG4gICAgLy8gUmV0dXJucyBib29sIHNoaXAgaXMgaGl0XG4gICAgY29uc3Qgc3VjY2VzcyA9IHAxLmF0dGFja0VuZW15KGNsaWNrZWRDb29yZCwgYm90KTtcbiAgICBtYXJrQ2VsbCh0aGlzLCBzdWNjZXNzKTtcblxuICAgIGlmIChib3QuZ2IuYXJlQWxsU3Vua2VkKCkgfHwgYm90LmlzR2FtZU92ZXIoKSkge1xuICAgICAgZW5kR2FtZSh0cnVlKTtcbiAgICB9XG5cbiAgICAvLyBFbmVteSBDb21wXG4gICAgY29uc3QgeyBjb29yZDogZW5lbXlDb29yZCwgaGl0OiBlbmVteVN1Y2Nlc3MgfSA9IGJvdC5hdHRhY2tSYW5kb21seShwMSk7XG4gICAgLy8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZW5lbXlDb29yZCkpO1xuICAgIGNvbnN0IGF0dGFja2VkQ2VsbCA9IG5ld0JvYXJkLmZpbmQoXG4gICAgICAoZGl2KSA9PiBkaXYuZGF0YXNldC5jb29yZGluYXRlcyA9PT0gSlNPTi5zdHJpbmdpZnkoZW5lbXlDb29yZClcbiAgICApO1xuXG4gICAgbWFya0NlbGwoYXR0YWNrZWRDZWxsLCBlbmVteVN1Y2Nlc3MpO1xuICAgIGlmIChwMS5nYi5hcmVBbGxTdW5rZWQoKSB8fCBoYXNOb01vdmVzTGVmdCh0aGlzKSkge1xuICAgICAgZW5kR2FtZShmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGJvdEJvYXJkID0gZ2VuZXJhdGVCb2FyZChib3QuZ2IuYm9keSwgb25DZWxsQ2xpY2spO1xuXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxheWVyXCIpLnJlcGxhY2VDaGlsZHJlbiguLi5uZXdCb2FyZCk7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29tcHV0ZXJcIikucmVwbGFjZUNoaWxkcmVuKC4uLmJvdEJvYXJkKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVMb29wO1xuIiwiY29uc3QgU0laRSA9IDEwO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHYW1lQm9hcmQoKSB7XG4gIC8vIEZpbGxzIDEwMCBjZWxscyB3aXRoIG51bGwuIE1hcCBpcyBpbXBvcnRhbnQgaW4gb3JkZXIgdG8gY3JlYXRlIG5ldyBhcnJheSBhbmQgbm90IGp1c3QgYSByZWZlcmVuY2VcbiAgY29uc3QgYm9keSA9IG5ldyBBcnJheShTSVpFKS5maWxsKG51bGwpLm1hcCgoKSA9PiBuZXcgQXJyYXkoU0laRSkuZmlsbChudWxsKSk7XG4gIGNvbnN0IF9zaGlwQXJyYXkgPSBbXTtcbiAgY29uc3QgX21pc3NlZEF0dGFja3MgPSBbXTtcbiAgY29uc3QgX2hpdEF0dGFja3MgPSBbXTtcblxuICBjb25zdCBzaGlwQ29vcmRpbmF0ZXMgPSAoY29sLCByb3csIGlzVmVydGljYWwsIGxlbmd0aCkgPT4ge1xuICAgIGNvbnN0IGFyciA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGFyci5wdXNoKGlzVmVydGljYWwgPyBbcm93ICsgaSwgY29sXSA6IFtyb3csIGNvbCArIGldKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSAoeyB4OiBjb2wsIHk6IHJvdywgaXNWZXJ0aWNhbCB9LCBzaGlwKSA9PiB7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSBzaGlwQ29vcmRpbmF0ZXMoY29sLCByb3csIGlzVmVydGljYWwsIHNoaXAubGVuZ3RoKTtcbiAgICAvLyAqIENoZWNrIGlmIHRoZXJlIGlzIGFscmVhZHkgYW5vdGhlciBzaGlwIHRoZXJlXG4gICAgY29uc3QgaXNBdmFpbGFibGUgPSBjb29yZGluYXRlcy5ldmVyeShcbiAgICAgIChbeSwgeF0pID0+ICFib2R5W3ldW3hdICYmIGJvZHlbeV1beF0gIT09IHVuZGVmaW5lZFxuICAgICk7XG4gICAgaWYgKCFpc0F2YWlsYWJsZSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICBjb25zdCBbeSwgeF0gPSBjb29yZDtcbiAgICAgIGJvZHlbeV1beF0gPSB0cnVlO1xuICAgIH0pO1xuICAgIF9zaGlwQXJyYXkucHVzaCh7IGNvb3JkaW5hdGVzLCBzaGlwIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAoY29vcikgPT4ge1xuICAgIGNvbnN0IFtyb3csIGNvbF0gPSBjb29yO1xuICAgIC8vIGNoZWNrIGlmIGFscmVhZHkgYmVlbiBwbGFjZWQvbWlzc2VkIHNhbWUgc3BvdFxuICAgIGlmIChfbWlzc2VkQXR0YWNrcy5maWx0ZXIoKFt5LCB4XSkgPT4geSA9PT0gcm93ICYmIHggPT09IGNvbCkubGVuZ3RoKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChfaGl0QXR0YWNrcy5maWx0ZXIoKFt5LCB4XSkgPT4geSA9PT0gcm93ICYmIHggPT09IGNvbCkubGVuZ3RoKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIHJlY29yZCB0aGUgY29vcmRpbmF0ZSBvZiBtaXNzZWQgc2hvdFxuICAgIGlmICghYm9keVtyb3ddW2NvbF0pIHtcbiAgICAgIF9taXNzZWRBdHRhY2tzLnB1c2goW3JvdywgY29sXSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIHNlbmQgaGl0IGZ1bmN0aW9uIHRvIHNoaXBcbiAgICBsZXQgaW5kZXggPSBudWxsO1xuICAgIGNvbnN0IHNoaXBPYmplY3QgPSBfc2hpcEFycmF5LmZpbmQoKG9iaikgPT5cbiAgICAgIG9iai5jb29yZGluYXRlcy5maW5kKChbeSwgeF0sIGlkeCkgPT4ge1xuICAgICAgICBpZiAoeSA9PT0gY29vclswXSAmJiB4ID09PSBjb29yWzFdKSB7XG4gICAgICAgICAgaW5kZXggPSBpZHg7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgICBfaGl0QXR0YWNrcy5wdXNoKGNvb3IpO1xuICAgIHNoaXBPYmplY3Quc2hpcC5oaXQoaW5kZXgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGdldE1pc3NlZEF0dGFja3MgPSAoKSA9PiBfbWlzc2VkQXR0YWNrcztcblxuICBjb25zdCBhcmVBbGxTdW5rZWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIF9zaGlwQXJyYXkuZXZlcnkoKHsgc2hpcCB9KSA9PiBzaGlwLmlzU3VuaygpKTtcbiAgfTtcblxuICByZXR1cm4geyBib2R5LCBwbGFjZVNoaXAsIHJlY2VpdmVBdHRhY2ssIGdldE1pc3NlZEF0dGFja3MsIGFyZUFsbFN1bmtlZCB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2hpcChsZW4gPSAzKSB7XG4gIGNvbnN0IGJvZHkgPSBuZXcgQXJyYXkobGVuKS5maWxsKGZhbHNlKTtcblxuICBjb25zdCB7IGxlbmd0aCB9ID0gYm9keTtcbiAgY29uc3QgaGl0ID0gKHBvc2l0aW9uKSA9PiB7XG4gICAgaWYgKGJvZHlbcG9zaXRpb25dKSByZXR1cm4gZmFsc2U7XG4gICAgYm9keVtwb3NpdGlvbl0gPSB0cnVlO1xuICAgIHJldHVybiBib2R5W3Bvc2l0aW9uXTtcbiAgfTtcblxuICBjb25zdCBpc1N1bmsgPSAoKSA9PiBib2R5LmV2ZXJ5KChwYXJ0KSA9PiBwYXJ0KTtcblxuICByZXR1cm4geyBsZW5ndGgsIGhpdCwgaXNTdW5rIH07XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBnYW1lTG9vcCBmcm9tIFwiLi9tb2R1bGVzL2dhbWVcIjtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGdhbWVMb29wKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==