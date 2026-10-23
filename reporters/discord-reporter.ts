import type { FullConfig, FullResult, Reporter, Suite, TestCase } from '@playwright/test/reporter';

/**
 * Eigener Reporter: schickt am Ende jedes Laufs eine Zusammenfassung an Discord.
 * Die Webhook-URL kommt aus der Umgebungsvariable DISCORD_WEBHOOK_URL
 * (lokal aus der .env, in der Pipeline aus einem Secret).
 */
class DiscordReporter implements Reporter {
  private rootSuite!: Suite;
  private startTime = Date.now();

  // Wird einmal am Anfang aufgerufen: Wir merken uns alle Tests.
  onBegin(config: FullConfig, suite: Suite) {
    this.rootSuite = suite;
    this.startTime = Date.now();
  }

  // Wird einmal am Ende aufgerufen: Ergebnisse zählen und Nachricht schicken.
  async onEnd(result: FullResult) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      console.log('[discord] Keine DISCORD_WEBHOOK_URL gesetzt, keine Nachricht gesendet.');
      return;
    }

    const tests = this.rootSuite.allTests();
    const passed = tests.filter((t) => t.outcome() === 'expected');
    const failed = tests.filter((t) => t.outcome() === 'unexpected');
    const flaky = tests.filter((t) => t.outcome() === 'flaky');
    const skipped = tests.filter((t) => t.outcome() === 'skipped');

    const seconds = Math.round((Date.now() - this.startTime) / 1000);
    const ok = result.status === 'passed';
    const where = process.env.CI ? 'Pipeline' : 'lokal';

    const lines = [
      `✅ ${passed.length} bestanden   ❌ ${failed.length} fehlgeschlagen   ⚠️ ${flaky.length} flaky   ⏭️ ${skipped.length} übersprungen`,
      `⏱️ Dauer: ${seconds} s   📍 ${where}`,
    ];
    if (failed.length > 0) {
      lines.push('', '**Fehlgeschlagen:**', ...failed.map((t: TestCase) => `• ${t.title}`));
    }

    const body = {
      username: 'Playwright',
      embeds: [
        {
          title: ok ? '🟢 Alle Tests grün' : '🔴 Tests fehlgeschlagen',
          description: lines.join('\n').slice(0, 4000), // Discord-Limit
          color: ok ? 0x2ecc71 : 0xe74c3c,
        },
      ],
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        console.log(`[discord] Senden fehlgeschlagen: HTTP ${response.status}`);
      }
    } catch (error) {
      // Ein Fehler beim Senden soll den Testlauf nicht kaputt machen.
      console.log(`[discord] Senden fehlgeschlagen: ${error}`);
    }
  }
}

export default DiscordReporter;