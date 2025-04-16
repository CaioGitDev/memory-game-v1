
/**
 * Modal component for displaying messages to the user.
 * @class Modal
 */
export class Modal {

  constructor() {
    this.createModal();
  }

  /**
   * Creates the modal element and appends it to the body.
   * Sets up event listeners for closing the modal.
   */
  createModal() {
    this.modal = document.createElement('div');
    this.modal.classList.add('modal');

    this.modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <span class="modal-title">Título</span>
        <span class="close-btn">&times;</span>
      </div>
      <div class="modal-body">
        <p class="modal-message">Mensagem</p>
      </div>
      <div class="modal-footer">
        <button class="modal-button">Continuar</button>
      </div>
    </div>
  `;

    document.body.appendChild(this.modal);

    this.titleEl = this.modal.querySelector('.modal-title');
    this.messageEl = this.modal.querySelector('.modal-message');
    this.closeBtn = this.modal.querySelector('.close-btn');
    this.continueBtn = this.modal.querySelector('.modal-button');

    this.closeBtn.onclick = () => this.close();
    this.continueBtn.onclick = () => this.close();
  }

  /**
   * Opens the modal with the given title and message.
   * @param {string} title - The title to display in the modal.
   * @param {string} message - The message to display in the modal.
   */
  open(title, message) {
    this.titleEl.textContent = title;
    this.messageEl.textContent = message;
    this.modal.style.display = 'block';
  }

  /**
   * Closes the modal.
   */
  close() {
    this.modal.style.display = 'none';
  }
}