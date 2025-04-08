import Board from './Board.js';
import CardsDefinition from '../data/cards.d.js';

export default class Game {
  constructor(){
    // initialize game variables
    this.board = null;
    this._gameStarted = false;
    this._gameEnded = false;

    this._timeHandler = null;

    this.gameOptions = {
      gameCicle: {
        // 30 FPS 
        FPS:  1000 / 1,
      }
    }
  }

  /**
   * start the game adding game cicle
   * @returns {void} 
   */
  init(){

    // get board element
    const boardElement = document.querySelector('#board');
    // get cards data
    const cardsData = this.getCardsData();
    // create board instance
    this.board = new Board(boardElement, cardsData);
    // add game cicle
    this.startGame();

  }

  /**
   * get cards data
   * @returns {Array} - array of cards data
   */
  getCardsData(){
    // get cards data from the json file
    return CardsDefinition;
  }

  /**
   * 
   */
  startGame(){
    const { FPS } = this.gameOptions.gameCicle;
    // check if game is started
    if(!this._gameStarted){
      this._gameStarted = true;
      this._gameEnded = false;

      // start game cicle
      this._timeHandler = setInterval(this.gameCicle.bind(this), FPS);
    }
  }

  /**
   * 
   */
  endGame(){

  }

  /**
   * 
   */
  checkFlipped(){

  }

  /**
   * Game cicle 
   * 
   * @returns {void}
   */
  gameCicle(){
    // check flipped cards
    this.checkFlippedCards();

    
  }

  /**
   * check if two cards are flipped and match them
   * @returns {void}
   */
  checkFlippedCards(){
    const flippedCards = this.board._flippedCards;
  
    const [card1, card2] = flippedCards;

    console.log(card1, card2)

    // check if two cards are flipped
    if(flippedCards.length === 2){
      // check if cards are matched
      if(card1.identifier === card2.identifier){
        setTimeout(() => {

          this._toggleProp(card1, "isMatched");
          this._toggleProp(card2, "isMatched");

         this.board._matchedCards = [card1, card2, ...this.board._matchedCards]

          this.board._flippedCards = [];
        }, 500);
        
      }else{
        setTimeout(() => {

          this._toggleProp(card1, "isFlipped");
          this._toggleProp(card2, "isFlipped");

          this.board._flipCard(card1.element);
          this.board._flipCard(card2.element);

          this.board._flippedCards = [];
        }, 500);
      }
    }
  }

  /**
   * toogle prop 
   * @param {object} - object to toggle
   * @param {string} - prop
   * @returns {void}
   */
  _toggleProp(card, prop){
    card[prop] = !card[prop];
  }
}