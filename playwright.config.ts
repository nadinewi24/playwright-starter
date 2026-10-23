import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
/**
 * Zentrale Konfiguration: Hier steht EINMAL, wo und wie getestet wird.
 * Bei der HYPO wäre baseURL die Appian-Testumgebung.
 */
export default defineConfig({
  testDir: './tests',

  // Tests laufen parallel -> schneller
  fullyParallel: true,

  // In der Pipeline (CI) 2 Wiederholungen bei Fehlschlag, lokal keine
  retries: process.env.CI ? 2 : 0,

  // Verhindert, dass ein vergessenes test.only in der Pipeline landet
  forbidOnly: !!process.env.CI,

  // Berichte: Liste in der Konsole + HTML-Report (npx playwright show-report)
reporter: [
  ['list'],
  ['html', { open: 'never' }],
  ['./reporters/discord-reporter.ts'],
],

  use: {
    // Basisadresse: Tests schreiben nur noch page.goto('/inventory.html')
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',

    // Diese Seite nutzt data-test="..." als Test-IDs -> getByTestId('...')
    testIdAttribute: 'data-test',

    // Nachweise bei Fehlern: Trace (Zeitreise), Screenshot, Video
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // 1) Setup: einmal einloggen und Session speichern
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    // 2) Eigentliche UI-Tests, starten bereits eingeloggt
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: /api\//,
    },

    // 3) API-Tests, ohne Browser
    { name: 'api', testMatch: /api\/.*\.spec\.ts/ },
  ],
});
