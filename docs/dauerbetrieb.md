# SpaceStays Dauerbetrieb

Diese Version laeuft weiter auf GitHub Pages, kann aber mit Supabase verbunden werden. Ohne Supabase nutzt sie den lokalen Browser-Speicher.

## Zielbild

1. GitHub hostet den Code und GitHub Pages zeigt die App.
2. Supabase speichert Leads, Apartments, Mailvorlagen und spaeter Mail-Queue.
3. Login laeuft per Supabase Magic Link an `info@spacestays.de`.
4. Gmail-Automation wird als naechster Schritt ueber Backend/Edge Function angebunden, nicht direkt im Browser.

## Supabase einrichten

1. Neues Projekt in Supabase erstellen.
2. SQL Editor oeffnen.
3. Inhalt aus `supabase/schema.sql` ausfuehren.
4. In Supabase unter Authentication die Site URL setzen:
   `https://spacestays1-beep.github.io/spacestays-cockpit/`
5. Als Redirect URL ebenfalls erlauben:
   `https://spacestays1-beep.github.io/spacestays-cockpit/`
6. In Supabase Project Settings > API kopieren:
   - Project URL
   - anon public key
7. In der SpaceStays-App den Bereich `System` oeffnen und beide Werte speichern.
8. Magic-Link an `info@spacestays.de` senden und einloggen.
9. `Lokale Daten in Supabase speichern` klicken.

## Gmail-Automation spaeter

Browser-Apps sollten keine Gmail-Geheimnisse enthalten. Fuer echte Automation brauchen wir eine Backend-Schicht:

- Supabase Edge Function oder Vercel Serverless Function
- Gmail OAuth fuer `info@spacestays.de`
- Mail-Queue mit Status `draft`, `approved`, `sent`, `replied`, `bounced`
- taeglicher Job fuer Follow-ups und Antwort-Sync

Bis dahin bleibt der sichere Workflow:

1. Leads im Cockpit pflegen.
2. Mailvorlage kopieren oder Entwurf vorbereiten.
3. Versand manuell pruefen.
4. Status und Follow-up im Cockpit setzen.
