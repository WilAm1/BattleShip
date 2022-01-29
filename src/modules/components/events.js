import { markCell } from "./DOMhelpers";
import { endGame } from "./ending";
import { hasNoMovesLeft } from "./DOMhelpers";

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
  markCell(node, success);

  if (bot.gb.areAllSunked() || bot.isGameOver()) {
    endGame(true);
  }

  // Enemy Computer
  // Remove this later only dom methods
  const { coord, hit: enemySuccess } = bot.attackRandomly(player);
  const attackedCell = playerBoard.find(
    (div) => div.dataset.coordinates === JSON.stringify(coord)
  );

  markCell(attackedCell, enemySuccess);
  if (player.gb.areAllSunked() || hasNoMovesLeft(node)) {
    endGame(false);
  }
};
export { onCellClick, onDrag, onDragEnd };
