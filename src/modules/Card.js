import { createHTMLElement } from '../utils/HTMLHelpers.js';

export default class Card {

  /**
   * @param {object} data - The data of the card
   * @param {object} spriteSheet - The sprite sheet JSON data
   */
  constructor(data, spriteSheet) {
    this.identifier = data.identifier;
    this.data = data;
    this.spriteSheet = spriteSheet;
    this.isFlipped = false;
    this.isMatched = false;

    this.spriteSheetBack = this.spriteSheet.frames['back.png'];

    this.element = this._createCardElement();
  }

  /**
 * create a card element
 * @returns {HTMLElement} card element
 */
  _createCardElement() {
    const cardElement = createHTMLElement('div', ['card']);
    const sheetImage = this.spriteSheet.meta.image;
    const { country } = this.data;
    const spriteData = this.spriteSheet.frames[`${country}.png`];
    const { x, y, w, h } = spriteData.frame;

    // creates a front face using the sprite corresponding to the country
    const cardFrontElement = this._createFaceElement(
      ['card_face', 'card_face-front', 'card_appear'],
      sheetImage,
      x,
      y,
      w,
      h
    );

    // create a back face using the default back sprite
    const {
      x: backX,
      y: backY,
      w: backW,
      h: backH
    } = this.spriteSheetBack.frame;

    const cardBackElement = this._createFaceElement(
      ['card_face', 'card_face-back', 'card_hidden'],
      sheetImage,
      backX,
      backY,
      backW,
      backH
    );

    cardElement.appendChild(cardFrontElement);
    cardElement.appendChild(cardBackElement);

    return cardElement;
  }

  /**
 * create a face element for the card
 * @param {string[]} classes - classes to be added to the element
 * @param {string} backgroundImage - URL of the background image
 * @param {number} x - x position of the sprite
 * @param {number} y - y position of the sprite
 * @param {number} width - width of the element
 * @param {number} height - height of the element
 * @return {HTMLElement} The created element
 */
  _createFaceElement(classes, backgroundImage, x, y, width, height) {
    const faceElement = createHTMLElement('div', classes);
    faceElement.style.backgroundImage = `url(${backgroundImage})`;
    faceElement.style.backgroundPosition = `-${x}px -${y}px`;
    faceElement.style.width = `${width}px`;
    faceElement.style.height = `${height}px`;
    return faceElement;
  }


  /**
   * Match the card
   * @returns {void}
   */
  _matchCard() {
    this.isMatched = true;
    this.element.classList.add('matched');
  }

  /**
   * Hide card
   * @returns {void}
   */
  _hideCard() {
    this.isFlipped = false;
    this.element.classList.remove('flipped');
  }

  /**
   * Update card data, pathFront 
   * @param {object} data - The card data
   * @returns {void}
   */
  _updateData() {    
    // this.identifier = newData.identifier;
    // this.spriteSheet = newData.spriteSheet;
    this.spriteSheetBack = this.spriteSheet.frames['back.png'];
    this.element = this._createCardElement();

    return this.element;

  }

}