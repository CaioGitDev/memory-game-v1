import { createHTMLElement } from '../utils/HTMLHelpers.js';

export default class Modal {
  constructor(title, body, footer) {
    this.title = title;
    this.body = body;
    this.footer = footer;
    this.element = this._createModalElement();
  }

  _createModalElement() {
    const modalElement = createHTMLElement('div', ['modal']);
    modalElement.innerHTML = `
     <div class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <span class="close">&times;</span>
          <h2>Modal Title</h2>
        </div>
        <div class="modal-body">
          Modal body content goes here.
        </div>
        <div class="modal-footer">
          Footer content
        </div>
      </div>
    </div>
    `;

    const closeButton = modalElement.querySelector('.close');
    closeButton.addEventListener('click', () => this.hide());

    return modalElement;
  }

  show() {
    this.element.classList.add('show');
  }

  hide() {
    
    this.element.classList.remove('show');
    this.element.children[0].classList.add('hide');
  }


}