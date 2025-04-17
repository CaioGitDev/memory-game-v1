import { createHTMLElement } from '../../utils/HTMLHelpers.js';

/**
 * Represents a progress bar timer for a game.
 * Displays elapsed time visually and triggers callbacks on specific moments.
 */
export class ProgressBar {

  /**
   * Creates a progress bar element and appends it to the body.
   * Sets up event listeners for the progress bar.
   * @param {number} duration - The duration of each cycle of the progress bar in seconds (default: 45).
   * @param {function} onAlmostDone - Callback function called 5 seconds before the cycle ends.
   * @param {function} onCycleComplete - Callback function called when the cycle ends.
   */
  constructor(duration = 45, onAlmostDone, onCycleComplete){
    this.duration = duration;
    this.remaining = duration;
    this.totalElapsed = 0;

    this.interval = null;
    this.onAlmostDone = onAlmostDone;
    this.onCycleComplete = onCycleComplete;

    this.progressBarElement = null;
    this.progressBarLabelElement = null;
    this.warningSent = false;

    this.createProgressBar();
  }

  /**
   * Creates the HTML structure for the progress bar and appends it to the document body.
   */
  createProgressBar(){
    const container = createHTMLElement('div', ['progress-container']);

    this.progressBarLabelElement = createHTMLElement('div', ['progress-label'], `Tempo: ${this.remaining}s`);

    const bar = createHTMLElement('div', ['progress-bar']);
    this.progressBarElement = createHTMLElement('div', ['progress-fill']);
    bar.appendChild(this.progressBarElement);

    container.appendChild(this.progressBarLabelElement);
    container.appendChild(bar);

    // append before #app

    const appContainer = document.querySelector('#app');
    if (appContainer) {
      appContainer.insertAdjacentElement('beforebegin', container);
    }
    
  }

  /**
   * Starts the progress bar countdown and triggers callbacks when conditions are met.
   */
  start() {
    this.interval = setInterval(() => {
      this.remaining--;
      this.totalElapsed++;
      this.updateProgress();

      if (this.remaining === 5 && !this.warningSent) {
        this.warningSent = true;
        this.progressBarElement.classList.add('warning');
        if (typeof this.onAlmostDone === 'function') {
          this.onAlmostDone();
        }
      }

      if (this.remaining <= 0) {
        if (typeof this.onCycleComplete === 'function') {
          this.onCycleComplete();
        }
        this.resetCycle();
      }
    }, 1000);
  }

  /**
   * Updates the progress bar visual width and time label.
   */
  updateProgress() {
    const percent = ((this.duration - this.remaining) / this.duration) * 100;
    this.progressBarElement.style.width = `${percent}%`;
    this.progressBarLabelElement.textContent = `Tempo: ${this.remaining}s`;
  }

  /**
   * Resets the progress bar to the initial state and starts a new cycle.
   */
  resetCycle() {
    this.remaining = this.duration;
    this.warningSent = false;
    this.progressBarElement.classList.remove('warning');
    this.progressBarElement.style.width = '0%';
  }

  /**
   * Stops the progress bar and clears its visual state.
   */
  stop() {
    clearInterval(this.interval);
    this.interval = null;
    this.resetCycle();
    this.progressBarLabelElement.textContent = `Tempo: ${this.remaining}s`;
  }

  /**
   * Returns the total elapsed time since the progress bar started.
   * This value is not reset with each cycle.
   * @returns {number} The total time elapsed in seconds.
   */
  getTotalElapsed() {
    return this.totalElapsed;
  }
}
