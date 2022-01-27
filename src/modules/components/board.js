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

export default generateBoard;
