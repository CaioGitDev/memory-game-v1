import Game from './modules/Game.js';


document.querySelector('#app').innerHTML = `
  <div id="container" class="container">
    <div id="board" class="board"></div>
  </div>
  `;

const game = new Game();
game.init();


//progress.start();