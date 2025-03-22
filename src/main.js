import Board from './modules/Board.js';
import CardsDefinition from './data/cards.d.js';

document.querySelector('#app').innerHTML = `
  <div id="container" class="container">
    <div id="board" class="board"></div>
    
  </div>
  `;

const board = new Board(document.querySelector('#board'), CardsDefinition);
board._init();