import Card from './Card.js';
import data from '../data/data.js';

export default class Board {
  /**
   * @param {HTMLElement} container - The container of the board
   * @param {Array} cards - The cards to be added to the board
   */
  constructor(container, cards){
    this.container = container;
    // Create an array with the cards duplicated
    this.cardDataArray = [
      ...cards,
      ...cards
    ];
    this._flippedCards = [];
    this._matchedCards = [];

    this.cards = [];

    this._init();
  }

  /**
   * Initialize the board
   * @returns {void}
   */
  _init(){
    
    // Shuffle the cards
    const shuffledCards = this._shuffleCards(this.cardDataArray);
    
    // clean container before adding cards
    this.container.innerHTML = '';
    this.cards = [];
    

    // Create the card instances and add them to the container
    shuffledCards.forEach(cardData => {
      const card = new Card(cardData,  data);

      this.cards.push(card);
      this.container.appendChild(card.element);
      
    });

    console.log('cards', this.cards);


  }

  /**
   * Shuffle the cards
   * @param {Array} cards - The cards to be shuffled
   * @returns {Array} The shuffled cards
   */
  _shuffleCards(cards){
    let currentIndex = cards.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while(0 !== currentIndex){
      // Pick a random element
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element
      temporaryValue = cards[currentIndex];
      cards[currentIndex] = cards[randomIndex];
      cards[randomIndex] = temporaryValue;
    }

    return cards;
  }

  /**
   * Update the board if needed
   * @returns {void}
  */
  _updateBoard(){
    this.container.innerHTML = '';
    this.cards.forEach(card => {
      this.container.appendChild(card.element);
    });
  }

  /**
   * reshuflle the cards that have not yet been matched
   * @returns {void}
   */
  _reshuffle(){
    // filter cards that are not matched
    const unMatchedCards = this.cards.filter(card => !card.isMatched);
    const dataToShuffle = unMatchedCards.map(card => card.data);
    // shuffle the data
    const shuffledData = this._shuffleCards(dataToShuffle);

    // update the card data
    unMatchedCards.forEach((card, index) => {
      card._updateData(shuffledData[index]);
    });

    // update the board
    this._updateBoard();
  }
}