# Briefing: Subdomain für die Experience-Haus-Workshop-Seite

**Für:** den Agenten, der das Domain-/DNS-Thema umsetzt
**Von:** Claude (Session „DDX London / Experience Haus"), 01.11.2026
**Scope:** genau ein DNS-Record. Kein Code, kein Deploy, keine anderen Records.

---

## 1. Was gebraucht wird

Eine Subdomain unter `ddxconference.com`, die auf GitHub Pages zeigt — genau so,
wie die drei bestehenden Partnerseiten der DDX London (huge, fable, dscout).

**Empfohlener Hostname:** `experiencehaus.ddxconference.com`

Begründung: die Konvention ist „Partnername als Subdomain". `huge`, `fable` und
`dscout` heißen so. Die gebaute Seite ist bereits auf diesen Namen vorbereitet
(Platzhalter in `CNAME`, `og:url`, `og:image`, `SITE_URL`). Ein anderer Name ist
möglich, kostet aber vier Code-Änderungen — dann **bitte vorher melden**, nicht
einfach einen anderen Namen eintragen.

Der Name ist aktuell frei:

```bash
dig +short experiencehaus.ddxconference.com
```

→ leere Ausgabe = frei.

---

## 2. Wo die Zone liegt

Das ist der Punkt, an dem frühere Versuche schiefgegangen sind — **nicht raten,
die Fakten sind geprüft (01.11.2026):**

| | |
|---|---|
| Registrar | **GoDaddy** (nur Registrar — hier liegen die Records **nicht**) |
| Autoritative Nameserver | `conrad.ns.cloudflare.com`, `fish.ns.cloudflare.com` |
| DNS-Zone | **Cloudflare**, Account `158c3f36b720435ede948dd751b729d2` |
| Squarespace | **raus.** Die Zone lag früher dort, ist vollständig migriert. |

Also: **Record in Cloudflare anlegen, nicht bei GoDaddy, nicht in Squarespace.**

---

## 3. Der Record

| Feld | Wert |
|---|---|
| Typ | `CNAME` |
| Name | `experiencehaus` |
| Ziel | `sgx1992.github.io` |
| Proxy | **DNS only** (graue Wolke) |
| TTL | Auto |

Das ist identisch zu den drei Nachbarn. Zur Kontrolle, wie ein korrekter
Eintrag aussieht:

```bash
dig @conrad.ns.cloudflare.com +short huge.ddxconference.com CNAME
```

→ `sgx1992.github.io.`

---

## 4. Die drei Fallen

1. **„Proxy" muss aus sein.** Cloudflares Proxy (orange Wolke) verhindert, dass
   GitHub Pages ein Let's-Encrypt-Zertifikat ausstellen kann — die Seite wirft
   dann eine Zertifikatswarnung. Bei dieser Zone ist die Checkbox
   *„Proxy imported DNS records"* schon einmal von selbst wieder angegangen:
   nach dem Speichern **nochmal nachsehen**, dass der Eintrag auf *DNS only*
   steht.
2. **Kein A-Record.** Nicht auf `185.199.108.153` o. ä. zeigen. CNAME auf
   `sgx1992.github.io`, fertig — dann folgt die Seite automatisch, wenn GitHub
   seine IPs ändert.
3. **Nameserver nicht anfassen.** In dieser Zone hängen rund 15 Subdomains
   (die Konferenzseite selbst, Agenden, Recaps, alle Partnerseiten). Ein
   Nameserver-Wechsel nimmt sie alle offline.

---

## 5. Reihenfolge

Sauberer Weg — der Record darf aber auch zuerst gesetzt werden:

1. **Agent:** Hostname bestätigen (oder abweichenden Vorschlag melden).
2. **Claude:** GitHub-Repo `SGX1992/ddx-experiencehaus` anlegen und Pages mit
   der `CNAME`-Datei deployen (`./deploy-pages.sh`, ~1 Minute).
3. **Agent:** den CNAME-Record in Cloudflare setzen.
4. **Claude:** HTTPS erzwingen (macht das Deploy-Script selbst, sobald das
   Zertifikat da ist) und die drei Code-Stellen scharf schalten.

Wird Schritt 3 vor Schritt 2 gemacht, ist das kein Schaden: der Host antwortet
dann für ein paar Minuten mit GitHubs 404. Die URL hat noch niemand, es sieht
also keiner.

---

## 6. Verifikation — was „fertig" heißt

```bash
dig +short experiencehaus.ddxconference.com CNAME
```

→ `sgx1992.github.io.`

```bash
dig +short experiencehaus.ddxconference.com A
```

→ drei oder vier Adressen aus `185.199.108-111.153`
(sind es `104.x` oder `172.67.x`, läuft der Proxy noch — siehe Falle 1).

DNS-Propagation gegen einen öffentlichen Resolver prüfen, nicht gegen den
lokalen Cache:

```bash
dig @1.1.1.1 +short experiencehaus.ddxconference.com
```

---

## 7. Nicht anfassen

- Keine anderen Records in der Zone ändern oder löschen — insbesondere nicht
  den Apex (`75.2.60.5`, Netlify) und nicht `www` (→ `ddx-relaunch.netlify.app`).
  Dort hängt die Hauptseite dran.
- Keine Nameserver-Änderung, kein Zonen-Export/Import.
- Nichts bei GoDaddy ändern.
- Keine Dateien in diesem Projekt bearbeiten. Die vier Stellen mit dem
  Hostnamen (`assets/js/config.js`, `index.html` ×2, `deploy-pages.sh`) und
  die CORS-Allowlist im Inbox-Backend macht Claude, nicht der Agent —
  sie hängen aneinander und ein halber Satz davon bricht das RSVP-Formular.

---

## 8. Rückmeldung

Kurz, diese vier Punkte:

1. Gesetzter Hostname.
2. Record angelegt: ja/nein, Proxy-Status.
3. Ausgabe von `dig +short <host> CNAME` und `dig +short <host> A`.
4. Alles, was unterwegs anders war als hier beschrieben.

Danach macht Claude die Code-Seite und das Deploy.

---

## Anhang: Kontext in einem Absatz

`experiencehaus.ddxconference.com` soll eine Anmeldeseite für den
Experience-Haus-Workshop **„Think Before You Build"** werden — Freitag,
20. November 2026, 9:30–10:30 im Museum of the Home, dem Veranstaltungsort der
DDX London, mit Brunch danach. 40 Plätze. Die Seite ist gebaut und lokal
getestet; sie liegt in `ddx-experiencehaus/` und ist `noindex`. Sie läuft bis
zur Freischaltung als Preview-Build: das Formular funktioniert, speichert aber
noch nichts, weil das RSVP-Backend die Herkunfts-Domain prüft und die eben noch
nicht existiert. Deshalb dieses Briefing.
