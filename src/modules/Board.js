import data from '../data/data.js';
import Shuffle from '../utils/shuffle.js';

/**
 * Class representing a game board. this class is responsible for the game board and its logic.
 * It handles the game state, cards, and game logic.
 * @class Board
 */
export default class Board {
  /**
   * Creates an instance of Board.
   * @param {HTMLElement} container - The HTML element representing the game board.
   * @param {Array} cards - The data for the cards to be used in the game.
   * @param {Function} cardFactory - A factory function to create card instances.
   */
  constructor(container, cards, cardFactory){
    this.container = container;
    this.cardsDataArray = [...cards, ...cards];// ... this is the spread operator, it creates a shallow copy of the array
    this.cardFactory = cardFactory;

    // controll variables
    this.flippedCards = [];
    this.matchedCards = [];
    this.cards = [];

    // this flag is used to check if the game is started or not
    // and to prevent the user from clicking on the cards before the game starts    
    this.isGameStarted = false;
  }

  /**
   * Initializes the game board: shuffles, creates and renders cards.
   * @returns {void}
   */
  init(){
    this.isGameStarted = true;

    this.clearBoard();
    const shuffledCards = this.shuffleCards(this.cardsDataArray);

    shuffledCards.forEach(cardData => {
      const card = this.createCard(cardData);
      this.cards.push(card);
      this.container.appendChild(card.element);
    });

    this.animateShuffle();
  }

  /**
   * this function will preload whe cards waiting for the user start the game.
   * @returns {void}
   */
  preloadCards() {
    this.clearBoard();
    const shuffledCards = this.shuffleCards(this.cardsDataArray);

    shuffledCards.forEach(cardData => {
      const card = this.createCard(cardData);
      this.cards.push(card);
      this.flipCard(card.element)
      // disable the card click event
      this.container.appendChild(card.element);
    });
  }

  /**
   * Clears the container and resets the cards array.
   * @returns {void}
   */
  clearBoard() {
    this.container.innerHTML = '';
    this.cards = [];
  }

  /**
   * Creates a new card and attaches click handler.
   * @param {Object} cardData - The data used to create a card.
   * @returns {Card}
   */
  createCard(cardData) {
    const card = this.cardFactory(cardData, data);

    // Attach click event listener to the card element
    if(this.isGameStarted) {
      card.element.addEventListener('click', () => {
        this.handleCardClick(card);
      }); 
    }
    return card;
  }

  /**
   * Handles card click logic.
   * This method is responsible check if the card is already flipped or matched, and if two cards are already flipped.
   * If not, it flips the card and adds it to the flippedCards array.
   * @param {Card} card - The clicked card instance.
   * @returns {void}
   */
  handleCardClick(card) {
    const { element } = card;

    if(card.isFlipped || card.isMatched || this.flippedCards.length === 2) return;

    card.isFlipped = true;
    this.flipCard(element);
    this.flippedCards.push(card);
  }

  /**
   * Flips the visual representation of a card element.
   * this method is responsible for toggling the classes of the card element to show the front or back side.
   * * @param {HTMLElement} cardContainer - DOM element of the card.
   * @returns {void}
   */
  flipCard(cardContainer) {

    const classesToToggle = ['card_hidden', 'card_appear'];
    const frontCard = cardContainer.querySelector('.card_face-front');
    const backCard = cardContainer.querySelector('.card_face-back');

    classesToToggle.forEach(className => {
      frontCard.classList.toggle(className);
      backCard.classList.toggle(className);
    });
  }

  /**
   * Shuffles an array of cards using Fisher-Yates algorithm.
   * Uses the Shuffle utility to shuffle the cards.
   * More documentation on Fisher-Yates shuffle can be found at:
   * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
   * @param {Array} cards - The cards to shuffle.
   * @returns {Array} The shuffled array.
   */
  shuffleCards(cards) {
    return Shuffle.FisherYates(cards);
  }

  /**
   * Simulates a visual shuffle animation by reshuffling the cards and flipping them back to their original state.
   * a fixed number of times with a delay between each reshuffle.
   * @param {number} iterations - Number of times to reshuffle (default: 10)
   * @param {number} intervalMs - Time between reshuffles in milliseconds (default: 200)
   * @returns {void}
   */
  animateShuffle(iterations = 10, intervalMs = 200){
    let currentIteration = 0;

    const shuffleInterval = setInterval(() => {
      this.reshuffleUnmatchedCards();
      currentIteration++;

      if(currentIteration >= iterations){
        clearInterval(shuffleInterval);

        // await a moment before flipping cards to finalize animation
        setTimeout(() => {
          this.cards.forEach(card => this.flipCard(card.element));
          this.updateBoard();
        }, 1000);
      }
    }, intervalMs);
  }

  /**
   * Updates the board container with the corrent cards elements
   * * @returns {void}
   */
  updateBoard() {
    this.container.innerHTML = '';
    this.cards.forEach(card => {
      this.container.appendChild(card.element);
    });
  }

  /**
   * Reshuffles only the unmatched cards, keeping the matched ones in their original positions.
   * @returns {void}
   */
  reshuffleUnmatchedCards(){
    // get the indexes of the unmatched cards
    const unmatchedCardsIndexes = this.cards
    .map((card, index) => !card.isMatched ? index : null)
    .filter(index => index !== null);

    // get the unmatched cards
    const unmatchedCards = unmatchedCardsIndexes.map(index => this.cards[index]);

    // shuffle the unmatched cards
    const shuffledUnmatchedCards = this.shuffleCards([...unmatchedCards]);

    // creates a new array with the shuffled unmatched cards and the matched ones
    const updatedCards = [...this.cards];
    unmatchedCardsIndexes.forEach((index, i) => {
      updatedCards[index] = shuffledUnmatchedCards[i];
    });

    // updates the DOM with the shuffled unmatched cards keeping the matched ones in their original positions
    this.container.innerHTML = '';
    updatedCards.forEach(card => {
      this.container.appendChild(card.element);
    });

    this.cards = updatedCards;
  }
}