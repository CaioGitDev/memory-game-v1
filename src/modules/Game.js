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
  #progressBar;
  #modal;
  #flipBackSound;
  #gameStarted = false;
  #gameEnded = false;
  #intervalHandler = null;
  #history;

  /**
   * Initializes the game, UI, and binds events.
   */
  init() {
    const music = new Audio('../../../public/sounds/euro2016.mp3');
    music.loop = true;
    music.volume = 0.2;

    const winSound = new Audio('../../../public/sounds/golo.mp3');
    this.#flipBackSound = new Audio('../../../public/sounds/esconder.mp3');

    const cardFactory = (cardData, sharedData) => new Card(cardData, sharedData);
    const boardElement = document.querySelector('#board');
    const cardsData = this.#getCardsData();

    this.#board = new Board(boardElement, cardsData, cardFactory);
    this.#board.preloadCards();

    this.#progressBar = new ProgressBar(
      45,
      () => {},
      () => this.#board.animateShuffle()
    );

    this.#modal = new Modal();

    const startButton = document.querySelector('#btn-start-game');
    startButton.addEventListener('click', () => {
      this.#startGame(startButton, music);
    });

    this.#history = new GameHistory('game_history', 10);
    this.#history.mount(document.querySelector('#history'));

    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        this.#resetGame();
        music.pause();
        music.currentTime = 0;
        startButton.style.display = 'block';
      }
    });
  }

  /**
   * Starts the game logic and audio.
   * @param {HTMLElement} button - Start game button.
   * @param {HTMLAudioElement} music - Background music.
   */
  #startGame(button, music) {
    this.#board.init();
    this.#progressBar.start();
    this.#startGameLoop();
    music.play();
    button.style.display = 'none';
  }

  /**
   * Starts the game loop at fixed intervals.
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
   * The main game loop executed each frame.
   */
  #gameLoop() {
    this.#checkFlippedCards();
    this.#checkWin();
  }

  /**
   * Checks whether the player has won.
   */
  #checkWin() {
    if (this.#board.cards.length === this.#board.matchedCards.length) {
      this.#gameEnded = true;
      clearInterval(this.#intervalHandler);
      this.#progressBar.stop();

      this.winSound.currentTime = 0;
      this.winSound.play();

      const duration = this.#progressBar.getTotalElapsed();
      const clicks = this.#board.clickCount;

      this.#history.addRecord({
        date: new Date().toISOString(),
        duration,
        clicks
      });

      this.#modal.open('Parabéns!', `Ganhou em ${duration} segundos!`);
      this.#modal.onContinue(() => this.#resetGame());
    }
  }

  /**
   * Handles flipped card comparison and matching.
   */
  #checkFlippedCards() {
    const [card1, card2] = this.#board.flippedCards;

    if (!card1 || !card2) return;

    const resetFlipped = () => {
      this.#board.flippedCards = [];
    };

    if (card1.identifier === card2.identifier) {
      setTimeout(() => {
        this.#setCardProps([card1, card2], 'isMatched', true);
        this.#board.matchedCards = [card1, card2, ...this.#board.matchedCards];
        resetFlipped();
      }, 500);
    } else {
      setTimeout(() => {
        this.#setCardProps([card1, card2], 'isFlipped', false);
        this.#board.flipCard(card1.element, false);
        this.#board.flipCard(card2.element, false);
        this.#flipBackSound.play();
        resetFlipped();
      }, 500);
    }
  }

  /**
   * Sets a property to a given value on multiple cards.
   * @param {Array} cards - Array of card objects.
   * @param {string} prop - Property name.
   * @param {any} value - Value to assign.
   */
  #setCardProps(cards, prop, value) {
    cards.forEach(card => {
      card[prop] = value;
    });
  }

  /**
   * Returns the cards data from the definitions.
   * @returns {Array}
   */
  #getCardsData() {
    return CardsDefinition;
  }

  /**
   * Resets the board and game state to initial.
   */
  #resetGame() {
    this.#board.clearBoard();
    this.#board.preloadCards();
    this.#progressBar.stop();
    this.#gameStarted = false;
    this.#gameEnded = false;
  }
}
