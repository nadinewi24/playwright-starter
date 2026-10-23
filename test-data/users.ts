/**
 * Testdaten an EINER Stelle. Bei einer Bank: nur künstliche oder
 * anonymisierte Testkunden, niemals echte Kundendaten.
 * Passwörter kämen in echt aus Umgebungsvariablen bzw. einem Secret-Store.
 */
export const users = {
  standard: { username: 'standard_user', password: process.env.TEST_PASSWORD ?? 'secret_sauce' },
  locked:   { username: 'locked_out_user', password: process.env.TEST_PASSWORD ?? 'secret_sauce' },
  invalid:  { username: 'gibt_es_nicht', password: 'falsch' },
};

export const checkoutData = {
  firstName: 'Max',
  lastName: 'Muster',
  postalCode: '1040',
};
