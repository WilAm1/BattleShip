export default function GameBoard() {
  const body = new Array(10).fill(new Array(10).fill(null));
  const shipArray = [];
  const placeShip = ({ x, y, isVertical }, ship) => {
    for (let i = x; i < ship.length; i += 1) {
      body[y][i] = true;
    }
    shipArray.push(ship);
  };
  return { body, placeShip };
}
