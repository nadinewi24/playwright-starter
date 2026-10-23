# Playwright-Starter – Übungsprojekt

Ziel: ein Playwright-Testframework so aufsetzen, wie du es bei der HYPO für die
Appian-Anwendungen machen würdest. Geübt wird an zwei öffentlichen Übungsseiten:

- **UI:** https://www.saucedemo.com (Demo-Webshop)
- **API:** https://restful-booker.herokuapp.com (Demo-Buchungs-API)

---

## 1. Loslegen

Voraussetzung: Node.js (Version 20 oder neuer) und VS Code mit der Erweiterung
„Playwright Test for VSCode“.

```bash
npm install                 # Abhängigkeiten installieren
npx playwright install      # Browser installieren (einmalig)
npx playwright test         # alle Tests ausführen
npx playwright show-report  # HTML-Report öffnen
```

Weitere Befehle:

| Befehl | Zweck |
|---|---|
| `npm run test:ui` | grafischer Modus: Tests einzeln starten, Schritte ansehen |
| `npm run test:headed` | Browser sichtbar mitlaufen lassen |
| `npm run test:api` | nur die API-Tests |
| `npm run codegen` | Klicks aufzeichnen → erster Code-Entwurf |

> Wenn du ganz von vorne üben willst: In einem leeren Ordner
> `npm init playwright@latest` ausführen (TypeScript, Ordner `tests`,
> GitHub Actions: ja). Dann dieses Projekt als Vorlage daneben legen.

---

## 2. Aufbau – was jede Datei macht

```
playwright-starter/
├── playwright.config.ts     ← zentrale Einstellungen
├── tests/
│   ├── auth.setup.ts        ← einmal einloggen, Session speichern
│   ├── login.spec.ts        ← Login: positiv + negativ
│   ├── checkout.spec.ts     ← End-to-End-Ablauf
│   └── api/booking.spec.ts  ← API-Tests ohne Browser
├── pages/                   ← Page Objects (eine Klasse pro Seite)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   └── CheckoutPage.ts
├── test-data/users.ts       ← Testdaten an einer Stelle
└── .github/workflows/playwright.yml  ← Pipeline
```

### playwright.config.ts
- **baseURL**: Adresse der Testumgebung. Tests schreiben nur `page.goto('/inventory.html')`.
  Umgebung wechseln ohne Code-Änderung: `BASE_URL=https://... npx playwright test`.
- **testIdAttribute**: diese Seite nutzt `data-test="..."` → `getByTestId('...')`.
- **retries**: in der Pipeline 2 Wiederholungen, lokal 0 (so fallen flaky Tests auf).
- **trace / screenshot / video**: Nachweise nur bei Fehlern → Trace Viewer zur Analyse.
- **projects**: `setup` (Login) → `chromium` (UI-Tests, starten eingeloggt) und `api`.

### tests/auth.setup.ts
Loggt sich **einmal** ein und speichert die Session in `.auth/user.json`.
Alle UI-Tests starten damit bereits eingeloggt → schneller und stabiler.

### pages/*.ts – Page Object Model
Jede Seite hat eine Klasse mit ihren Elementen (Locatoren) und Aktionen.
Ändert sich die Oberfläche, passt man **nur die Page-Klasse** an, nicht 30 Tests.

### tests/*.spec.ts
- Aufbau jedes Tests: **Arrange** (Ausgangslage) → **Act** (Aktion) → **Assert** (Prüfung).
- Positiv- **und** Negativtests (gesperrter User, falsche Daten, Pflichtfelder).
- Login-Tests nutzen bewusst eine leere Session: `test.use({ storageState: ... })`.

### tests/api/booking.spec.ts
API-Tests mit `request`: anlegen (POST), abrufen (GET), Fehlerfall (404).
Gleiches Tool, keine Klicks, sehr schnell.

### test-data/users.ts
Testdaten zentral. Passwörter in echt **nie im Code**, sondern über
Umgebungsvariablen bzw. Pipeline-Secrets (`TEST_PASSWORD`).

### .github/workflows/playwright.yml
Pipeline: bei jedem Push/Pull Request → `npm ci` → Tests → Report als Artefakt.

---

## 3. Lernplan bis zum Start (ca. 1–2 h pro Tag)

| Tage | Aufgabe |
|---|---|
| 1–2 | Projekt zum Laufen bringen, Config Zeile für Zeile verstehen, Report + Trace Viewer öffnen |
| 3–4 | Selbst 3 neue Tests schreiben (z. B. Produkt aus dem Warenkorb entfernen, Sortierung prüfen) |
| 5–6 | Neue Page Object `CartPage.ts` anlegen und die Tests darauf umbauen |
| 7–8 | API: Buchung ändern (PUT, mit Token aus `/auth`) und löschen (DELETE) testen |
| 9–10 | Eigenes GitHub-Repo anlegen, pushen, Pipeline grün bekommen |
| 11–12 | Appian Community Edition: kleine App bauen, mit `getByLabel` testen |

**Übung zum Fehler-Finden:** `problem_user` statt `standard_user` in `test-data/users.ts`
eintragen → einige Tests werden rot → mit Trace Viewer die Ursache finden.

---

## 4. Übertragung auf die HYPO (Appian)

| Hier im Projekt | Bei der HYPO |
|---|---|
| `baseURL` = saucedemo | Appian-Testumgebung |
| `getByTestId` (data-test) | `getByLabel` / `getByRole`, da Appian IDs generiert |
| `auth.setup.ts` | Login mit Test-User (Passwort aus Secret) |
| restful-booker-API | Appian-Web-APIs, Schnittstellen zum Kernbankensystem |
| GitHub Actions | Pipeline der Appian-Entwickler (z. B. Azure DevOps/GitLab) |
| HTML-Report als Artefakt | Nachweis an Test Execution in Xray anhängen |

**Pipeline mit den Appian-Entwickler:innen:** Sie kümmern sich um Build und
Deployment. Dein Teil ist der **Test-Schritt** danach: „Nach dem Deployment auf
die Testumgebung läuft `npx playwright test`; ist ein Test rot, stoppt das Release.“
Fragen für den Start: Wo läuft die Pipeline? Wie werden Appian-Pakete deployed?
Gibt es einen Runner mit Node.js bzw. Docker? Wo werden Secrets gespeichert?
