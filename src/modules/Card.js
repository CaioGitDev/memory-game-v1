import { createHTMLElement } from '../utils/HTMLHelpers.js';

export default class Card {

  /**
   * @param {object} data - The data of the card
   */
  constructor(data){
    console.log(data);
    this.data = data;
    this.isFlipped = false;
    this.isMatched = false;

    this.element = this._createCardElement();
  }

  /**
   * Create the card element
   * @returns {HTMLElement} The card element
   */
  _createCardElement(){
    const cardElement = createHTMLElement('div', ['card']);
    
    const cardfrontelement = createHTMLElement('div', ['card_face', 'card_face-front', 'card_appear', 'card_hidden']);
    cardfrontelement.style.backgroundImage = `url(${this.data.sprite.pathFront})`;

    const cardBackElement = createHTMLElement('div', ['card_face', 'card_face-back', 'card_show']);
    cardBackElement.style.backgroundImage =  `url(${this.data.sprite.pathBack})`;

    // Append the card front and back to the card element
    cardElement.appendChild(cardfrontelement);
    cardElement.appendChild(cardBackElement);

    // Add a click event to the card element
    cardElement.addEventListener('click', () => this._flipCard());

    return cardElement;
  }

  /**
   * Flip the card
   * if the card is matched, the card will not do anything
   * @returns {void}
   */
  _flipCard(){
    if(this.isMatched) return;
    this.isFlipped = !this.isFlipped;
    this.element.classList.toggle('flipped', this.isFlipped);
  }

  /**
   * Match the card
   * @returns {void}
   */
  _matchCard(){
    this.isMatched = true;
    this.element.classList.add('matched');
  }

  /**
   * Hide card
   * @returns {void}
   */
  _hideCard(){
    this.isFlipped = false;
    this.element.classList.remove('flipped');
  }

  /**
   * Update card data, pathFront 
   * @param {object} data - The card data
   * @returns {void}
   */
  _updateData(newData){
    this.data = newData;
    this.element.querySelector('.card_face-front')
    .style.backgroundImage = `url(${this.data.sprite.pathFront})`;
  }

}