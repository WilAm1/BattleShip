import { onDrag, onDragEnd } from "./events";

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
  element.addEventListener("dragstart", onDrag);
  element.addEventListener("dragend", onDragEnd);
  for (let i = 0; i < length; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    element.appendChild(cell);
  }
  return element;
};

export { markCell, hasNoMovesLeft, createModal, makeShipElement };
