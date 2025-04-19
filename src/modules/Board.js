import data from '../data/data.js';
import Shuffle from '../utils/shuffle.js';

/**
 * Manages the logic and state of the memory game board.
 */
export default class Board {
  #container;
  #cardsData;
  #cardFactory;
  #cards;
  #flippedCards;
  #matchedCards;
  #clickCount;
  #isGameStarted;
  #flipSound;
  /**
   * Initializes the board.
   * @param {HTMLElement} container - The DOM container for the board.
   * @param {Array} cards - The base card data (one per pair).
   * @param {Function} cardFactory - A function that returns a card object.
   */
  constructor(container, cards, cardFactory) {
    this.#container = container;
    this.#cardsData = [...cards, ...cards];
    this.#cardFactory = cardFactory;

    this.#cards = [];
    this.#flippedCards = [];
    this.#matchedCards = [];
    this.#clickCount = 0;
    this.#isGameStarted = false;
    this.#flipSound = new Audio('../../../public/sounds/virar.mp3');
  }

  /**
   * Prepares and starts a new game round.
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
   * Preloads shuffled cards before game starts.
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
   * Returns the total number of card clicks made.
   * @returns {number}
   */
  getClickCount() {
    return this.#clickCount;
  }

  /**
   * Clears the board state and UI.
   */
  clearBoard() {
    this.#container.innerHTML = '';
    this.#cards = [];
  }

  /**
   * Creates a card using the factory and binds its event.
   * @param {Object} cardData - Card face data.
   * @returns {Object} A card object.
   */
  #createCard(cardData) {
    const card = this.#cardFactory(cardData, data);
    if (this.#isGameStarted) {
      card.element.addEventListener('click', () => this.#handleCardClick(card));
    }
    return card;
  }

  /**
   * Handles the card flip interaction.
   * @param {Object} card - The clicked card.
   */
  #handleCardClick(card) {
    if (card.isFlipped || card.isMatched || this.#flippedCards.length === 2) return;

    card.isFlipped = true;
    this.flipCard(card.element, true);
    this.#flippedCards.push(card);
    this.#clickCount++;

    //add virar.mp3 sound
    this.#flipSound.currentTime = 0;
    this.#flipSound.play();

  }

  /**
   * Updates the visual state of a card.
   * @param {HTMLElement} cardContainer - The card's container element.
   * @param {boolean} showFront - Whether to show the front side.
   */
  flipCard(cardContainer, showFront) {
    const front = cardContainer.querySelector('.card_face-front');
    const back = cardContainer.querySelector('.card_face-back');

    if (showFront) {
      front.classList.remove('card_hidden');
      front.classList.add('card_appear');
      back.classList.remove('card_appear');
      back.classList.add('card_hidden');
    } else {
      front.classList.remove('card_appear');
      front.classList.add('card_hidden');
      back.classList.remove('card_hidden');
      back.classList.add('card_appear');
    }
  }

  /**
   * Visually animates a shuffle cycle and flips cards back after animation ends.
   * @param {number} iterations - Number of shuffle rounds.
   * @param {number} intervalMs - Delay between each shuffle.
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
   * Updates the container with the current card elements.
   */
  updateBoard() {
    this.#container.innerHTML = '';
    this.#cards.forEach(card => {
      this.#container.appendChild(card.element);
    });
  }

  /**
   * Reshuffles only unmatched cards, maintaining matched cards in place.
   */
  reshuffleUnmatchedCards() {
    const unmatchedIndices = this.#cards
      .map((card, index) => (!card.isMatched ? index : null))
      .filter(index => index !== null);

    const unmatchedCards = unmatchedIndices.map(i => this.#cards[i]);
    const shuffled = this.#shuffleCards([...unmatchedCards]);

    const updatedCards = [...this.#cards];
    unmatchedIndices.forEach((index, i) => {
      updatedCards[index] = shuffled[i];
    });

    this.#cards = updatedCards;
    this.updateBoard();
  }

  /**
   * Randomly shuffles a card array using the Shuffle utility.
   * @param {Array} cards - The array to shuffle.
   * @returns {Array} The shuffled array.
   */
  #shuffleCards(cards) {
    return Shuffle.FisherYates(cards);
  }

  /**
   * returns the flipped cards
   * @returns {Array} The flipped cards.
   */
  get flippedCards() {
    return this.#flippedCards;
  }

  set flippedCards(cards) {
    this.#flippedCards = cards;
  }

  /**
   * returns the matched cards
   * @returns {Array} The matched cards.
   */
  get matchedCards() {
    return this.#matchedCards;
  }

  set matchedCards(cards) {
    this.#matchedCards = cards;
  }

  /**
   * returns the cards
   * @returns {Array} The cards.
   */
  get cards() {
    return this.#cards;
  }

  /**
   * returns the card data
   * @returns {Array} The card data.
   */
  get cardsData() {
    return this.#cardsData;
  }

  /**
   * returns the click count
   * @returns {number} The click count.
   */
  get clickCount() {
    return this.#clickCount;
  }
}
