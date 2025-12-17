// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Import allure plugin
import '@shelex/cypress-allure-plugin'

// Ignore specific app errors so tests can continue
Cypress.on('uncaught:exception', (err) => {
  if (err && err.message && err.message.includes('getContext')) {
    return false
  }
  // allow other errors to fail the test
})

// Stub canvas getContext globally to avoid Chart.js errors in headless runs
Cypress.on('window:before:load', (win) => {
  try {
    if (win && win.HTMLCanvasElement && win.HTMLCanvasElement.prototype) {
      // Only stub if not already defined or to ensure stability in CI
      const original = win.HTMLCanvasElement.prototype.getContext
      win.HTMLCanvasElement.prototype.getContext = function () {
        return {
          // minimal mock API that some chart libs touch
          fillRect() {},
          clearRect() {},
          getImageData() { return { data: [] } },
          putImageData() {},
          createImageData() { return [] },
          setTransform() {},
          drawImage() {},
          save() {},
          fillText() {},
          restore() {},
          beginPath() {},
          moveTo() {},
          lineTo() {},
          closePath() {},
          stroke() {},
          translate() {},
          scale() {},
          rotate() {},
          arc() {},
          fill() {},
          measureText() { return { width: 0 } },
          transform() {},
          rect() {},
          clip() {},
        }
      }
      // Keep a reference if needed elsewhere
      win.__originalCanvasGetContext__ = original
    }
  } catch (e) {
    // best-effort; do not throw in support hook
  }
})