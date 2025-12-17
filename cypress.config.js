const { defineConfig } = require("cypress");
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:8000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      allureWriter(on, config);
      return config;
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    retries: {
      runMode: 2,
      openMode: 0
    },
    env: {
      // Test data
      adminEmail: 'admin@example.com',
      adminPassword: 'password',
      // Add other test users if available
      // safetyOfficerEmail: 'safety@example.com',
      // operatorEmail: 'operator@example.com',
      // supervisorEmail: 'supervisor@example.com'
    }
  },
});
