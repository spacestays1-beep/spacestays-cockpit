# SpaceStays Cockpit

Lokales Arbeits-Cockpit fuer SpaceStays Monteurvermietung.

## Enthalten

- Dashboard fuer Leads, Follow-ups und Kapazitaeten
- Lead-CRM mit Score, Statuswechsel, Suche und CSV-Export
- Apartment-Uebersicht fuer NRW-Standorte
- Mailvorlagen fuer DE, EN, PL und RO
- Angebotsgenerator fuer Monteur-Anfragen

## Lokal starten

```bash
python3 -m http.server 4173
```

Dann im Browser oeffnen:

```text
http://127.0.0.1:4173/index.html
```

Die App laeuft auf GitHub Pages und kann lokal im Browser speichern. Fuer Dauerbetrieb kann Supabase verbunden werden.

## Dauerbetrieb

Siehe:

- `docs/dauerbetrieb.md`
- `supabase/schema.sql`

Kurzfassung:

1. Supabase-Projekt erstellen.
2. `supabase/schema.sql` im SQL Editor ausfuehren.
3. Project URL und anon public key im Bereich `System` der App eintragen.
4. Per Magic Link mit `info@spacestays.de` einloggen.
5. Lokale Startdaten in Supabase speichern.
