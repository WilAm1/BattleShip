export default function GameBoard() {
  const body = new Array(10).fill(new Array(10).fill(null));
  const shipArray = [];
  const _missedAttacks = [];
  const shipCoordinates = (col, row, isVertical, length) => {
    const arr = [];
    for (let i = 0; i < length; i += 1) {
      // if (isVertical) {
      //   arr.push([row+i,col])
      // } else {
      //   arr.push([row,col+i])
      // }
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
    shipArray.push({ coordinates, ship });
    return true;
  };
  const recieveAttack = (coor) => {
    const [row, col] = coor;
    if (!body[row][col]) {
      // record the coordinate of missed shot
      _missedAttacks.push([row, col]);
      return false;
    }
    // send hit function to ship
    let index = null;
    const myShip = shipArray.find((obj) =>
      obj.coordinates.find(([y, x], idx) => {
        if (y === coor[0] && x === coor[1]) {
          index = idx;
          return true;
        }
      })
    );
    console.log(myShip.coordinates[index]);
    myShip.ship.hit(index);
    // check if already been placed/missed same spot
    return true;
  };
  return { body, placeShip, recieveAttack };
}
