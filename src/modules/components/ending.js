import gameLoop from "../game";
import { createModal } from "./DOMhelpers";
const endGame = (playerWin) => {
  const modal = createModal();
  modal.innerHTML = `
       <div class="modal-content ending">
       <p>${playerWin ? "Player wins!" : "Computer wins!"}</p>
       <button>Play Again</button>
     </div>
       `;
  modal.querySelector("button").addEventListener("click", () => {
    modal.remove();
    gameLoop();
  });
  document.body.appendChild(modal);
};

export { endGame };
