/**
 * Create an HTML element
 * @param {string} tag - The tag of the element
 * @param {string[]} classes - The classes of the element
 * @param {string} text - The text content of the element
 * @param {string} id - The id of the element
 * 
 * @returns {HTMLElement} The HTML element
*/
export const createHTMLElement = (tag, classes = [], text = '', id = uuidv4()) => {
  const element = document.createElement(tag);
  element.id = id;
  element.classList.add(...classes);
  element.textContent = text;
  return element;
};

/**
 * Create a unique identifier
 * @returns {string} The unique identifier
*/
function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}
