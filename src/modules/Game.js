import Board from './Board.js';
import Card from './Card.js';
import CardsDefinition from '../data/cards.d.js';
import { Modal } from '../components/modal/modal.js';
import { ProgressBar } from '../components/progressBar/progressBar.js';
import { GameHistory } from '../components/game-history/game-history.js';

/**
 * Main controller for the memory game.
 */
export default class Game {
  #board;
  #gameStarted = false;
  #gameEnded = false;
  #intervalHandler = null;
  #progressBar;
  #modal;
  #flipBackSound;

  /**
   * Initializes and starts the game.
   */
  init() {
    const backgroundMusic = new Audio('../../../public/sounds/euro2016.mp3');
    const winSound = new Audio('../../../public/sounds/golo.mp3');
    this.flipBackSound = new Audio('../../../public/sounds/esconder.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2;
    

    const cardFactory = (cardData, sharedData) => new Card(cardData, sharedData);

    const boardElement = document.querySelector('#board');
    const cardsData = this.#getCardsData();

    this.#board = new Board(boardElement, cardsData, cardFactory);
    this.#board.preloadCards();

    this.#progressBar = new ProgressBar(
      45,
      () => {},
      () => {
        this.#board.animateShuffle();
      }
    );

    this.#modal = new Modal();

    const startButton = document.querySelector('#btn-start-game');
    startButton.addEventListener('click', () => {
      this.#board.init();
      startButton.style.display = 'none';
      this.#progressBar.start();
      this.#startGameLoop();
      backgroundMusic.play();
    });

    this.history = new GameHistory('game_history', 10);
    this.history.mount(document.querySelector('#history'));
    

    // add event listener to keyboard space key to reset the game
    document.addEventListener('keydown', (event) => {
      console.log(event.code);
      if (event.code === 'Space') {
        this.#resetGame();
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        startButton.style.display = 'block';
      }
    });
  }

  /**
   * Returns card definitions loaded from the data source.
   * @returns {Array}
   */
  #getCardsData() {
    return CardsDefinition;
  }

  /**
   * Starts the game loop with a fixed frame rate.
   */
  #startGameLoop() {
    const FPS = 1000 / 1;

    if (!this.#gameStarted) {
      this.#gameStarted = true;
      this.#gameEnded = false;
      this.#intervalHandler = setInterval(this.#gameLoop.bind(this), FPS);
    }
  }

  /**
   * Game loop executed at regular intervals.
   */
  #gameLoop() {
    this.#checkFlippedCards();
    this.#checkWin();
  }

  /**
   * Checks whether the player has matched all cards and ends the game if true.
   */
  #checkWin() {
    if (this.#board.cards.length === this.#board.matchedCards.length) {
      this.#gameEnded = true;
      clearInterval(this.#intervalHandler);
      this.#progressBar.stop();

      const elapsed = this.#progressBar.getTotalElapsed();
      const clicks = this.#board.clickCount;
      this.history.addRecord({
        date: new Date().toISOString(),
        duration: elapsed,
        clicks: clicks
      });

      this.#modal.open('Parabéns!', `Ganhou em ${elapsed} segundos!`);
      this.#modal.onContinue(() => {
        this.#resetGame();
      });
    }
  }

  /**
   * Handles logic when two cards are flipped.
   */
  #checkFlippedCards() {
    const [card1, card2] = this.#board.flippedCards;

    if (!card1 || !card2) return;

    if (card1.identifier === card2.identifier) {
      setTimeout(() => {
        this.#setCardProps([card1, card2], 'isMatched', true);
        this.#board.matchedCards = [card1, card2, ...this.#board.matchedCards];
        this.#board.flippedCards = [];
      }, 500);
    } else {
      setTimeout(() => {
        this.#setCardProps([card1, card2], 'isFlipped', false);
        this.#board.flipCard(card1.element, false);
        this.#board.flipCard(card2.element, false);
        this.#board.flippedCards = [];

        this.flipBackSound.play();
      }, 500);
    }
  }

  /**
   * Sets a given property on one or more cards.
   * @param {Array} cards - The cards to update.
   * @param {string} prop - The property to update.
   * @param {any} value - The value to assign.
   */
  #setCardProps(cards, prop, value) {
    for (const card of cards) {
      card[prop] = value;
    }
  }

  /**
   * Resets the game to the initial state.
   */
  #resetGame() {
    this.#board.clearBoard();
    this.#board.preloadCards();
    this.#gameStarted = false;
    this.#gameEnded = false;
    this.#progressBar.stop();
  }
}
