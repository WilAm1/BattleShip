export default function GameBoard() {
  const body = new Array(10).fill(new Array(10).fill(null));
  const shipArray = [];
  //   const checkShipAvailability = (col,row,isVertical,ship)=>{
  //     for (let i = 0; i < ship.length; i += 1) {
  //         if (isVertical) {
  //             body[row + i][col]

  //         } else {

  //         }
  //       }
  //   };
  const shipCoordinates = (col, row, isVertical, length) => {
    const arr = [];
    for (let i = 0; i < length; i += 1) {
      // if (isVertical) {
      //   arr.push([row+i,col])
      // } else {
      //   arr.push([row,col+i])
      // }
      arr.push(isVertical ? [col, row + i] : [col + i, row]);
    }
    return arr;
  };
  const placeShip = ({ x: col, y: row, isVertical }, ship) => {
    // * Check if there is already another ship there
    const coordinates = shipCoordinates(col, row, isVertical, ship.length);
    const isAvailable = coordinates.every(([x, y]) => !body[y][x]);
    if (!isAvailable) return false;
    coordinates.forEach((coord) => {
      const [col, row] = coord;
      body[row][col] = true;
    });
    return true;
    // const coordinates = [];
    // for (let i = 0; i < ship.length; i += 1) {
    //   if (isVertical) {
    //     body[row + i][col] = true;
    //     coordinates.push([row + i, col]);
    //   } else {
    //     body[row][col + i] = true;
    //     coordinates.push([row, col + i]);
    //   }
    // }
    // shipArray.push({ coordinates, ship });
    return true;
  };
  const recieveAttack = (coor) => {
    const [row, col] = coor;
    if (!body[row][col]) {
      return false;
    }
    // record the coordinate of missed shot
    // send hit function to ship
    // check if already been placed/missed same spot
    return true;
  };
  return { body, placeShip, recieveAttack };
}
