import Card from './Card.js';
import data from '../data/data.js';

export default class Board {
  /**
   * @param {HTMLElement} container - The container of the board
   * @param {Array} cards - The cards to be added to the board
   */
  constructor(container, cards) {
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
  _init() {

    // Shuffle the cards
    const shuffledCards = this._shuffleCards(this.cardDataArray);

    // clean container before adding cards
    this.container.innerHTML = '';
    this.cards = [];


    // Create the card instances and add them to the container
    shuffledCards.forEach(cardData => {
      const card = new Card(cardData, data);
      const cardContainer = card.element;
      // get childs from card element container


      cardContainer.addEventListener('click', () => {

        if (card.isFlipped || card.isMatched ||
          // or flipped cards are already two
          this._flippedCards.length === 2
          ) return;

        card.isFlipped = true;
        this._flipCard(cardContainer);
        this._flippedCards.push(card);

      })

      this.cards.push(card);
      this.container.appendChild(card.element);

    });

    this._shuffledCardsControll();
  }

  /**
   * Flip the card, toggle class card_hidden to card_appear
   * @returns {void}
   **/
  _flipCard(cardElement){

    const cardFrontElement = cardElement.querySelector('.card_face-front');
    const cardBackElement = cardElement.querySelector('.card_face-back');

    cardFrontElement.classList.toggle('card_hidden');
    cardFrontElement.classList.toggle('card_appear');
    cardBackElement.classList.toggle('card_hidden');
    cardBackElement.classList.toggle('card_appear');

  }


  /**
   * Shuffle the cards
   * @param {Array} cards - The cards to be shuffled
   * @returns {Array} The shuffled cards
   */
  _shuffleCards(cards) {

    let currentIndex = cards.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
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

  // crie uma funcao que execute durante 3 segundos o embaralhar das cartas 
  // de forma aleatorio e visual, atualizando o container do board a cada 100ms
  _shuffledCardsControll() {
    let count = 0;
    const interval = setInterval(() => {
      this._reshuffle();
      count++;
      if (count === 10) {
        clearInterval(interval);
        
        setTimeout(() => {
          
          this.cards.forEach(card => {
            this._flipCard(card.element);
          });
          this._updateBoard();
          
        }, 1000);
      }
    }, 200);
  }

  /**
   * Update the board if needed
   * @returns {void}
  */
  _updateBoard() {
    this.container.innerHTML = '';
    this.cards.forEach(card => {
      this.container.appendChild(card.element);
    });
  }

  /**
   * reshuflle the cards that have not yet been matched
   * @returns {void}
   */
  _reshuffle() {
    
    // filter cards that are not matched
    const unMatchedCards = this.cards.filter(card => !card.isMatched);
    
    this.cards = [];

    // shuffle the data
    const shuffledData = this._shuffleCards(unMatchedCards);
    // update the card data
    shuffledData.forEach((card, index) => {

      this.cards.push(card);
      this.container.appendChild(card.element);

      const newCard = card._updateData();
      card.element = newCard;
    });

    // update the board
    this._updateBoard();
  }
}