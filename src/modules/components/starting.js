import Ship from "../ship";
import generateBoard from "./board";
import { createModal, makeShipElement } from "./DOMhelpers";
import { placeRandomShips } from "./computer";
import { shipCoordinates } from "./helpers";
const ships = {
  Carrier: 5,
  Battleship: 4,
  Destroyer: 3,
  Submarine: 3,
  "Patrol Boat": 2,
};

const startingScreen = (player, playerBoard, computer) => {
  const modal = createModal();
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
  const shipElements = Object.entries(ships).map(makeShipElement);
  shipsContainer.append(...shipElements);

  const rotate = modal.querySelector("button");
  rotate.addEventListener("click", () => {
    shipElements.forEach((ship) => {
      ship.classList.toggle("vertical");
      ship.dataset.isVertical = Number(ship.dataset.isVertical) ? 0 : 1;
    });
  });

  const gb = generateBoard(player.gb.body);
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
        new Ship(length)
      );

      if (!isShipSuccessful) return;

      const computedCoordinates = shipCoordinates(x, y, isVertical, length);

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

  placeRandomShips(computer.gb, ships);

  modal.querySelector(".mini-gameboard").append(...gb);
  document.body.appendChild(modal);
};

export { startingScreen };
