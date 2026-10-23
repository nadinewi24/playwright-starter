import { test, expect } from '@playwright/test';

/**
 * API-Tests: ohne Browser, direkt gegen die Schnittstelle.
 * Übungs-API: restful-booker (öffentliche Test-API).
 * Bei der HYPO: Appian-Web-APIs bzw. Schnittstellen zum Kernbankensystem.
 */
const API = 'https://restful-booker.herokuapp.com';

test.describe('Buchungs-API', () => {
  test('Buchung anlegen und wieder abrufen', async ({ request }) => {
    // 1) Anlegen (POST)
    const create = await request.post(`${API}/booking`, {
      data: {
        firstname: 'Max',
        lastname: 'Muster',
        totalprice: 150,
        depositpaid: true,
        bookingdates: { checkin: '2026-11-09', checkout: '2026-11-12' },
      },
    });
    expect(create.status()).toBe(200);
    const { bookingid, booking } = await create.json();
    expect(booking.lastname).toBe('Muster');

    // 2) Abrufen (GET) und prüfen, ob die Daten stimmen
    const get = await request.get(`${API}/booking/${bookingid}`);
    expect(get.ok()).toBeTruthy();
    expect((await get.json()).totalprice).toBe(150);
  });

  test('nicht existierende Buchung liefert 404', async ({ request }) => {
    const res = await request.get(`${API}/booking/999999999`);
    expect(res.status()).toBe(404);
  });
});
