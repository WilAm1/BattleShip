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
    // generate ships
    this.gb.placeShip({ x: 0, y: 0 }, new _ship__WEBPACK_IMPORTED_MODULE_1__["default"]());
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
TODO Refactor (Marking functions)
TODO Display Own Ships
TODO Add Ending Game and remove alerts
TODO Add Initialize ships
TODO Add Randomize enemy ships
TODO Inherit Player Class Computer Class
*/





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
  const p1 = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]("p1");
  const bot = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]("bot", true);
  // Populate with predetermined coordinates
  p1.gb.placeShip({ x: 0, y: 0 }, new _ship__WEBPACK_IMPORTED_MODULE_2__["default"]());
  bot.gb.placeShip({ x: 0, y: 0 }, new _ship__WEBPACK_IMPORTED_MODULE_2__["default"]());
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
  const newBoard = (0,_components_board__WEBPACK_IMPORTED_MODULE_0__["default"])(p1.gb.body);
  const botBoard = (0,_components_board__WEBPACK_IMPORTED_MODULE_0__["default"])(bot.gb.body, onCellClick);

  document.querySelector("#player").append(...newBoard);
  document.querySelector("#computer").append(...botBoard);
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
    const isAvailable = coordinates.every(([y, x]) => !body[y][x]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQW9DO0FBQ1Y7O0FBRVg7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixrREFBUztBQUMzQjtBQUNBLHdCQUF3QixZQUFZLE1BQU0sNkNBQUk7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0Isc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBOztBQUVBLGlFQUFlLGFBQWEsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEI3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUUrQztBQUNqQjtBQUNKOztBQUUxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLCtDQUFNO0FBQ3ZCLGtCQUFrQiwrQ0FBTTtBQUN4QjtBQUNBLG9CQUFvQixZQUFZLE1BQU0sNkNBQUk7QUFDMUMscUJBQXFCLFlBQVksTUFBTSw2Q0FBSTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSx1Q0FBdUM7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CLDZEQUFhO0FBQ2hDLG1CQUFtQiw2REFBYTs7QUFFaEM7QUFDQTtBQUNBOztBQUVBLGlFQUFlLFFBQVEsRUFBQzs7Ozs7Ozs7Ozs7Ozs7O0FDckV4Qjs7QUFFZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixZQUFZO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1Qiw0QkFBNEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsc0JBQXNCLG1CQUFtQjtBQUN6QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLCtCQUErQixNQUFNO0FBQ3JDOztBQUVBLFdBQVc7QUFDWDs7Ozs7Ozs7Ozs7Ozs7O0FDaEVlO0FBQ2Y7O0FBRUEsVUFBVSxTQUFTOztBQUVuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFdBQVc7QUFDWDs7Ozs7OztVQ2RBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOc0M7O0FBRXRDLDRDQUE0QyxxREFBUSIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9QbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIge1xuICAjcG9zc2libGVNb3ZlcyA9IFtdO1xuICBjb25zdHJ1Y3RvcihuYW1lLCBpc0NvbXB1dGVyKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmlzQ29tcHV0ZXIgPSBpc0NvbXB1dGVyO1xuICAgIHRoaXMuZ2IgPSBuZXcgR2FtZUJvYXJkKCk7XG4gICAgLy8gZ2VuZXJhdGUgc2hpcHNcbiAgICB0aGlzLmdiLnBsYWNlU2hpcCh7IHg6IDAsIHk6IDAgfSwgbmV3IFNoaXAoKSk7XG4gICAgaWYgKHRoaXMuaXNDb21wdXRlcikge1xuICAgICAgdGhpcy4jcG9zc2libGVNb3ZlcyA9IHRoaXMuZ2VuZXJhdGVNb3Zlcyh0aGlzLmdiLmJvZHkubGVuZ3RoKTtcbiAgICB9XG4gIH1cbiAgZ2V0IHBvc3NpYmxlTW92ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Bvc3NpYmxlTW92ZXM7XG4gIH1cbiAgZ2VuZXJhdGVNb3ZlcyhsZW4pIHtcbiAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgYXJyYXkucHVzaChbaSwgal0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cbiAgYXR0YWNrRW5lbXkoY29vcmQsIGVuZW15KSB7XG4gICAgLy8gYXR0YWNrIHRoZSBlbmVteSBzaGlwXG4gICAgcmV0dXJuIGVuZW15LmdiLnJlY2VpdmVBdHRhY2soY29vcmQpO1xuICB9XG4gIGF0dGFja1JhbmRvbWx5KGVuZW15KSB7XG4gICAgaWYgKCF0aGlzLmlzQ29tcHV0ZXIpIHJldHVybiBbXTtcbiAgICAvLyBQaWNrcyBhIHJhbmRvbSBudW1iZXIgZnJvbSB0aGUgbGlzdCBhbmQgcmVtb3ZlcyBpdFxuICAgIGNvbnN0IHJhbmRJbnQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLiNwb3NzaWJsZU1vdmVzLmxlbmd0aCk7XG4gICAgY29uc3QgW2Nvb3JkXSA9IHRoaXMuI3Bvc3NpYmxlTW92ZXMuc3BsaWNlKHJhbmRJbnQsIDEpO1xuICAgIGNvbnN0IHN1Y2Nlc3MgPSB0aGlzLmF0dGFja0VuZW15KGNvb3JkLCBlbmVteSk7XG4gICAgcmV0dXJuIHsgY29vcmQsIGhpdDogc3VjY2VzcyB9O1xuICB9XG4gIGlzR2FtZU92ZXIoKSB7XG4gICAgLy8gSWYgdGhlcmUgYXJlIG5vIG1vdmVzIGxlZnRcbiAgICByZXR1cm4gIXRoaXMuI3Bvc3NpYmxlTW92ZXMubGVuZ3RoO1xuICB9XG59XG4iLCJjb25zdCBnZW5lcmF0ZUJvYXJkID0gKGJvYXJkLCBjYikgPT4ge1xuICAvLyAqIGdlbmVyYXRlcyBhIGdyaWQgQm9hcmRcbiAgY29uc3QgYXJyYXkgPSBbXTtcbiAgYm9hcmQuZm9yRWFjaCgocm93LCByb3dJZHgpID0+IHtcbiAgICByb3cuZm9yRWFjaCgoY29sdW1uLCBjb2xJZHgpID0+IHtcbiAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgY2VsbC5kYXRhc2V0LmNvb3JkaW5hdGVzID0gSlNPTi5zdHJpbmdpZnkoW3Jvd0lkeCwgY29sSWR4XSk7XG4gICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICAgICAgaWYgKGNiKSB7XG4gICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNiKTtcbiAgICAgIH1cbiAgICAgIGFycmF5LnB1c2goY2VsbCk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gYXJyYXk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZUJvYXJkO1xuIiwiLyogXG5UT0RPIFJlZmFjdG9yIChNYXJraW5nIGZ1bmN0aW9ucylcblRPRE8gRGlzcGxheSBPd24gU2hpcHNcblRPRE8gQWRkIEVuZGluZyBHYW1lIGFuZCByZW1vdmUgYWxlcnRzXG5UT0RPIEFkZCBJbml0aWFsaXplIHNoaXBzXG5UT0RPIEFkZCBSYW5kb21pemUgZW5lbXkgc2hpcHNcblRPRE8gSW5oZXJpdCBQbGF5ZXIgQ2xhc3MgQ29tcHV0ZXIgQ2xhc3NcbiovXG5cbmltcG9ydCBnZW5lcmF0ZUJvYXJkIGZyb20gXCIuL2NvbXBvbmVudHMvYm9hcmRcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vUGxheWVyXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbi8vIG1ldGhvZCB0aGF0IG1hcmtzIHRoZSBjZWxsXG5jb25zdCBtYXJrQ2VsbCA9IChjZWxsKSA9PiB7XG4gIGNlbGwuY2xhc3NMaXN0LmFkZChcImRpc2FibGVkXCIpO1xuICBjZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG59O1xuY29uc3QgbWFya1NoaXBDZWxsID0gKGNlbGwpID0+IHtcbiAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaXNTaGlwXCIpO1xufTtcbmNvbnN0IGhhc05vTW92ZXNMZWZ0ID0gKGNlbGwpID0+IHtcbiAgcmV0dXJuICFjZWxsLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5hY3RpdmVcIikubGVuZ3RoO1xufTtcblxuY29uc3QgZ2FtZUxvb3AgPSAoKSA9PiB7XG4gIGNvbnN0IHAxID0gbmV3IFBsYXllcihcInAxXCIpO1xuICBjb25zdCBib3QgPSBuZXcgUGxheWVyKFwiYm90XCIsIHRydWUpO1xuICAvLyBQb3B1bGF0ZSB3aXRoIHByZWRldGVybWluZWQgY29vcmRpbmF0ZXNcbiAgcDEuZ2IucGxhY2VTaGlwKHsgeDogMCwgeTogMCB9LCBuZXcgU2hpcCgpKTtcbiAgYm90LmdiLnBsYWNlU2hpcCh7IHg6IDAsIHk6IDAgfSwgbmV3IFNoaXAoKSk7XG4gIGNvbnN0IG9uQ2VsbENsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGNsaWNrZWRDb29yZCA9IEpTT04ucGFyc2UodGhpcy5kYXRhc2V0LmNvb3JkaW5hdGVzKTtcbiAgICAvLyBjb25zb2xlLmxvZyhjbGlja2VkQ29vcmQpO1xuICAgIC8vIFJldHVybnMgYm9vbCBzaGlwIGlzIGhpdFxuICAgIGNvbnNvbGUubG9nKGhhc05vTW92ZXNMZWZ0KHRoaXMpKTtcbiAgICBjb25zdCBzdWNjZXNzID0gcDEuYXR0YWNrRW5lbXkoY2xpY2tlZENvb3JkLCBib3QpO1xuXG4gICAgbWFya0NlbGwodGhpcyk7XG4gICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgIG1hcmtTaGlwQ2VsbCh0aGlzKTtcbiAgICB9XG4gICAgaWYgKGJvdC5nYi5hcmVBbGxTdW5rZWQoKSB8fCBib3QuaXNHYW1lT3ZlcigpKSB7XG4gICAgICBhbGVydChcInlvdSB3aW4hXCIpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIEVuZW15IENvbXBcbiAgICBjb25zdCB7IGNvb3JkOiBlbmVteUNvb3JkLCBoaXQ6IGVuZW15U3VjY2VzcyB9ID0gYm90LmF0dGFja1JhbmRvbWx5KHAxKTtcbiAgICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShlbmVteUNvb3JkKSk7XG4gICAgY29uc3QgbXlDZWxsID0gbmV3Qm9hcmQuZmluZChcbiAgICAgIChkaXYpID0+IGRpdi5kYXRhc2V0LmNvb3JkaW5hdGVzID09PSBKU09OLnN0cmluZ2lmeShlbmVteUNvb3JkKVxuICAgICk7XG4gICAgbWFya0NlbGwobXlDZWxsKTtcbiAgICBpZiAoZW5lbXlTdWNjZXNzKSB7XG4gICAgICBtYXJrU2hpcENlbGwobXlDZWxsKTtcbiAgICB9XG4gICAgaWYgKHAxLmdiLmFyZUFsbFN1bmtlZCgpIHx8IGhhc05vTW92ZXNMZWZ0KCkpIHtcbiAgICAgIGFsZXJ0KFwiWW93IGxvc2UhXCIpO1xuICAgIH1cbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBCb2FyZHNcbiAgY29uc3QgbmV3Qm9hcmQgPSBnZW5lcmF0ZUJvYXJkKHAxLmdiLmJvZHkpO1xuICBjb25zdCBib3RCb2FyZCA9IGdlbmVyYXRlQm9hcmQoYm90LmdiLmJvZHksIG9uQ2VsbENsaWNrKTtcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYXllclwiKS5hcHBlbmQoLi4ubmV3Qm9hcmQpO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbXB1dGVyXCIpLmFwcGVuZCguLi5ib3RCb2FyZCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lTG9vcDtcbiIsImNvbnN0IFNJWkUgPSAxMDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2FtZUJvYXJkKCkge1xuICAvLyBGaWxscyAxMDAgY2VsbHMgd2l0aCBudWxsLiBNYXAgaXMgaW1wb3J0YW50IGluIG9yZGVyIHRvIGNyZWF0ZSBuZXcgYXJyYXkgYW5kIG5vdCBqdXN0IGEgcmVmZXJlbmNlXG4gIGNvbnN0IGJvZHkgPSBuZXcgQXJyYXkoU0laRSkuZmlsbChudWxsKS5tYXAoKCkgPT4gbmV3IEFycmF5KFNJWkUpLmZpbGwobnVsbCkpO1xuICBjb25zdCBfc2hpcEFycmF5ID0gW107XG4gIGNvbnN0IF9taXNzZWRBdHRhY2tzID0gW107XG4gIGNvbnN0IF9oaXRBdHRhY2tzID0gW107XG5cbiAgY29uc3Qgc2hpcENvb3JkaW5hdGVzID0gKGNvbCwgcm93LCBpc1ZlcnRpY2FsLCBsZW5ndGgpID0+IHtcbiAgICBjb25zdCBhcnIgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBhcnIucHVzaChpc1ZlcnRpY2FsID8gW3JvdyArIGksIGNvbF0gOiBbcm93LCBjb2wgKyBpXSk7XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gKHsgeDogY29sLCB5OiByb3csIGlzVmVydGljYWwgfSwgc2hpcCkgPT4ge1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gc2hpcENvb3JkaW5hdGVzKGNvbCwgcm93LCBpc1ZlcnRpY2FsLCBzaGlwLmxlbmd0aCk7XG4gICAgLy8gKiBDaGVjayBpZiB0aGVyZSBpcyBhbHJlYWR5IGFub3RoZXIgc2hpcCB0aGVyZVxuICAgIGNvbnN0IGlzQXZhaWxhYmxlID0gY29vcmRpbmF0ZXMuZXZlcnkoKFt5LCB4XSkgPT4gIWJvZHlbeV1beF0pO1xuICAgIGlmICghaXNBdmFpbGFibGUpIHJldHVybiBmYWxzZTtcbiAgICBjb29yZGluYXRlcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgY29uc3QgW3ksIHhdID0gY29vcmQ7XG4gICAgICBib2R5W3ldW3hdID0gdHJ1ZTtcbiAgICB9KTtcbiAgICBfc2hpcEFycmF5LnB1c2goeyBjb29yZGluYXRlcywgc2hpcCB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCByZWNlaXZlQXR0YWNrID0gKGNvb3IpID0+IHtcbiAgICBjb25zdCBbcm93LCBjb2xdID0gY29vcjtcbiAgICAvLyBjaGVjayBpZiBhbHJlYWR5IGJlZW4gcGxhY2VkL21pc3NlZCBzYW1lIHNwb3RcbiAgICBpZiAoX21pc3NlZEF0dGFja3MuZmlsdGVyKChbeSwgeF0pID0+IHkgPT09IHJvdyAmJiB4ID09PSBjb2wpLmxlbmd0aClcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAoX2hpdEF0dGFja3MuZmlsdGVyKChbeSwgeF0pID0+IHkgPT09IHJvdyAmJiB4ID09PSBjb2wpLmxlbmd0aClcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICAvLyByZWNvcmQgdGhlIGNvb3JkaW5hdGUgb2YgbWlzc2VkIHNob3RcbiAgICBpZiAoIWJvZHlbcm93XVtjb2xdKSB7XG4gICAgICBfbWlzc2VkQXR0YWNrcy5wdXNoKFtyb3csIGNvbF0pO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBzZW5kIGhpdCBmdW5jdGlvbiB0byBzaGlwXG4gICAgbGV0IGluZGV4ID0gbnVsbDtcbiAgICBjb25zdCBzaGlwT2JqZWN0ID0gX3NoaXBBcnJheS5maW5kKChvYmopID0+XG4gICAgICBvYmouY29vcmRpbmF0ZXMuZmluZCgoW3ksIHhdLCBpZHgpID0+IHtcbiAgICAgICAgaWYgKHkgPT09IGNvb3JbMF0gJiYgeCA9PT0gY29vclsxXSkge1xuICAgICAgICAgIGluZGV4ID0gaWR4O1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gICAgX2hpdEF0dGFja3MucHVzaChjb29yKTtcbiAgICBzaGlwT2JqZWN0LnNoaXAuaGl0KGluZGV4KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBnZXRNaXNzZWRBdHRhY2tzID0gKCkgPT4gX21pc3NlZEF0dGFja3M7XG5cbiAgY29uc3QgYXJlQWxsU3Vua2VkID0gKCkgPT4ge1xuICAgIHJldHVybiBfc2hpcEFycmF5LmV2ZXJ5KCh7IHNoaXAgfSkgPT4gc2hpcC5pc1N1bmsoKSk7XG4gIH07XG5cbiAgcmV0dXJuIHsgYm9keSwgcGxhY2VTaGlwLCByZWNlaXZlQXR0YWNrLCBnZXRNaXNzZWRBdHRhY2tzLCBhcmVBbGxTdW5rZWQgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNoaXAobGVuID0gMykge1xuICBjb25zdCBib2R5ID0gbmV3IEFycmF5KGxlbikuZmlsbChmYWxzZSk7XG5cbiAgY29uc3QgeyBsZW5ndGggfSA9IGJvZHk7XG5cbiAgY29uc3QgaGl0ID0gKHBvc2l0aW9uKSA9PiB7XG4gICAgaWYgKGJvZHlbcG9zaXRpb25dKSByZXR1cm4gZmFsc2U7XG4gICAgYm9keVtwb3NpdGlvbl0gPSB0cnVlO1xuICAgIHJldHVybiBib2R5W3Bvc2l0aW9uXTtcbiAgfTtcblxuICBjb25zdCBpc1N1bmsgPSAoKSA9PiBib2R5LmV2ZXJ5KChwYXJ0KSA9PiBwYXJ0KTtcblxuICByZXR1cm4geyBsZW5ndGgsIGhpdCwgaXNTdW5rIH07XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBnYW1lTG9vcCBmcm9tIFwiLi9tb2R1bGVzL2dhbWVcIjtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGdhbWVMb29wKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==