const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  workers: 3,
  timeout: 60000, 
  testDir: './tests', 
  testMatch: '**/*.js', 
  use: {
    browserName: 'chromium', 
    headless: false, 
    viewport: { width: 1280, height: 720 }, 
    actionTimeout: 10000, 
    navigationTimeout: 30000, 
  },
});
