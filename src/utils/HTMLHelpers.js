import generateUUID from "./uuid.js";

/**
 * Create an HTML element
 * @param {string} tag - The tag of the element
 * @param {string[]} classes - The classes of the element
 * @param {string} text - The text content of the element
 * @param {string} id - The id of the element
 * 
 * @returns {HTMLElement} The HTML element
*/
export const createHTMLElement = (tag, classes = [], text = '', id = generateUUID()) => {
  const element = document.createElement(tag);
  element.id = id;
  element.classList.add(...classes);
  element.textContent = text;
  return element;
};


