import Ship from "../ship";

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

export { placeRandomShips };
