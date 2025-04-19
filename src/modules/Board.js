import data from '../data/data.js';
import Shuffle from '../utils/shuffle.js';

/**
 * Represents the memory game board logic and state.
 */
export default class Board {
  #container;
  #cardsData;
  #cardFactory;
  #cards = [];
  #flippedCards = [];
  #matchedCards = [];
  #clickCount = 0;
  #isGameStarted = false;
  #flipSound;

  /**
   * Creates a new Board instance.
   * @param {HTMLElement} container - DOM element where the board will be rendered.
   * @param {Array} cards - The base data for cards (each one will be duplicated).
   * @param {Function} cardFactory - Factory function to create card instances.
   */
  constructor(container, cards, cardFactory) {
    this.#container = container;
    this.#cardsData = [...cards, ...cards];
    this.#cardFactory = cardFactory;
    this.#flipSound = new Audio('../../../public/sounds/virar.mp3');
  }

  /**
   * Starts a new game by shuffling and rendering cards.
   */
  init() {
    this.#isGameStarted = true;
    this.clearBoard();

    const shuffled = this.#shuffleCards(this.#cardsData);
    shuffled.forEach(data => {
      const card = this.#createCard(data);
      this.#cards.push(card);
      this.#container.appendChild(card.element);
    });

    this.animateShuffle();
  }

  /**
   * Preloads a shuffled board without triggering gameplay.
   */
  preloadCards() {
    this.clearBoard();

    const shuffled = this.#shuffleCards(this.#cardsData);
    shuffled.forEach(data => {
      const card = this.#createCard(data);
      this.#cards.push(card);
      this.flipCard(card.element, false);
      this.#container.appendChild(card.element);
    });
  }

  /**
   * Clears the board UI and resets the card array.
   */
  clearBoard() {
    this.#container.innerHTML = '';
    this.#cards = [];
  }

  /**
   * Creates a card instance and attaches a click handler.
   * @param {Object} cardData - Card-specific data.
   * @returns {Object} The created card.
   */
  #createCard(cardData) {
    const card = this.#cardFactory(cardData, data);
    if (this.#isGameStarted) {
      card.element.addEventListener('click', () => this.#handleCardClick(card));
    }
    return card;
  }

  /**
   * Handles the logic when a card is clicked.
   * @param {Object} card - The clicked card.
   */
  #handleCardClick(card) {
    if (card.isFlipped || card.isMatched || this.#flippedCards.length === 2) return;

    card.isFlipped = true;
    this.flipCard(card.element, true);
    this.#flippedCards.push(card);
    this.#clickCount++;

    this.#flipSound.currentTime = 0;
    this.#flipSound.play();
  }

  /**
   * Controls the visual flipping of a card.
   * @param {HTMLElement} cardContainer - The card DOM element.
   * @param {boolean} showFront - Whether to show the front side.
   */
  flipCard(cardContainer, showFront) {
    const front = cardContainer.querySelector('.card_face-front');
    const back = cardContainer.querySelector('.card_face-back');

    if (showFront) {
      front.classList.replace('card_hidden', 'card_appear');
      back.classList.replace('card_appear', 'card_hidden');
    } else {
      front.classList.replace('card_appear', 'card_hidden');
      back.classList.replace('card_hidden', 'card_appear');
    }
  }

  /**
   * Performs a visual shuffle animation and resets unmatched cards.
   * @param {number} iterations - Number of shuffles.
   * @param {number} intervalMs - Delay between shuffles.
   */
  animateShuffle(iterations = 10, intervalMs = 200) {
    let current = 0;

    const interval = setInterval(() => {
      this.reshuffleUnmatchedCards();
      current++;

      this.#cards.forEach(card => {
        if (!card.isMatched) this.flipCard(card.element, true);
      });

      if (current >= iterations) {
        clearInterval(interval);

        setTimeout(() => {
          this.#cards.forEach(card => {
            if (!card.isMatched) this.flipCard(card.element, false);
          });
          this.updateBoard();
        }, 1000);
      }
    }, intervalMs);
  }

  /**
   * Updates the DOM with the current card state.
   */
  updateBoard() {
    this.#container.innerHTML = '';
    this.#cards.forEach(card => this.#container.appendChild(card.element));
  }

  /**
   * Shuffles only unmatched cards while keeping matched cards in place.
   */
  reshuffleUnmatchedCards() {
    const unmatchedIndices = this.#cards
      .map((card, index) => (!card.isMatched ? index : null))
      .filter(index => index !== null);

    const unmatchedCards = unmatchedIndices.map(i => this.#cards[i]);
    const shuffled = this.#shuffleCards([...unmatchedCards]);

    const updated = [...this.#cards];
    unmatchedIndices.forEach((index, i) => {
      updated[index] = shuffled[i];
    });

    this.#cards = updated;
    this.updateBoard();
  }

  /**
   * Shuffles a card array using Fisher-Yates algorithm.
   * @param {Array} cards - Array to shuffle.
   * @returns {Array} Shuffled array.
   */
  #shuffleCards(cards) {
    return Shuffle.FisherYates(cards);
  }

  /** @returns {Array} The current flipped cards. */
  get flippedCards() {
    return this.#flippedCards;
  }

  /** @param {Array} cards - Sets the flipped cards. */
  set flippedCards(cards) {
    this.#flippedCards = cards;
  }

  /** @returns {Array} The matched cards. */
  get matchedCards() {
    return this.#matchedCards;
  }

  /** @param {Array} cards - Sets the matched cards. */
  set matchedCards(cards) {
    this.#matchedCards = cards;
  }

  /** @returns {Array} All cards on the board. */
  get cards() {
    return this.#cards;
  }

  /** @returns {Array} The base duplicated card data. */
  get cardsData() {
    return this.#cardsData;
  }

  /** @returns {number} The current number of card clicks. */
  get clickCount() {
    return this.#clickCount;
  }
}
