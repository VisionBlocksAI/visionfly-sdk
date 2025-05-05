// jest.setup.js

// Import Jest DOM matchers
import "@testing-library/jest-dom";

// Mock element classes needed for React Testing Library
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock global objects
global.ResizeObserver = ResizeObserver;
global.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

// Mock the File constructor
global.File = class MockFile {
  constructor(parts, filename, options = {}) {
    this.name = filename;
    this.content = parts.join("");
    this.size = this.content.length;
    this.type = options.type || "";
  }
};

// Mock the FormData constructor
global.FormData = class MockFormData {
  constructor() {
    this.data = {};
  }

  append(key, value) {
    this.data[key] = value;
  }
};

// Add custom jest matchers
expect.extend({
  // Custom matcher for finding elements by className
  toHaveClass(received, className) {
    const pass = received.classList.contains(className);
    if (pass) {
      return {
        message: () => `expected ${received} not to have class "${className}"`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to have class "${className}"`,
        pass: false,
      };
    }
  },
});

// Add missing methods to JSDOM environment
if (typeof window !== "undefined") {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
}

// Helper for screen.getByClass
document.getByClass = function (className) {
  return document.querySelector(`.${className}`);
};

// Add the method to screen
import { screen } from "@testing-library/react";
screen.getByClass = function (className) {
  const element = document.getByClass(className);
  if (!element) {
    throw new Error(`Unable to find an element with class: ${className}`);
  }
  return element;
};
