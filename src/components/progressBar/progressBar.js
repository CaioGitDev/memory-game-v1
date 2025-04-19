import { createHTMLElement } from '../../utils/HTMLHelpers.js';

/**
 * Represents a progress bar timer for a game using a native <progress> element.
 */
export class ProgressBar {

  constructor(duration = 45, onAlmostDone, onCycleComplete) {
    this.duration = duration;
    this.remaining = duration;
    this.totalElapsed = 0;

    this.interval = null;
    this.onAlmostDone = onAlmostDone;
    this.onCycleComplete = onCycleComplete;

    this.progressElement = null;
    this.labelElement = null;
    this.warningSent = false;

    this.createProgressBar();
  }

  /**
   * Creates the native HTML <progress> element and label.
   */
  createProgressBar() {
    const container = createHTMLElement('div', ['progress-container']);

    this.labelElement = createHTMLElement('div', ['progress-label'], `Tempo: ${this.remaining}s`);

    this.progressElement = document.createElement('progress');
    this.progressElement.classList.add('progress-native');
    this.progressElement.max = this.duration;
    this.progressElement.value = 0;

    container.appendChild(this.labelElement);
    container.appendChild(this.progressElement);

    const appContainer = document.querySelector('#app');
    if (appContainer) {
      appContainer.insertAdjacentElement('beforebegin', container);
    }
  }

  /**
   * Starts the progress countdown and updates the UI.
   */
  start() {
    this.interval = setInterval(() => {
      this.remaining--;
      this.totalElapsed++;
      this.updateProgress();

      if (this.remaining === 5 && !this.warningSent) {
        this.warningSent = true;
        this.progressElement.classList.add('warning');
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
   * Updates the <progress> value and time label.
   */
  updateProgress() {
    this.progressElement.value = this.duration - this.remaining;
    this.labelElement.textContent = `Tempo: ${this.remaining}s`;
  }

  /**
   * Resets the cycle and restarts the countdown.
   */
  resetCycle() {
    this.remaining = this.duration;
    this.warningSent = false;
    this.progressElement.classList.remove('warning');
    this.progressElement.value = 0;
  }

  /**
   * Stops the countdown and resets the progress.
   */
  stop() {
    clearInterval(this.interval);
    this.interval = null;
    this.resetCycle();
    this.labelElement.textContent = `Tempo: ${this.remaining}s`;
  }

  /**
   * Returns the total elapsed time since the progress bar started.
   */
  getTotalElapsed() {
    return this.totalElapsed;
  }
}
