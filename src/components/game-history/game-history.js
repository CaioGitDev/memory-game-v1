import { createHTMLElement } from '../../utils/HTMLHelpers.js';

/**
 * Manages and renders the game history using localStorage and a table view.
 */
export class GameHistory {
  #storageKey;
  #history;
  #container;
  #maxRecords;
  #dateFilter;

  /**
   * Initializes the game history manager.
   * @param {string} storageKey - Key used in localStorage.
   * @param {number|null} maxRecords - Max number of records to display.
   */
  constructor(storageKey = 'game_history', maxRecords = null) {
    this.#storageKey = storageKey;
    this.#history = this.#loadFromStorage();
    this.#container = null;
    this.#maxRecords = maxRecords;
    this.#dateFilter = null;
  }

  /**
   * Adds a new game record and updates the view.
   * @param {Object} data - { date: string, duration: number, clicks: number }
   */
  addRecord(data) {
    const record = {
      id: Date.now(),
      ...data
    };

    this.#history.push(record);
    this.#saveToStorage();
    this.render();
  }

  /**
   * Mounts the component in a given container element.
   * @param {HTMLElement} targetContainer - The container to render into.
   */
  mount(targetContainer) {
    this.#container = targetContainer;
    this.render();
  }

  /**
   * Clears all stored records.
   */
  clear() {
    this.#history = [];
    this.#saveToStorage();
    this.render();
  }

  /**
   * Sets a limit on the number of records displayed.
   * @param {number} limit
   */
  setLimit(limit) {
    this.#maxRecords = limit;
    this.render();
  }

  /**
   * Sets a date filter for the records shown.
   * @param {Date|null} startDate
   * @param {Date|null} endDate
   */
  setDateFilter(startDate, endDate) {
    this.#dateFilter = { start: startDate, end: endDate };
    this.render();
  }

  /**
   * Clears any applied filters.
   */
  clearFilters() {
    this.#dateFilter = null;
    this.#maxRecords = null;
    this.render();
  }

  /**
   * Renders the game history table.
   */
  render() {
    if (!this.#container) return;

    this.#container.innerHTML = '';

    const filtered = this.#applyFilters(this.#getSortedHistory());

    if (filtered.length === 0) {
      const message = createHTMLElement('p', ['history-empty'], 'No previous records.');
      this.#container.appendChild(message);
      return;
    }

    const table = createHTMLElement('table', ['game-history-table']);
    const thead = createHTMLElement('thead');
    const headerRow = createHTMLElement('tr');
    headerRow.append(
      createHTMLElement('th', [], 'Data'),
      createHTMLElement('th', [], 'Tempo'),
      createHTMLElement('th', [], 'Nº Clicks')
    );
    thead.appendChild(headerRow);

    const tbody = createHTMLElement('tbody');
    for (const record of filtered) {
      const dateObj = new Date(record.date);
      const formattedDate = dateObj.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const row = createHTMLElement('tr');
      row.append(
        createHTMLElement('td', [], formattedDate),
        createHTMLElement('td', [], `${record.duration}s`),
        createHTMLElement('td', [], `${record.clicks}`)
      );
      tbody.appendChild(row);
    }

    table.append(thead, tbody);
    this.#container.appendChild(table);
  }

  /**
   * Sorts history by best time, then lowest click count.
   * @returns {Array}
   */
  #getSortedHistory() {
    return [...this.#history].sort((a, b) => {
      if (a.duration !== b.duration) return a.duration - b.duration;
      return a.clicks - b.clicks;
    });
  }

  /**
   * Applies filters and limits to the sorted history.
   * @param {Array} historyArray
   * @returns {Array}
   */
  #applyFilters(historyArray) {
    let result = [...historyArray];

    if (this.#dateFilter) {
      result = result.filter(record => {
        const recordDate = new Date(record.date);
        const { start, end } = this.#dateFilter;
        return (!start || recordDate >= start) && (!end || recordDate <= end);
      });
    }

    if (this.#maxRecords && result.length > this.#maxRecords) {
      result = result.slice(0, this.#maxRecords);
    }

    return result;
  }

  /**
   * Loads history from localStorage.
   * @returns {Array}
   */
  #loadFromStorage() {
    const raw = localStorage.getItem(this.#storageKey);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Saves history to localStorage.
   */
  #saveToStorage() {
    localStorage.setItem(this.#storageKey, JSON.stringify(this.#history));
  }
}
