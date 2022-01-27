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
const SIZE = 10;
const generateBoard = (board, cb) => {
  // * generates a grid Board
  const array = [];
  board.forEach((row, rowIdx) => {
    row.forEach((column, colIdx) => {
      const cell = document.createElement("div");
      cell.dataset.coordinates = JSON.stringify([rowIdx, colIdx]);
      cell.classList.add("cell");
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
TODO Create the main game loop and a module for DOM interaction.
TODO The game loop should set up a new game by creating Players and Gameboards. 
For now just populate each Gameboard with predetermined coordinates. 
You can implement a system for allowing players to place their ships later.
TODO We’ll leave the HTML implementation up to you for now, but you should 
display both the player’s boards and render them using information from the Gameboard class.
TODO You need methods to render the gameboards and to take user input for
 attacking. For attacks, let the user click on a coordinate in the enemy Gameboard.

*/





// method that marks the cell

const markCell = (cell) => {
  cell.classList.add("disabled");
};
const colorCell = (cell) => {
  cell.classList.add("isShip");
};
const game = () => {
  const p1 = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]("p1");
  const bot = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]("bot", true);
  // Populate with predetermined coordinates
  p1.gb.placeShip({ x: 0, y: 0 }, new _ship__WEBPACK_IMPORTED_MODULE_2__["default"]());
  bot.gb.placeShip({ x: 0, y: 0 }, new _ship__WEBPACK_IMPORTED_MODULE_2__["default"]());
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
  const newBoard = (0,_components_board__WEBPACK_IMPORTED_MODULE_0__["default"])(p1.gb.body);
  const botBoard = (0,_components_board__WEBPACK_IMPORTED_MODULE_0__["default"])(bot.gb.body, onCellClick);
  document.querySelector("#player").append(...newBoard);
  document.querySelector("#computer").append(...botBoard);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (game);


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
console.log("hello world!!");


(0,_modules_game__WEBPACK_IMPORTED_MODULE_0__["default"])();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQW9DO0FBQ1Y7O0FBRVg7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixrREFBUztBQUMzQjtBQUNBLHdCQUF3QixZQUFZLE1BQU0sNkNBQUk7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0Isc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBOztBQUVBLGlFQUFlLGFBQWEsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEI3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRStDO0FBQ2pCO0FBQ0o7O0FBRTFCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLCtDQUFNO0FBQ3ZCLGtCQUFrQiwrQ0FBTTtBQUN4QjtBQUNBLG9CQUFvQixZQUFZLE1BQU0sNkNBQUk7QUFDMUMscUJBQXFCLFlBQVksTUFBTSw2Q0FBSTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLHVDQUF1QztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLDZEQUFhO0FBQ2hDLG1CQUFtQiw2REFBYTtBQUNoQztBQUNBO0FBQ0E7QUFDQSxpRUFBZSxJQUFJLEVBQUM7Ozs7Ozs7Ozs7Ozs7OztBQ3hEcEI7O0FBRWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsWUFBWTtBQUNoQztBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIsNEJBQTRCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLHNCQUFzQixtQkFBbUI7QUFDekM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSwrQkFBK0IsTUFBTTtBQUNyQzs7QUFFQSxXQUFXO0FBQ1g7Ozs7Ozs7Ozs7Ozs7OztBQ2hFZTtBQUNmOztBQUVBLFVBQVUsU0FBUzs7QUFFbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxXQUFXO0FBQ1g7Ozs7Ozs7VUNkQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTkE7QUFDa0M7O0FBRWxDLHlEQUFJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL1BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvY29tcG9uZW50cy9ib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZUJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZUJvYXJkXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciB7XG4gICNwb3NzaWJsZU1vdmVzID0gW107XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGlzQ29tcHV0ZXIpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuaXNDb21wdXRlciA9IGlzQ29tcHV0ZXI7XG4gICAgdGhpcy5nYiA9IG5ldyBHYW1lQm9hcmQoKTtcbiAgICAvLyBnZW5lcmF0ZSBzaGlwc1xuICAgIHRoaXMuZ2IucGxhY2VTaGlwKHsgeDogMCwgeTogMCB9LCBuZXcgU2hpcCgpKTtcbiAgICBpZiAodGhpcy5pc0NvbXB1dGVyKSB7XG4gICAgICB0aGlzLiNwb3NzaWJsZU1vdmVzID0gdGhpcy5nZW5lcmF0ZU1vdmVzKHRoaXMuZ2IuYm9keS5sZW5ndGgpO1xuICAgIH1cbiAgfVxuICBnZXQgcG9zc2libGVNb3ZlcygpIHtcbiAgICByZXR1cm4gdGhpcy4jcG9zc2libGVNb3ZlcztcbiAgfVxuICBnZW5lcmF0ZU1vdmVzKGxlbikge1xuICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBsZW47IGorKykge1xuICAgICAgICBhcnJheS5wdXNoKFtpLCBqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuICBhdHRhY2tFbmVteShjb29yZCwgZW5lbXkpIHtcbiAgICAvLyBhdHRhY2sgdGhlIGVuZW15IHNoaXBcbiAgICByZXR1cm4gZW5lbXkuZ2IucmVjZWl2ZUF0dGFjayhjb29yZCk7XG4gIH1cbiAgYXR0YWNrUmFuZG9tbHkoZW5lbXkpIHtcbiAgICBpZiAoIXRoaXMuaXNDb21wdXRlcikgcmV0dXJuIFtdO1xuICAgIC8vIFBpY2tzIGEgcmFuZG9tIG51bWJlciBmcm9tIHRoZSBsaXN0IGFuZCByZW1vdmVzIGl0XG4gICAgY29uc3QgcmFuZEludCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuI3Bvc3NpYmxlTW92ZXMubGVuZ3RoKTtcbiAgICBjb25zdCBbY29vcmRdID0gdGhpcy4jcG9zc2libGVNb3Zlcy5zcGxpY2UocmFuZEludCwgMSk7XG4gICAgY29uc3Qgc3VjY2VzcyA9IHRoaXMuYXR0YWNrRW5lbXkoY29vcmQsIGVuZW15KTtcbiAgICByZXR1cm4geyBjb29yZCwgaGl0OiBzdWNjZXNzIH07XG4gIH1cbiAgaXNHYW1lT3ZlcigpIHtcbiAgICAvLyBJZiB0aGVyZSBhcmUgbm8gbW92ZXMgbGVmdFxuICAgIHJldHVybiAhdGhpcy4jcG9zc2libGVNb3Zlcy5sZW5ndGg7XG4gIH1cbn1cbiIsImNvbnN0IFNJWkUgPSAxMDtcbmNvbnN0IGdlbmVyYXRlQm9hcmQgPSAoYm9hcmQsIGNiKSA9PiB7XG4gIC8vICogZ2VuZXJhdGVzIGEgZ3JpZCBCb2FyZFxuICBjb25zdCBhcnJheSA9IFtdO1xuICBib2FyZC5mb3JFYWNoKChyb3csIHJvd0lkeCkgPT4ge1xuICAgIHJvdy5mb3JFYWNoKChjb2x1bW4sIGNvbElkeCkgPT4ge1xuICAgICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBjZWxsLmRhdGFzZXQuY29vcmRpbmF0ZXMgPSBKU09OLnN0cmluZ2lmeShbcm93SWR4LCBjb2xJZHhdKTtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG4gICAgICBpZiAoY2IpIHtcbiAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2IpO1xuICAgICAgfVxuICAgICAgYXJyYXkucHVzaChjZWxsKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBhcnJheTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlQm9hcmQ7XG4iLCIvKiBcblRPRE8gQ3JlYXRlIHRoZSBtYWluIGdhbWUgbG9vcCBhbmQgYSBtb2R1bGUgZm9yIERPTSBpbnRlcmFjdGlvbi5cblRPRE8gVGhlIGdhbWUgbG9vcCBzaG91bGQgc2V0IHVwIGEgbmV3IGdhbWUgYnkgY3JlYXRpbmcgUGxheWVycyBhbmQgR2FtZWJvYXJkcy4gXG5Gb3Igbm93IGp1c3QgcG9wdWxhdGUgZWFjaCBHYW1lYm9hcmQgd2l0aCBwcmVkZXRlcm1pbmVkIGNvb3JkaW5hdGVzLiBcbllvdSBjYW4gaW1wbGVtZW50IGEgc3lzdGVtIGZvciBhbGxvd2luZyBwbGF5ZXJzIHRvIHBsYWNlIHRoZWlyIHNoaXBzIGxhdGVyLlxuVE9ETyBXZeKAmWxsIGxlYXZlIHRoZSBIVE1MIGltcGxlbWVudGF0aW9uIHVwIHRvIHlvdSBmb3Igbm93LCBidXQgeW91IHNob3VsZCBcbmRpc3BsYXkgYm90aCB0aGUgcGxheWVy4oCZcyBib2FyZHMgYW5kIHJlbmRlciB0aGVtIHVzaW5nIGluZm9ybWF0aW9uIGZyb20gdGhlIEdhbWVib2FyZCBjbGFzcy5cblRPRE8gWW91IG5lZWQgbWV0aG9kcyB0byByZW5kZXIgdGhlIGdhbWVib2FyZHMgYW5kIHRvIHRha2UgdXNlciBpbnB1dCBmb3JcbiBhdHRhY2tpbmcuIEZvciBhdHRhY2tzLCBsZXQgdGhlIHVzZXIgY2xpY2sgb24gYSBjb29yZGluYXRlIGluIHRoZSBlbmVteSBHYW1lYm9hcmQuXG5cbiovXG5cbmltcG9ydCBnZW5lcmF0ZUJvYXJkIGZyb20gXCIuL2NvbXBvbmVudHMvYm9hcmRcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vUGxheWVyXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbi8vIG1ldGhvZCB0aGF0IG1hcmtzIHRoZSBjZWxsXG5cbmNvbnN0IG1hcmtDZWxsID0gKGNlbGwpID0+IHtcbiAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiZGlzYWJsZWRcIik7XG59O1xuY29uc3QgY29sb3JDZWxsID0gKGNlbGwpID0+IHtcbiAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaXNTaGlwXCIpO1xufTtcbmNvbnN0IGdhbWUgPSAoKSA9PiB7XG4gIGNvbnN0IHAxID0gbmV3IFBsYXllcihcInAxXCIpO1xuICBjb25zdCBib3QgPSBuZXcgUGxheWVyKFwiYm90XCIsIHRydWUpO1xuICAvLyBQb3B1bGF0ZSB3aXRoIHByZWRldGVybWluZWQgY29vcmRpbmF0ZXNcbiAgcDEuZ2IucGxhY2VTaGlwKHsgeDogMCwgeTogMCB9LCBuZXcgU2hpcCgpKTtcbiAgYm90LmdiLnBsYWNlU2hpcCh7IHg6IDAsIHk6IDAgfSwgbmV3IFNoaXAoKSk7XG4gIGNvbnN0IG9uQ2VsbENsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGNvb3JkID0gSlNPTi5wYXJzZSh0aGlzLmRhdGFzZXQuY29vcmRpbmF0ZXMpO1xuICAgIGNvbnNvbGUubG9nKGNvb3JkKTtcbiAgICAvLyBSZXR1cm4gaWYgY29vcmQgaXMgaW4gdGhlIGFscmVhZHkgbWlzc2VkXG4gICAgY29uc3Qgc3VjY2VzcyA9IHAxLmF0dGFja0VuZW15KGNvb3JkLCBib3QpO1xuICAgIG1hcmtDZWxsKHRoaXMpO1xuICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICBjb2xvckNlbGwodGhpcyk7XG4gICAgfVxuICAgIGNvbnN0IHsgY29vcmQ6IGVuZW15Q29vcmQsIGhpdDogZW5lbXlTdWNjZXNzIH0gPSBib3QuYXR0YWNrUmFuZG9tbHkocDEpO1xuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGVuZW15Q29vcmQpKTtcbiAgICBjb25zdCBteUNlbGwgPSBuZXdCb2FyZC5maW5kKFxuICAgICAgKGRpdikgPT4gZGl2LmRhdGFzZXQuY29vcmRpbmF0ZXMgPT09IEpTT04uc3RyaW5naWZ5KGVuZW15Q29vcmQpXG4gICAgKTtcbiAgICBtYXJrQ2VsbChteUNlbGwpO1xuICAgIGlmIChlbmVteVN1Y2Nlc3MpIHtcbiAgICAgIGNvbG9yQ2VsbChteUNlbGwpO1xuICAgIH1cbiAgICAvLyBEaXNwbGF5IGFub3RoZXIgY29sb3IgaWYgaGl0IGEgc2hpcC5cbiAgfTtcbiAgLy8gR2VuZXJhdGUgQm9hcmRzXG4gIGNvbnN0IG5ld0JvYXJkID0gZ2VuZXJhdGVCb2FyZChwMS5nYi5ib2R5KTtcbiAgY29uc3QgYm90Qm9hcmQgPSBnZW5lcmF0ZUJvYXJkKGJvdC5nYi5ib2R5LCBvbkNlbGxDbGljayk7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxheWVyXCIpLmFwcGVuZCguLi5uZXdCb2FyZCk7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29tcHV0ZXJcIikuYXBwZW5kKC4uLmJvdEJvYXJkKTtcbn07XG5leHBvcnQgZGVmYXVsdCBnYW1lO1xuIiwiY29uc3QgU0laRSA9IDEwO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHYW1lQm9hcmQoKSB7XG4gIC8vIEZpbGxzIDEwMCBjZWxscyB3aXRoIG51bGwuIE1hcCBpcyBpbXBvcnRhbnQgaW4gb3JkZXIgdG8gY3JlYXRlIG5ldyBhcnJheSBhbmQgbm90IGp1c3QgYSByZWZlcmVuY2VcbiAgY29uc3QgYm9keSA9IG5ldyBBcnJheShTSVpFKS5maWxsKG51bGwpLm1hcCgoKSA9PiBuZXcgQXJyYXkoU0laRSkuZmlsbChudWxsKSk7XG4gIGNvbnN0IF9zaGlwQXJyYXkgPSBbXTtcbiAgY29uc3QgX21pc3NlZEF0dGFja3MgPSBbXTtcbiAgY29uc3QgX2hpdEF0dGFja3MgPSBbXTtcblxuICBjb25zdCBzaGlwQ29vcmRpbmF0ZXMgPSAoY29sLCByb3csIGlzVmVydGljYWwsIGxlbmd0aCkgPT4ge1xuICAgIGNvbnN0IGFyciA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGFyci5wdXNoKGlzVmVydGljYWwgPyBbcm93ICsgaSwgY29sXSA6IFtyb3csIGNvbCArIGldKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSAoeyB4OiBjb2wsIHk6IHJvdywgaXNWZXJ0aWNhbCB9LCBzaGlwKSA9PiB7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSBzaGlwQ29vcmRpbmF0ZXMoY29sLCByb3csIGlzVmVydGljYWwsIHNoaXAubGVuZ3RoKTtcbiAgICAvLyAqIENoZWNrIGlmIHRoZXJlIGlzIGFscmVhZHkgYW5vdGhlciBzaGlwIHRoZXJlXG4gICAgY29uc3QgaXNBdmFpbGFibGUgPSBjb29yZGluYXRlcy5ldmVyeSgoW3ksIHhdKSA9PiAhYm9keVt5XVt4XSk7XG4gICAgaWYgKCFpc0F2YWlsYWJsZSkgcmV0dXJuIGZhbHNlO1xuICAgIGNvb3JkaW5hdGVzLmZvckVhY2goKGNvb3JkKSA9PiB7XG4gICAgICBjb25zdCBbeSwgeF0gPSBjb29yZDtcbiAgICAgIGJvZHlbeV1beF0gPSB0cnVlO1xuICAgIH0pO1xuICAgIF9zaGlwQXJyYXkucHVzaCh7IGNvb3JkaW5hdGVzLCBzaGlwIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAoY29vcikgPT4ge1xuICAgIGNvbnN0IFtyb3csIGNvbF0gPSBjb29yO1xuICAgIC8vIGNoZWNrIGlmIGFscmVhZHkgYmVlbiBwbGFjZWQvbWlzc2VkIHNhbWUgc3BvdFxuICAgIGlmIChfbWlzc2VkQXR0YWNrcy5maWx0ZXIoKFt5LCB4XSkgPT4geSA9PT0gcm93ICYmIHggPT09IGNvbCkubGVuZ3RoKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChfaGl0QXR0YWNrcy5maWx0ZXIoKFt5LCB4XSkgPT4geSA9PT0gcm93ICYmIHggPT09IGNvbCkubGVuZ3RoKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIC8vIHJlY29yZCB0aGUgY29vcmRpbmF0ZSBvZiBtaXNzZWQgc2hvdFxuICAgIGlmICghYm9keVtyb3ddW2NvbF0pIHtcbiAgICAgIF9taXNzZWRBdHRhY2tzLnB1c2goW3JvdywgY29sXSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIHNlbmQgaGl0IGZ1bmN0aW9uIHRvIHNoaXBcbiAgICBsZXQgaW5kZXggPSBudWxsO1xuICAgIGNvbnN0IHNoaXBPYmplY3QgPSBfc2hpcEFycmF5LmZpbmQoKG9iaikgPT5cbiAgICAgIG9iai5jb29yZGluYXRlcy5maW5kKChbeSwgeF0sIGlkeCkgPT4ge1xuICAgICAgICBpZiAoeSA9PT0gY29vclswXSAmJiB4ID09PSBjb29yWzFdKSB7XG4gICAgICAgICAgaW5kZXggPSBpZHg7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcbiAgICBfaGl0QXR0YWNrcy5wdXNoKGNvb3IpO1xuICAgIHNoaXBPYmplY3Quc2hpcC5oaXQoaW5kZXgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGdldE1pc3NlZEF0dGFja3MgPSAoKSA9PiBfbWlzc2VkQXR0YWNrcztcblxuICBjb25zdCBhcmVBbGxTdW5rZWQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIF9zaGlwQXJyYXkuZXZlcnkoKHsgc2hpcCB9KSA9PiBzaGlwLmlzU3VuaygpKTtcbiAgfTtcblxuICByZXR1cm4geyBib2R5LCBwbGFjZVNoaXAsIHJlY2VpdmVBdHRhY2ssIGdldE1pc3NlZEF0dGFja3MsIGFyZUFsbFN1bmtlZCB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2hpcChsZW4gPSAzKSB7XG4gIGNvbnN0IGJvZHkgPSBuZXcgQXJyYXkobGVuKS5maWxsKGZhbHNlKTtcblxuICBjb25zdCB7IGxlbmd0aCB9ID0gYm9keTtcblxuICBjb25zdCBoaXQgPSAocG9zaXRpb24pID0+IHtcbiAgICBpZiAoYm9keVtwb3NpdGlvbl0pIHJldHVybiBmYWxzZTtcbiAgICBib2R5W3Bvc2l0aW9uXSA9IHRydWU7XG4gICAgcmV0dXJuIGJvZHlbcG9zaXRpb25dO1xuICB9O1xuXG4gIGNvbnN0IGlzU3VuayA9ICgpID0+IGJvZHkuZXZlcnkoKHBhcnQpID0+IHBhcnQpO1xuXG4gIHJldHVybiB7IGxlbmd0aCwgaGl0LCBpc1N1bmsgfTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiY29uc29sZS5sb2coXCJoZWxsbyB3b3JsZCEhXCIpO1xuaW1wb3J0IGdhbWUgZnJvbSBcIi4vbW9kdWxlcy9nYW1lXCI7XG5cbmdhbWUoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==