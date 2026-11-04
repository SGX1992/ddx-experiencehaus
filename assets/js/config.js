/* Deployment knobs. SUBMIT_ENDPOINT empty = preview build: the page says so in
   a bar at the top and a submit is played back locally without leaving the
   browser. Live, it posts to the shared DDX side-event inbox.

   Live since 2026-11-02 on experiencehaus.ddxconference.com (CNAME ->
   sgx1992.github.io, DNS only). Two of the three switches are thrown:
     1. this endpoint
     2. the host in DEFAULT_ORIGINS in ddx-side-sandiego/netlify/functions/
        submit.mjs, which the inbox checks against the browser's Origin header
     3. STILL OPEN: the `notion` block on `london-experiencehaus` in
        ddx-side-sandiego/assets/js/events-london.js, which needs an Experience
        Haus list with the DDX Website integration enabled on it
   Without 3 nothing is lost — isDirect() is false, so an RSVP waits in the
   Netlify inbox for the bridge instead of landing in Notion instantly. */
/* Scharf seit 2026-11-04. Der Host steht in DEFAULT_ORIGINS der Inbox und
   das Backend ist deployt, CORS geprueft. Experience Haus hat weiterhin
   keine Notion-Liste, deshalb ist isDirect() false und eine Anmeldung
   wartet in der Netlify-Inbox auf die Bridge statt sofort in Notion zu
   landen. Nichts geht verloren, es ist nur nicht augenblicklich. */
export const SUBMIT_ENDPOINT = 'https://ddx-side-events.netlify.app/api/submit';
export const EVENT_ID = 'london-experiencehaus';
export const SITE_URL = 'https://experiencehaus.ddxconference.com/';
