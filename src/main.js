import Board from './modules/Board.js';
import CardsDefinition from './data/cards.d.js';
import Modal from './modules/Modal.js';

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

const board = new Board(document.querySelector('#board'), CardsDefinition);
board._init();