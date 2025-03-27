import { createHTMLElement } from '../utils/HTMLHelpers.js';

export default class Card {

  /**
   * @param {object} data - The data of the card
   * @param {object} spriteSheet - The sprite sheet JSON data
   */
  constructor(data, spriteSheet){
    console.log(data);
    this.data = data;
    this.spriteSheet = spriteSheet;
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
    
    // get the sprite data from the sprite sheet by name of the sprite
    const spriteData = this.spriteSheet.frames[this.data.country + '.png'];

    const { x, y, w, h } = spriteData.frame;
    const sheetImage = this.spriteSheet.meta.image;

    const cardfrontelement = createHTMLElement('div', ['card_face', 'card_face-front', 'card_appear']);
    cardfrontelement.style.backgroundImage = `url(${sheetImage})`;
    cardfrontelement.style.backgroundPosition = `-${x}px -${y}px`;
    cardfrontelement.style.width = `${w}px`;
    cardfrontelement.style.height = `${h}px`;

    const cardBackElement = createHTMLElement('div', ['card_face', 'card_face-back', 'card_hidden']);
    cardBackElement.style.backgroundImage =  `url(${this.data.backImage})`;

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
    const spriteData = this.spriteSheet.frames[this.data.spriteName];
    const { x, y, w, h } = spriteData.frame;
    const sheetImage = this.spriteSheet.meta.image;

    const frontFace = this.element.querySelector('.card_face-front');
    frontFace.style.backgroundImage = `url(${sheetImage})`;
    frontFace.style.backgroundPosition = `-${x}px -${y}px`;
    frontFace.style.width = `${w}px`;
    frontFace.style.height = `${h}px`;
  }

}