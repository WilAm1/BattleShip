/* 
TODO Refactor
*/
import generateBoard from "./components/board";
import Player from "./Player";
import { onCellClick } from "./components/events";
import { startingScreen } from "./components/starting";

const gameLoop = () => {
  const player = new Player("player");
  const bot = new Player("bot", true);

  const playerBoard = generateBoard(player.gb.body);
  const botBoard = generateBoard(bot.gb.body, ({ target }) => {
    onCellClick(player, bot, target, playerBoard);
  });

  startingScreen(player, playerBoard, bot);

  document.querySelector("#player").replaceChildren(...playerBoard);
  document.querySelector("#computer").replaceChildren(...botBoard);
};

export default gameLoop;
