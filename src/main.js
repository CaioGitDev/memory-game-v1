import Game from './modules/Game.js';
import { Modal } from './components/modal/modal.js';
import { ProgressBar } from './components/progressBar/progressBar.js';

document.querySelector('#app').innerHTML = `
  <div id="container" class="container">
    <div id="board" class="board"></div>
  </div>
  `;


// const button = document.getElementById('btn-modal');

// const modal = document.getElementById('modal');

// button.addEventListener('click', () => {
//   modal.showModal();
// });

// const modal2 = new Modal('Modal Title', 'Modal Body', 'Modal Footer');
// document.body.appendChild(modal2.element);
// modal2.show();

const game = new Game();
game.init();

const modal = new Modal();
modal.open('Game Started', 'The game has started!');

const progress = new ProgressBar(
  45,
  () => {},
  () => alert('⏰ Tempo esgotado! Recomeça o jogo!')
);

progress.start();