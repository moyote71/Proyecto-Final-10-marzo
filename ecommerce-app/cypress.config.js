const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    allowCypressEnv: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    testIsolation: true,
  },
  // Variables públicas de configuración (no sensibles)
  expose: {
    apiBaseUrl: 'http://localhost:5000/api'
  }
});
