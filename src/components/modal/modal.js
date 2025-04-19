import { createHTMLElement } from '../../utils/HTMLHelpers.js';

/**
 * Represents a modal component for displaying user messages.
 */
export class Modal {
  #modal;
  #titleElement;
  #messageElement;
  #closeButton;
  #continueButton;

  /**
   * Initializes and creates the modal structure.
   */
  constructor() {
    this.#createModal();
  }

  /**
   * Creates the modal HTML structure and appends it to the document body.
   */
  #createModal() {
    this.#modal = createHTMLElement('div', ['modal']);

    const modalContent = createHTMLElement('div', ['modal-content']);

    const header = createHTMLElement('div', ['modal-header']);
    this.#titleElement = createHTMLElement('span', ['modal-title'], 'Title');
    this.#closeButton = createHTMLElement('span', ['close-btn'], '×');
    header.append(this.#titleElement, this.#closeButton);

    const body = createHTMLElement('div', ['modal-body']);
    this.#messageElement = createHTMLElement('p', ['modal-message'], 'Message');
    body.appendChild(this.#messageElement);

    const footer = createHTMLElement('div', ['modal-footer']);
    this.#continueButton = createHTMLElement('button', ['modal-button'], 'Continue');
    footer.appendChild(this.#continueButton);

    modalContent.append(header, body, footer);
    this.#modal.appendChild(modalContent);
    document.body.appendChild(this.#modal);

    this.#closeButton.onclick = () => this.close();
    this.#continueButton.onclick = () => this.close();
  }

  /**
   * Opens the modal with a given title and message.
   * @param {string} title - The modal title.
   * @param {string} message - The modal message.
   */
  open(title, message) {
    this.#titleElement.textContent = title;
    this.#messageElement.textContent = message;
    this.#modal.style.display = 'block';
  }

  /**
   * Closes the modal.
   */
  close() {
    this.#modal.style.display = 'none';
  }

  /**
   * Sets a custom handler for the continue button.
   * @param {Function} callback - Function to execute on continue.
   */
  onContinue(callback) {
    this.#continueButton.onclick = () => {
      callback();
      this.close();
    };
  }

  /**
   * Returns the modal element for advanced manipulation.
   * @returns {HTMLElement}
   */
  get element() {
    return this.#modal;
  }
}
