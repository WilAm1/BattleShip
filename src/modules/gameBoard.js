export default function GameBoard() {
  const body = new Array(10).fill(new Array(10).fill(null));
  const shipArray = [];
  const placeShip = ({ x, y, isVertical }, ship) => {
    const coordinates = [];
    for (let i = 0; i < ship.length; i += 1) {
      if (isVertical) {
        body[y + i][x] = true;
        coordinates.push([y + i, x]);
      } else {
        body[y][x + i] = true;
        coordinates.push([y, x + i]);
      }
    }
    shipArray.push({ coordinates, ship });
  };
  return { body, placeShip };
}
