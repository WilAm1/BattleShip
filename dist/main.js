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

/***/ "./src/modules/components/DOMhelpers.js":
/*!**********************************************!*\
  !*** ./src/modules/components/DOMhelpers.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "markCell": () => (/* binding */ markCell),
/* harmony export */   "hasNoMovesLeft": () => (/* binding */ hasNoMovesLeft),
/* harmony export */   "createModal": () => (/* binding */ createModal),
/* harmony export */   "makeShipElement": () => (/* binding */ makeShipElement)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events */ "./src/modules/components/events.js");


// method that marks the cell
const markCell = (cell, isShip) => {
  cell.classList.add("disabled");
  cell.classList.remove("active");
  if (isShip) {
    cell.classList.add("isShip");
  }
};
const hasNoMovesLeft = (cell) => {
  return !cell.parentElement.querySelectorAll(".active").length;
};
const createModal = () => {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  return modal;
};
const makeShipElement = ([shipName, length]) => {
  const element = document.createElement("div");
  element.classList.add("ship");
  element.dataset.shipName = shipName;
  element.dataset.shipLength = length;
  element.dataset.isVertical = 0;
  element.draggable = true;
  element.addEventListener("dragstart", _events__WEBPACK_IMPORTED_MODULE_0__.onDrag);
  element.addEventListener("dragend", _events__WEBPACK_IMPORTED_MODULE_0__.onDragEnd);
  for (let i = 0; i < length; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    element.appendChild(cell);
  }
  return element;
};




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

/***/ "./src/modules/components/computer.js":
/*!********************************************!*\
  !*** ./src/modules/components/computer.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "placeRandomShips": () => (/* binding */ placeRandomShips)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ship */ "./src/modules/ship.js");


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
      const newShip = new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](shipLength);
      isSuccess = gameBoard.placeShip({ x: col, y: row, isVertical }, newShip);
    }
  });
};




/***/ }),

/***/ "./src/modules/components/ending.js":
/*!******************************************!*\
  !*** ./src/modules/components/ending.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "endGame": () => (/* binding */ endGame)
/* harmony export */ });
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../game */ "./src/modules/game.js");
/* harmony import */ var _DOMhelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DOMhelpers */ "./src/modules/components/DOMhelpers.js");


const endGame = (playerWin) => {
  const modal = (0,_DOMhelpers__WEBPACK_IMPORTED_MODULE_1__.createModal)();
  modal.innerHTML = `
       <div class="modal-content ending">
       <p>${playerWin ? "Player wins!" : "Computer wins!"}</p>
       <button>Play Again</button>
     </div>
       `;
  modal.querySelector("button").addEventListener("click", () => {
    modal.remove();
    (0,_game__WEBPACK_IMPORTED_MODULE_0__["default"])();
  });
  document.body.appendChild(modal);
};




/***/ }),

/***/ "./src/modules/components/events.js":
/*!******************************************!*\
  !*** ./src/modules/components/events.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "onCellClick": () => (/* binding */ onCellClick),
/* harmony export */   "onDrag": () => (/* binding */ onDrag),
/* harmony export */   "onDragEnd": () => (/* binding */ onDragEnd)
/* harmony export */ });
/* harmony import */ var _DOMhelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOMhelpers */ "./src/modules/components/DOMhelpers.js");
/* harmony import */ var _ending__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ending */ "./src/modules/components/ending.js");




const onDrag = (e) => {
  const message = JSON.stringify(e.target.dataset);
  e.dataTransfer.setData("text/plain", message);
  e.target.style.opacity = 0.3;
};

const onDragEnd = (e) => {
  e.target.style.opacity = 1;
};

const onCellClick = function (player, bot, node, playerBoard) {
  const clickedCoord = JSON.parse(node.dataset.coordinates);
  // Returns bool ship is hit
  const success = player.attackEnemy(clickedCoord, bot);
  (0,_DOMhelpers__WEBPACK_IMPORTED_MODULE_0__.markCell)(node, success);

  if (bot.gb.areAllSunked() || bot.isGameOver()) {
    (0,_ending__WEBPACK_IMPORTED_MODULE_1__.endGame)(true);
  }

  // Enemy Computer
  // Remove this later only dom methods
  const { coord, hit: enemySuccess } = bot.attackRandomly(player);
  const attackedCell = playerBoard.find(
    (div) => div.dataset.coordinates === JSON.stringify(coord)
  );

  (0,_DOMhelpers__WEBPACK_IMPORTED_MODULE_0__.markCell)(attackedCell, enemySuccess);
  if (player.gb.areAllSunked() || (0,_DOMhelpers__WEBPACK_IMPORTED_MODULE_0__.hasNoMovesLeft)(node)) {
    (0,_ending__WEBPACK_IMPORTED_MODULE_1__.endGame)(false);
  }
};



/***/ }),

/***/ "./src/modules/components/helpers.js":
/*!*******************************************!*\
  !*** ./src/modules/components/helpers.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shipCoordinates": () => (/* binding */ shipCoordinates)
/* harmony export */ });
const shipCoordinates = (col, row, isVertical, length) => {
  const arr = [];
  for (let i = 0; i < length; i += 1) {
    arr.push(isVertical ? [row + i, col] : [row, col + i]);
  }
  return arr;
};




/***/ }),

/***/ "./src/modules/components/starting.js":
/*!********************************************!*\
  !*** ./src/modules/components/starting.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "startingScreen": () => (/* binding */ startingScreen)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ship */ "./src/modules/ship.js");
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./board */ "./src/modules/components/board.js");
/* harmony import */ var _DOMhelpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DOMhelpers */ "./src/modules/components/DOMhelpers.js");
/* harmony import */ var _computer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./computer */ "./src/modules/components/computer.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers */ "./src/modules/components/helpers.js");





const ships = {
  Carrier: 5,
  Battleship: 4,
  Destroyer: 3,
  Submarine: 3,
  "Patrol Boat": 2,
};

const startingScreen = (player, playerBoard, computer) => {
  const modal = (0,_DOMhelpers__WEBPACK_IMPORTED_MODULE_2__.createModal)();
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
  const shipElements = Object.entries(ships).map(_DOMhelpers__WEBPACK_IMPORTED_MODULE_2__.makeShipElement);
  shipsContainer.append(...shipElements);

  const rotate = modal.querySelector("button");
  rotate.addEventListener("click", () => {
    shipElements.forEach((ship) => {
      ship.classList.toggle("vertical");
      ship.dataset.isVertical = Number(ship.dataset.isVertical) ? 0 : 1;
    });
  });

  const gb = (0,_board__WEBPACK_IMPORTED_MODULE_1__["default"])(player.gb.body);
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

      const isShipSuccessful = player.gb.placeShip(
        {
          x,
          y,
          isVertical,
        },
        new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](length)
      );

      if (!isShipSuccessful) return;

      const computedCoordinates = (0,_helpers__WEBPACK_IMPORTED_MODULE_4__.shipCoordinates)(x, y, isVertical, length);

      const newShipCoordinates = gb.filter((cell) => {
        return computedCoordinates.find(
          (coord) => JSON.stringify(coord) === cell.dataset.coordinates
        );
      });

      // Display the ships
      newShipCoordinates.forEach((cell) => {
        cell.classList.add("isShip");
        playerBoard
          .find(
            (mainCell) =>
              mainCell.dataset.coordinates === cell.dataset.coordinates
          )
          .classList.add("isShip");
      });

      // Removes the Ship
      const shipNode = shipsContainer.querySelector(
        `[data-ship-name="${shipName}"`
      );
      shipNode.remove();

      if (!shipsContainer.querySelector(".ship")) {
        modal.remove();
      }
    });
  });

  (0,_computer__WEBPACK_IMPORTED_MODULE_3__.placeRandomShips)(computer.gb, ships);

  modal.querySelector(".mini-gameboard").append(...gb);
  document.body.appendChild(modal);
};




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
/* harmony import */ var _components_events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/events */ "./src/modules/components/events.js");
/* harmony import */ var _components_starting__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/starting */ "./src/modules/components/starting.js");
/* 
TODO Refactor
*/





const gameLoop = () => {
  const player = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]("player");
  const bot = new _Player__WEBPACK_IMPORTED_MODULE_1__["default"]("bot", true);

  const playerBoard = (0,_components_board__WEBPACK_IMPORTED_MODULE_0__["default"])(player.gb.body);
  const botBoard = (0,_components_board__WEBPACK_IMPORTED_MODULE_0__["default"])(bot.gb.body, ({ target }) => {
    (0,_components_events__WEBPACK_IMPORTED_MODULE_2__.onCellClick)(player, bot, target, playerBoard);
  });

  (0,_components_starting__WEBPACK_IMPORTED_MODULE_3__.startingScreen)(player, playerBoard, bot);

  document.querySelector("#player").replaceChildren(...playerBoard);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBb0M7O0FBRXJCO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isa0RBQVM7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0Isc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hDNkM7O0FBRTdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsMkNBQU07QUFDOUMsc0NBQXNDLDhDQUFTO0FBQy9DLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFa0U7Ozs7Ozs7Ozs7Ozs7OztBQ25DbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxZQUFZO0FBQ3pEO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7O0FBRUEsaUVBQWUsYUFBYSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkJGOztBQUUzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiw2Q0FBSTtBQUM5Qix3Q0FBd0MsNEJBQTRCO0FBQ3BFO0FBQ0EsR0FBRztBQUNIOztBQUU0Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQkc7QUFDWTtBQUMzQztBQUNBLGdCQUFnQix3REFBVztBQUMzQjtBQUNBO0FBQ0EsWUFBWSw4Q0FBOEM7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksaURBQVE7QUFDWixHQUFHO0FBQ0g7QUFDQTs7QUFFbUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQnFCO0FBQ0w7QUFDVzs7QUFFOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLHFEQUFROztBQUVWO0FBQ0EsSUFBSSxnREFBTztBQUNYOztBQUVBO0FBQ0E7QUFDQSxVQUFVLDJCQUEyQjtBQUNyQztBQUNBO0FBQ0E7O0FBRUEsRUFBRSxxREFBUTtBQUNWLGtDQUFrQywyREFBYztBQUNoRCxJQUFJLGdEQUFPO0FBQ1g7QUFDQTtBQUMwQzs7Ozs7Ozs7Ozs7Ozs7O0FDcEMxQztBQUNBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRTJCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1JBO0FBQ1M7QUFDd0I7QUFDZDtBQUNGO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLHdEQUFXO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaURBQWlELHdEQUFlO0FBQ2hFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSCxhQUFhLGtEQUFhO0FBQzFCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULFlBQVksNkNBQUk7QUFDaEI7O0FBRUE7O0FBRUEsa0NBQWtDLHlEQUFlOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0EsNEJBQTRCLFNBQVM7QUFDckM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRzs7QUFFSCxFQUFFLDJEQUFnQjs7QUFFbEI7QUFDQTtBQUNBOztBQUUwQjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BIMUI7QUFDQTtBQUNBO0FBQytDO0FBQ2pCO0FBQ29CO0FBQ0s7O0FBRXZEO0FBQ0EscUJBQXFCLCtDQUFNO0FBQzNCLGtCQUFrQiwrQ0FBTTs7QUFFeEIsc0JBQXNCLDZEQUFhO0FBQ25DLG1CQUFtQiw2REFBYSxpQkFBaUIsUUFBUTtBQUN6RCxJQUFJLCtEQUFXO0FBQ2YsR0FBRzs7QUFFSCxFQUFFLG9FQUFjOztBQUVoQjtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsUUFBUSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN2QnhCOztBQUVlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLFlBQVk7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCLDRCQUE0QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxzQkFBc0IsbUJBQW1CO0FBQ3pDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsK0JBQStCLE1BQU07QUFDckM7O0FBRUEsV0FBVztBQUNYOzs7Ozs7Ozs7Ozs7Ozs7QUNuRWU7QUFDZjs7QUFFQSxVQUFVLFNBQVM7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxXQUFXO0FBQ1g7Ozs7Ozs7VUNiQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTnNDOztBQUV0Qyw0Q0FBNEMscURBQVEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvUGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9jb21wb25lbnRzL0RPTWhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvY29tcHV0ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2NvbXBvbmVudHMvZW5kaW5nLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9jb21wb25lbnRzL2V2ZW50cy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvY29tcG9uZW50cy9oZWxwZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9jb21wb25lbnRzL3N0YXJ0aW5nLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi9nYW1lQm9hcmRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgI3Bvc3NpYmxlTW92ZXMgPSBbXTtcbiAgY29uc3RydWN0b3IobmFtZSwgaXNDb21wdXRlcikge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5pc0NvbXB1dGVyID0gaXNDb21wdXRlcjtcbiAgICB0aGlzLmdiID0gbmV3IEdhbWVCb2FyZCgpO1xuICAgIGlmICh0aGlzLmlzQ29tcHV0ZXIpIHtcbiAgICAgIHRoaXMuI3Bvc3NpYmxlTW92ZXMgPSB0aGlzLmdlbmVyYXRlTW92ZXModGhpcy5nYi5ib2R5Lmxlbmd0aCk7XG4gICAgfVxuICB9XG4gIGdldCBwb3NzaWJsZU1vdmVzKCkge1xuICAgIHJldHVybiB0aGlzLiNwb3NzaWJsZU1vdmVzO1xuICB9XG4gIGdlbmVyYXRlTW92ZXMobGVuKSB7XG4gICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGFycmF5LnB1c2goW2ksIGpdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG4gIGF0dGFja0VuZW15KGNvb3JkLCBlbmVteSkge1xuICAgIC8vIGF0dGFjayB0aGUgZW5lbXkgc2hpcFxuICAgIHJldHVybiBlbmVteS5nYi5yZWNlaXZlQXR0YWNrKGNvb3JkKTtcbiAgfVxuICBhdHRhY2tSYW5kb21seShlbmVteSkge1xuICAgIGlmICghdGhpcy5pc0NvbXB1dGVyKSByZXR1cm4gW107XG4gICAgLy8gUGlja3MgYSByYW5kb20gbnVtYmVyIGZyb20gdGhlIGxpc3QgYW5kIHJlbW92ZXMgaXRcbiAgICBjb25zdCByYW5kSW50ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy4jcG9zc2libGVNb3Zlcy5sZW5ndGgpO1xuICAgIGNvbnN0IFtjb29yZF0gPSB0aGlzLiNwb3NzaWJsZU1vdmVzLnNwbGljZShyYW5kSW50LCAxKTtcbiAgICBjb25zdCBzdWNjZXNzID0gdGhpcy5hdHRhY2tFbmVteShjb29yZCwgZW5lbXkpO1xuICAgIHJldHVybiB7IGNvb3JkLCBoaXQ6IHN1Y2Nlc3MgfTtcbiAgfVxuICBpc0dhbWVPdmVyKCkge1xuICAgIC8vIElmIHRoZXJlIGFyZSBubyBtb3ZlcyBsZWZ0XG4gICAgcmV0dXJuICF0aGlzLiNwb3NzaWJsZU1vdmVzLmxlbmd0aDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgb25EcmFnLCBvbkRyYWdFbmQgfSBmcm9tIFwiLi9ldmVudHNcIjtcblxuLy8gbWV0aG9kIHRoYXQgbWFya3MgdGhlIGNlbGxcbmNvbnN0IG1hcmtDZWxsID0gKGNlbGwsIGlzU2hpcCkgPT4ge1xuICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJkaXNhYmxlZFwiKTtcbiAgY2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICBpZiAoaXNTaGlwKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaXNTaGlwXCIpO1xuICB9XG59O1xuY29uc3QgaGFzTm9Nb3Zlc0xlZnQgPSAoY2VsbCkgPT4ge1xuICByZXR1cm4gIWNlbGwucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFjdGl2ZVwiKS5sZW5ndGg7XG59O1xuY29uc3QgY3JlYXRlTW9kYWwgPSAoKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgbW9kYWwuY2xhc3NMaXN0LmFkZChcIm1vZGFsXCIpO1xuICByZXR1cm4gbW9kYWw7XG59O1xuY29uc3QgbWFrZVNoaXBFbGVtZW50ID0gKFtzaGlwTmFtZSwgbGVuZ3RoXSkgPT4ge1xuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcbiAgZWxlbWVudC5kYXRhc2V0LnNoaXBOYW1lID0gc2hpcE5hbWU7XG4gIGVsZW1lbnQuZGF0YXNldC5zaGlwTGVuZ3RoID0gbGVuZ3RoO1xuICBlbGVtZW50LmRhdGFzZXQuaXNWZXJ0aWNhbCA9IDA7XG4gIGVsZW1lbnQuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ3N0YXJ0XCIsIG9uRHJhZyk7XG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbmRcIiwgb25EcmFnRW5kKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjZWxsKTtcbiAgfVxuICByZXR1cm4gZWxlbWVudDtcbn07XG5cbmV4cG9ydCB7IG1hcmtDZWxsLCBoYXNOb01vdmVzTGVmdCwgY3JlYXRlTW9kYWwsIG1ha2VTaGlwRWxlbWVudCB9O1xuIiwiY29uc3QgZ2VuZXJhdGVCb2FyZCA9IChib2FyZCwgY2IpID0+IHtcbiAgLy8gKiBnZW5lcmF0ZXMgYSBncmlkIEJvYXJkXG4gIGNvbnN0IGFycmF5ID0gW107XG4gIGJvYXJkLmZvckVhY2goKHJvdywgcm93SWR4KSA9PiB7XG4gICAgcm93LmZvckVhY2goKGNvbHVtbiwgY29sSWR4KSA9PiB7XG4gICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGNlbGwuZGF0YXNldC5jb29yZGluYXRlcyA9IEpTT04uc3RyaW5naWZ5KFtyb3dJZHgsIGNvbElkeF0pO1xuICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICAgIGNlbGwuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICBpZiAoY2IpIHtcbiAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2IsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICAgIGFycmF5LnB1c2goY2VsbCk7XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gYXJyYXk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZUJvYXJkO1xuIiwiaW1wb3J0IFNoaXAgZnJvbSBcIi4uL3NoaXBcIjtcblxuY29uc3QgZ2V0UmFuZG9tQ29vcmRpbmF0ZSA9IChsZW4pID0+IHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxlbik7XG59O1xuXG4vLyBQbGFjZXMgcmFuZG9taXplZCBjb29yZGluYXRlcyBvbiBlbmVteSBTaGlwc1xuY29uc3QgcGxhY2VSYW5kb21TaGlwcyA9IChnYW1lQm9hcmQsIHNoaXBzKSA9PiB7XG4gIE9iamVjdC52YWx1ZXMoc2hpcHMpLmZvckVhY2goKHNoaXBMZW5ndGgpID0+IHtcbiAgICBsZXQgaXNTdWNjZXNzID0gZmFsc2U7XG4gICAgd2hpbGUgKCFpc1N1Y2Nlc3MpIHtcbiAgICAgIGNvbnN0IGNvbCA9IGdldFJhbmRvbUNvb3JkaW5hdGUoZ2FtZUJvYXJkLmJvZHkubGVuZ3RoKTtcbiAgICAgIGNvbnN0IHJvdyA9IGdldFJhbmRvbUNvb3JkaW5hdGUoZ2FtZUJvYXJkLmJvZHkubGVuZ3RoKTtcbiAgICAgIGNvbnN0IGlzVmVydGljYWwgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpO1xuICAgICAgY29uc3QgbmV3U2hpcCA9IG5ldyBTaGlwKHNoaXBMZW5ndGgpO1xuICAgICAgaXNTdWNjZXNzID0gZ2FtZUJvYXJkLnBsYWNlU2hpcCh7IHg6IGNvbCwgeTogcm93LCBpc1ZlcnRpY2FsIH0sIG5ld1NoaXApO1xuICAgIH1cbiAgfSk7XG59O1xuXG5leHBvcnQgeyBwbGFjZVJhbmRvbVNoaXBzIH07XG4iLCJpbXBvcnQgZ2FtZUxvb3AgZnJvbSBcIi4uL2dhbWVcIjtcbmltcG9ydCB7IGNyZWF0ZU1vZGFsIH0gZnJvbSBcIi4vRE9NaGVscGVyc1wiO1xuY29uc3QgZW5kR2FtZSA9IChwbGF5ZXJXaW4pID0+IHtcbiAgY29uc3QgbW9kYWwgPSBjcmVhdGVNb2RhbCgpO1xuICBtb2RhbC5pbm5lckhUTUwgPSBgXG4gICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnQgZW5kaW5nXCI+XG4gICAgICAgPHA+JHtwbGF5ZXJXaW4gPyBcIlBsYXllciB3aW5zIVwiIDogXCJDb21wdXRlciB3aW5zIVwifTwvcD5cbiAgICAgICA8YnV0dG9uPlBsYXkgQWdhaW48L2J1dHRvbj5cbiAgICAgPC9kaXY+XG4gICAgICAgYDtcbiAgbW9kYWwucXVlcnlTZWxlY3RvcihcImJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIG1vZGFsLnJlbW92ZSgpO1xuICAgIGdhbWVMb29wKCk7XG4gIH0pO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1vZGFsKTtcbn07XG5cbmV4cG9ydCB7IGVuZEdhbWUgfTtcbiIsImltcG9ydCB7IG1hcmtDZWxsIH0gZnJvbSBcIi4vRE9NaGVscGVyc1wiO1xuaW1wb3J0IHsgZW5kR2FtZSB9IGZyb20gXCIuL2VuZGluZ1wiO1xuaW1wb3J0IHsgaGFzTm9Nb3Zlc0xlZnQgfSBmcm9tIFwiLi9ET01oZWxwZXJzXCI7XG5cbmNvbnN0IG9uRHJhZyA9IChlKSA9PiB7XG4gIGNvbnN0IG1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeShlLnRhcmdldC5kYXRhc2V0KTtcbiAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgbWVzc2FnZSk7XG4gIGUudGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAwLjM7XG59O1xuXG5jb25zdCBvbkRyYWdFbmQgPSAoZSkgPT4ge1xuICBlLnRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMTtcbn07XG5cbmNvbnN0IG9uQ2VsbENsaWNrID0gZnVuY3Rpb24gKHBsYXllciwgYm90LCBub2RlLCBwbGF5ZXJCb2FyZCkge1xuICBjb25zdCBjbGlja2VkQ29vcmQgPSBKU09OLnBhcnNlKG5vZGUuZGF0YXNldC5jb29yZGluYXRlcyk7XG4gIC8vIFJldHVybnMgYm9vbCBzaGlwIGlzIGhpdFxuICBjb25zdCBzdWNjZXNzID0gcGxheWVyLmF0dGFja0VuZW15KGNsaWNrZWRDb29yZCwgYm90KTtcbiAgbWFya0NlbGwobm9kZSwgc3VjY2Vzcyk7XG5cbiAgaWYgKGJvdC5nYi5hcmVBbGxTdW5rZWQoKSB8fCBib3QuaXNHYW1lT3ZlcigpKSB7XG4gICAgZW5kR2FtZSh0cnVlKTtcbiAgfVxuXG4gIC8vIEVuZW15IENvbXB1dGVyXG4gIC8vIFJlbW92ZSB0aGlzIGxhdGVyIG9ubHkgZG9tIG1ldGhvZHNcbiAgY29uc3QgeyBjb29yZCwgaGl0OiBlbmVteVN1Y2Nlc3MgfSA9IGJvdC5hdHRhY2tSYW5kb21seShwbGF5ZXIpO1xuICBjb25zdCBhdHRhY2tlZENlbGwgPSBwbGF5ZXJCb2FyZC5maW5kKFxuICAgIChkaXYpID0+IGRpdi5kYXRhc2V0LmNvb3JkaW5hdGVzID09PSBKU09OLnN0cmluZ2lmeShjb29yZClcbiAgKTtcblxuICBtYXJrQ2VsbChhdHRhY2tlZENlbGwsIGVuZW15U3VjY2Vzcyk7XG4gIGlmIChwbGF5ZXIuZ2IuYXJlQWxsU3Vua2VkKCkgfHwgaGFzTm9Nb3Zlc0xlZnQobm9kZSkpIHtcbiAgICBlbmRHYW1lKGZhbHNlKTtcbiAgfVxufTtcbmV4cG9ydCB7IG9uQ2VsbENsaWNrLCBvbkRyYWcsIG9uRHJhZ0VuZCB9O1xuIiwiY29uc3Qgc2hpcENvb3JkaW5hdGVzID0gKGNvbCwgcm93LCBpc1ZlcnRpY2FsLCBsZW5ndGgpID0+IHtcbiAgY29uc3QgYXJyID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICBhcnIucHVzaChpc1ZlcnRpY2FsID8gW3JvdyArIGksIGNvbF0gOiBbcm93LCBjb2wgKyBpXSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn07XG5cbmV4cG9ydCB7IHNoaXBDb29yZGluYXRlcyB9O1xuIiwiaW1wb3J0IFNoaXAgZnJvbSBcIi4uL3NoaXBcIjtcbmltcG9ydCBnZW5lcmF0ZUJvYXJkIGZyb20gXCIuL2JvYXJkXCI7XG5pbXBvcnQgeyBjcmVhdGVNb2RhbCwgbWFrZVNoaXBFbGVtZW50IH0gZnJvbSBcIi4vRE9NaGVscGVyc1wiO1xuaW1wb3J0IHsgcGxhY2VSYW5kb21TaGlwcyB9IGZyb20gXCIuL2NvbXB1dGVyXCI7XG5pbXBvcnQgeyBzaGlwQ29vcmRpbmF0ZXMgfSBmcm9tIFwiLi9oZWxwZXJzXCI7XG5jb25zdCBzaGlwcyA9IHtcbiAgQ2FycmllcjogNSxcbiAgQmF0dGxlc2hpcDogNCxcbiAgRGVzdHJveWVyOiAzLFxuICBTdWJtYXJpbmU6IDMsXG4gIFwiUGF0cm9sIEJvYXRcIjogMixcbn07XG5cbmNvbnN0IHN0YXJ0aW5nU2NyZWVuID0gKHBsYXllciwgcGxheWVyQm9hcmQsIGNvbXB1dGVyKSA9PiB7XG4gIGNvbnN0IG1vZGFsID0gY3JlYXRlTW9kYWwoKTtcbiAgbW9kYWwuaW5uZXJIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgPGgyPldFTENPTUUgVE8gQkFUVExFU0hJUDwvaDI+XG4gICAgPGRpdiBjbGFzcz1cIndyYXBwZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtaW5pLWdhbWVib2FyZFwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNoaXBzLXdyYXBwZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImluc3RydWN0aW9uXCI+XG4gICAgICAgICAgPHA+UExBQ0UgWU9VUiBTSElQUyBCWSBEUkFHR0lORyBBTkQgRFJPUFBJTkcgSVQgSU5UTyBUSEUgQk9BUkQ8L3A+XG4gICAgICAgICAgPGJ1dHRvbj5Sb3RhdGUg8J+UgzwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInNoaXBzXCI+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgYDtcblxuICBjb25zdCBzaGlwc0NvbnRhaW5lciA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIuc2hpcHNcIik7XG4gIGNvbnN0IHNoaXBFbGVtZW50cyA9IE9iamVjdC5lbnRyaWVzKHNoaXBzKS5tYXAobWFrZVNoaXBFbGVtZW50KTtcbiAgc2hpcHNDb250YWluZXIuYXBwZW5kKC4uLnNoaXBFbGVtZW50cyk7XG5cbiAgY29uc3Qgcm90YXRlID0gbW9kYWwucXVlcnlTZWxlY3RvcihcImJ1dHRvblwiKTtcbiAgcm90YXRlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgc2hpcEVsZW1lbnRzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIHNoaXAuY2xhc3NMaXN0LnRvZ2dsZShcInZlcnRpY2FsXCIpO1xuICAgICAgc2hpcC5kYXRhc2V0LmlzVmVydGljYWwgPSBOdW1iZXIoc2hpcC5kYXRhc2V0LmlzVmVydGljYWwpID8gMCA6IDE7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGNvbnN0IGdiID0gZ2VuZXJhdGVCb2FyZChwbGF5ZXIuZ2IuYm9keSk7XG4gIGdiLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnZW50ZXJcIiwgKGUpID0+IHtcbiAgICAgIGUudGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgIH0pO1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdsZWF2ZVwiLCAoZSkgPT4ge1xuICAgICAgZS50YXJnZXQuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgfSk7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgKGUpID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJkcm9wXCIsIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlLnRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMTtcblxuICAgICAgY29uc3QgW3ksIHhdID0gSlNPTi5wYXJzZShlLnRhcmdldC5kYXRhc2V0LmNvb3JkaW5hdGVzKTtcbiAgICAgIGxldCB7XG4gICAgICAgIHNoaXBOYW1lLFxuICAgICAgICBzaGlwTGVuZ3RoOiBsZW5ndGgsXG4gICAgICAgIGlzVmVydGljYWwsXG4gICAgICB9ID0gSlNPTi5wYXJzZShlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwidGV4dFwiKSk7XG4gICAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKTtcbiAgICAgIGlzVmVydGljYWwgPSBOdW1iZXIoaXNWZXJ0aWNhbCk7XG5cbiAgICAgIGNvbnN0IGlzU2hpcFN1Y2Nlc3NmdWwgPSBwbGF5ZXIuZ2IucGxhY2VTaGlwKFxuICAgICAgICB7XG4gICAgICAgICAgeCxcbiAgICAgICAgICB5LFxuICAgICAgICAgIGlzVmVydGljYWwsXG4gICAgICAgIH0sXG4gICAgICAgIG5ldyBTaGlwKGxlbmd0aClcbiAgICAgICk7XG5cbiAgICAgIGlmICghaXNTaGlwU3VjY2Vzc2Z1bCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBjb21wdXRlZENvb3JkaW5hdGVzID0gc2hpcENvb3JkaW5hdGVzKHgsIHksIGlzVmVydGljYWwsIGxlbmd0aCk7XG5cbiAgICAgIGNvbnN0IG5ld1NoaXBDb29yZGluYXRlcyA9IGdiLmZpbHRlcigoY2VsbCkgPT4ge1xuICAgICAgICByZXR1cm4gY29tcHV0ZWRDb29yZGluYXRlcy5maW5kKFxuICAgICAgICAgIChjb29yZCkgPT4gSlNPTi5zdHJpbmdpZnkoY29vcmQpID09PSBjZWxsLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBEaXNwbGF5IHRoZSBzaGlwc1xuICAgICAgbmV3U2hpcENvb3JkaW5hdGVzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaXNTaGlwXCIpO1xuICAgICAgICBwbGF5ZXJCb2FyZFxuICAgICAgICAgIC5maW5kKFxuICAgICAgICAgICAgKG1haW5DZWxsKSA9PlxuICAgICAgICAgICAgICBtYWluQ2VsbC5kYXRhc2V0LmNvb3JkaW5hdGVzID09PSBjZWxsLmRhdGFzZXQuY29vcmRpbmF0ZXNcbiAgICAgICAgICApXG4gICAgICAgICAgLmNsYXNzTGlzdC5hZGQoXCJpc1NoaXBcIik7XG4gICAgICB9KTtcblxuICAgICAgLy8gUmVtb3ZlcyB0aGUgU2hpcFxuICAgICAgY29uc3Qgc2hpcE5vZGUgPSBzaGlwc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgW2RhdGEtc2hpcC1uYW1lPVwiJHtzaGlwTmFtZX1cImBcbiAgICAgICk7XG4gICAgICBzaGlwTm9kZS5yZW1vdmUoKTtcblxuICAgICAgaWYgKCFzaGlwc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLnNoaXBcIikpIHtcbiAgICAgICAgbW9kYWwucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHBsYWNlUmFuZG9tU2hpcHMoY29tcHV0ZXIuZ2IsIHNoaXBzKTtcblxuICBtb2RhbC5xdWVyeVNlbGVjdG9yKFwiLm1pbmktZ2FtZWJvYXJkXCIpLmFwcGVuZCguLi5nYik7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobW9kYWwpO1xufTtcblxuZXhwb3J0IHsgc3RhcnRpbmdTY3JlZW4gfTtcbiIsIi8qIFxuVE9ETyBSZWZhY3RvclxuKi9cbmltcG9ydCBnZW5lcmF0ZUJvYXJkIGZyb20gXCIuL2NvbXBvbmVudHMvYm9hcmRcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vUGxheWVyXCI7XG5pbXBvcnQgeyBvbkNlbGxDbGljayB9IGZyb20gXCIuL2NvbXBvbmVudHMvZXZlbnRzXCI7XG5pbXBvcnQgeyBzdGFydGluZ1NjcmVlbiB9IGZyb20gXCIuL2NvbXBvbmVudHMvc3RhcnRpbmdcIjtcblxuY29uc3QgZ2FtZUxvb3AgPSAoKSA9PiB7XG4gIGNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIoXCJwbGF5ZXJcIik7XG4gIGNvbnN0IGJvdCA9IG5ldyBQbGF5ZXIoXCJib3RcIiwgdHJ1ZSk7XG5cbiAgY29uc3QgcGxheWVyQm9hcmQgPSBnZW5lcmF0ZUJvYXJkKHBsYXllci5nYi5ib2R5KTtcbiAgY29uc3QgYm90Qm9hcmQgPSBnZW5lcmF0ZUJvYXJkKGJvdC5nYi5ib2R5LCAoeyB0YXJnZXQgfSkgPT4ge1xuICAgIG9uQ2VsbENsaWNrKHBsYXllciwgYm90LCB0YXJnZXQsIHBsYXllckJvYXJkKTtcbiAgfSk7XG5cbiAgc3RhcnRpbmdTY3JlZW4ocGxheWVyLCBwbGF5ZXJCb2FyZCwgYm90KTtcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3BsYXllclwiKS5yZXBsYWNlQ2hpbGRyZW4oLi4ucGxheWVyQm9hcmQpO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbXB1dGVyXCIpLnJlcGxhY2VDaGlsZHJlbiguLi5ib3RCb2FyZCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lTG9vcDtcbiIsImNvbnN0IFNJWkUgPSAxMDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2FtZUJvYXJkKCkge1xuICAvLyBGaWxscyAxMDAgY2VsbHMgd2l0aCBudWxsLiBNYXAgaXMgaW1wb3J0YW50IGluIG9yZGVyIHRvIGNyZWF0ZSBuZXcgYXJyYXkgYW5kIG5vdCBqdXN0IGEgcmVmZXJlbmNlXG4gIGNvbnN0IGJvZHkgPSBuZXcgQXJyYXkoU0laRSkuZmlsbChudWxsKS5tYXAoKCkgPT4gbmV3IEFycmF5KFNJWkUpLmZpbGwobnVsbCkpO1xuICBjb25zdCBfc2hpcEFycmF5ID0gW107XG4gIGNvbnN0IF9taXNzZWRBdHRhY2tzID0gW107XG4gIGNvbnN0IF9oaXRBdHRhY2tzID0gW107XG5cbiAgY29uc3Qgc2hpcENvb3JkaW5hdGVzID0gKGNvbCwgcm93LCBpc1ZlcnRpY2FsLCBsZW5ndGgpID0+IHtcbiAgICBjb25zdCBhcnIgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBhcnIucHVzaChpc1ZlcnRpY2FsID8gW3JvdyArIGksIGNvbF0gOiBbcm93LCBjb2wgKyBpXSk7XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gKHsgeDogY29sLCB5OiByb3csIGlzVmVydGljYWwgfSwgc2hpcCkgPT4ge1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gc2hpcENvb3JkaW5hdGVzKGNvbCwgcm93LCBpc1ZlcnRpY2FsLCBzaGlwLmxlbmd0aCk7XG4gICAgLy8gKiBDaGVjayBpZiB0aGVyZSBpcyBhbHJlYWR5IGFub3RoZXIgc2hpcCB0aGVyZVxuICAgIGNvbnN0IGlzQXZhaWxhYmxlID0gY29vcmRpbmF0ZXMuZXZlcnkoXG4gICAgICAoW3ksIHhdKSA9PlxuICAgICAgICBib2R5W3ldICE9PSB1bmRlZmluZWQgJiYgYm9keVt5XVt4XSAhPT0gdW5kZWZpbmVkICYmICFib2R5W3ldW3hdXG4gICAgKTtcbiAgICBpZiAoIWlzQXZhaWxhYmxlKSByZXR1cm4gZmFsc2U7XG4gICAgY29vcmRpbmF0ZXMuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgIGNvbnN0IFt5LCB4XSA9IGNvb3JkO1xuICAgICAgYm9keVt5XVt4XSA9IHRydWU7XG4gICAgfSk7XG4gICAgX3NoaXBBcnJheS5wdXNoKHsgY29vcmRpbmF0ZXMsIHNoaXAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcmVjZWl2ZUF0dGFjayA9IChjb29yKSA9PiB7XG4gICAgY29uc3QgW3JvdywgY29sXSA9IGNvb3I7XG4gICAgLy8gY2hlY2sgaWYgYWxyZWFkeSBiZWVuIHBsYWNlZC9taXNzZWQgc2FtZSBzcG90XG4gICAgaWYgKF9taXNzZWRBdHRhY2tzLmZpbHRlcigoW3ksIHhdKSA9PiB5ID09PSByb3cgJiYgeCA9PT0gY29sKS5sZW5ndGgpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgaWYgKF9oaXRBdHRhY2tzLmZpbHRlcigoW3ksIHhdKSA9PiB5ID09PSByb3cgJiYgeCA9PT0gY29sKS5sZW5ndGgpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgLy8gcmVjb3JkIHRoZSBjb29yZGluYXRlIG9mIG1pc3NlZCBzaG90XG4gICAgaWYgKCFib2R5W3Jvd11bY29sXSkge1xuICAgICAgX21pc3NlZEF0dGFja3MucHVzaChbcm93LCBjb2xdKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gc2VuZCBoaXQgZnVuY3Rpb24gdG8gc2hpcFxuICAgIGxldCBpbmRleCA9IG51bGw7XG4gICAgY29uc3Qgc2hpcE9iamVjdCA9IF9zaGlwQXJyYXkuZmluZCgob2JqKSA9PlxuICAgICAgb2JqLmNvb3JkaW5hdGVzLmZpbmQoKFt5LCB4XSwgaWR4KSA9PiB7XG4gICAgICAgIGlmICh5ID09PSBjb29yWzBdICYmIHggPT09IGNvb3JbMV0pIHtcbiAgICAgICAgICBpbmRleCA9IGlkeDtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICAgIF9oaXRBdHRhY2tzLnB1c2goY29vcik7XG4gICAgc2hpcE9iamVjdC5zaGlwLmhpdChpbmRleCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgZ2V0TWlzc2VkQXR0YWNrcyA9ICgpID0+IF9taXNzZWRBdHRhY2tzO1xuXG4gIGNvbnN0IGFyZUFsbFN1bmtlZCA9ICgpID0+IHtcbiAgICByZXR1cm4gX3NoaXBBcnJheS5ldmVyeSgoeyBzaGlwIH0pID0+IHNoaXAuaXNTdW5rKCkpO1xuICB9O1xuXG4gIHJldHVybiB7IGJvZHksIHBsYWNlU2hpcCwgcmVjZWl2ZUF0dGFjaywgZ2V0TWlzc2VkQXR0YWNrcywgYXJlQWxsU3Vua2VkIH07XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBTaGlwKGxlbiA9IDMpIHtcbiAgY29uc3QgYm9keSA9IG5ldyBBcnJheShsZW4pLmZpbGwoZmFsc2UpO1xuXG4gIGNvbnN0IHsgbGVuZ3RoIH0gPSBib2R5O1xuICBjb25zdCBoaXQgPSAocG9zaXRpb24pID0+IHtcbiAgICBpZiAoYm9keVtwb3NpdGlvbl0pIHJldHVybiBmYWxzZTtcbiAgICBib2R5W3Bvc2l0aW9uXSA9IHRydWU7XG4gICAgcmV0dXJuIGJvZHlbcG9zaXRpb25dO1xuICB9O1xuXG4gIGNvbnN0IGlzU3VuayA9ICgpID0+IGJvZHkuZXZlcnkoKHBhcnQpID0+IHBhcnQpO1xuXG4gIHJldHVybiB7IGxlbmd0aCwgaGl0LCBpc1N1bmsgfTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGdhbWVMb29wIGZyb20gXCIuL21vZHVsZXMvZ2FtZVwiO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZ2FtZUxvb3ApO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9