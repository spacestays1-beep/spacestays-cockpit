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

Die erste Version speichert Daten lokal im Browser. Eine echte Datenbank, Gmail-Anbindung und GitHub-Deployment sind die naechsten Ausbaustufen.
