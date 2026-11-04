import { SUBMIT_ENDPOINT, EVENT_ID } from './config.js?v=20261104142019';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- the event ----------
   The Experience Haus workshop that opens DDX London, in the conference venue.
   Sebastian gave the workshop hour as 9:30–10:30; the 9:00 arrival and the
   11:00 finish come from Experience Haus' own "two hours, start to finish"
   with a 30 / 60 / 30 split. The calendar file blocks the whole two hours, so
   a guest who adds it keeps the brunch free too. */
const EVENT = {
  id: EVENT_ID,
  title: 'Think Before You Build',
  by: 'DDX × Experience Haus',
  start: '2026-11-20T09:00:00',
  end: '2026-11-20T11:00:00',
  venue: 'Museum of the Home',
  address: 'Museum of the Home, 136 Kingsland Road, London E2 8EA',
  lede: 'A workshop by Experience Haus at DDX London for forty leaders in brand, innovation and design: the critical thinking every AI product needs before it gets built. Doors 9:00, workshop 9:30-10:30, brunch to follow.',
};

function ics(e) {
  const stamp = (s) => s.replace(/[-:]/g, '');
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//DDX//Experience Haus London workshop//EN', 'BEGIN:VEVENT',
    `UID:${e.id}-2026@ddxconference.com`,
    `DTSTART;TZID=Europe/London:${stamp(e.start)}`,
    `DTEND;TZID=Europe/London:${stamp(e.end)}`,
    `SUMMARY:${e.title} · ${e.by}`,
    `LOCATION:${e.address}`,
    `DESCRIPTION:${e.lede}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
}
const calHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics(EVENT))}`;
$('#heroCal').href = calHref;
$('#doneCal').href = calHref;

/* ---------- the DDX logo wall ----------
   The same 22 marks and 28 names as the other London partner pages; a guest
   invited to two of them should see one room, not two different ones. */
const BRANDS = [
  {cls:"", file:"google", alt:"Google", w:308, h:112},
  {cls:"", file:"adobe", alt:"Adobe", w:357, h:112},
  {cls:"is-tall", file:"apple", alt:"Apple", w:65, h:79},
  {cls:"", file:"amazon", alt:"Amazon", w:332, h:112},
  {cls:"", file:"nvidia", alt:"NVIDIA", w:504, h:112},
  {cls:"is-tall", file:"salesforce", alt:"Salesforce", w:133, h:96},
  {cls:"", file:"siemens", alt:"Siemens", w:544, h:112},
  {cls:"is-tall", file:"volkswagen", alt:"Volkswagen", w:96, h:96},
  {cls:"", file:"visa", alt:"VISA", w:308, h:112},
  {cls:"", file:"deloitte", alt:"Deloitte", w:507, h:112},
  {cls:"", file:"forbes", alt:"Forbes", w:384, h:112},
  {cls:"", file:"allianz", alt:"Allianz", w:385, h:112},
  {cls:"is-tall", file:"intel", alt:"Intel", w:142, h:96},
  {cls:"is-tall", file:"cisco", alt:"Cisco", w:172, h:95},
  {cls:"is-tall", file:"hp", alt:"HP", w:97, h:96},
  {cls:"is-tall", file:"ea", alt:"EA", w:94, h:95},
  {cls:"", file:"zalando", alt:"Zalando", w:479, h:112},
  {cls:"", file:"us-bank", alt:"U.S. Bank", w:359, h:112},
  {cls:"is-faint", file:"walt-disney", alt:"Walt Disney", w:364, h:112},
  {cls:"is-faint", file:"american-airlines", alt:"American Airlines", w:275, h:112},
  {cls:"is-faint", file:"shopify", alt:"Shopify", w:360, h:112},
  {cls:"is-tall is-faint", file:"publicis-sapient", alt:"Publicis Sapient", w:207, h:96}
];
const MORE = ['Microsoft', 'Meta', 'AWS', 'IBM', 'Sony', 'Qualcomm', 'Oracle', 'ServiceNow', 'Workday', 'HubSpot', 'Webflow', 'Pinterest', 'The New York Times', 'Nordstrom', 'State Farm', 'Allstate', 'Nationwide', 'PwC', 'Schneider Electric', 'Stryker', 'Genentech', 'Dexcom', 'ResMed', 'United Airlines', 'Zoom', 'Thoughtworks', 'LINE', 'Medium'];
$('#wall').innerHTML = BRANDS.map((b) =>
  `<li${b.cls ? ` class="${b.cls}"` : ''}><img src="assets/img/brands/${b.file}.png" alt="${b.alt}" width="${b.w}" height="${b.h}" loading="lazy"></li>`).join('');
$('#moreList').innerHTML = MORE.map((n) => `<li>${n}</li>`).join('');

/* ---------- scroll reveals ---------- */
const revealables = [
  ...$$('.split__lead, .split__body'),
  ...$$('#morning .section__head, .steps li, .band'),
  ...$$('#venue .room__in > *'),
  ...$$('#brands .section__head, .wall, .more'),
  ...$$('#rsvp .section__head, .signup'),
];
revealables.forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--d', `${(i % 4) * 70}ms`); });
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
revealables.forEach((el) => io.observe(el));

/* ---------- the form ---------- */
const form = $('#signup'), submitBtn = $('#submitBtn'), submitLabel = $('#submitLabel');
const barBtn = $('#barBtn'), status = $('#status'), bar = $('#bar');

function readiness() {
  const ok = form.checkValidity();
  submitBtn.classList.toggle('attention', ok);
  barBtn.classList.toggle('attention', ok);
}
form.addEventListener('input', readiness);
barBtn.addEventListener('click', () => {
  if (!form.checkValidity()) {
    $('#rsvp').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => form.reportValidity(), 500);
    return;
  }
  form.requestSubmit();
});

const payload = () => {
  const f = new FormData(form);
  return {
    events: [EVENT.id],
    name: f.get('name').trim(), email: f.get('email').trim(),
    role: f.get('role').trim(), company: f.get('company').trim(),
    country: '', phone: '', ticket: false,
    notes: (f.get('dietary') || '').trim(),
    submittedAt: new Date().toISOString(), page: location.href,
  };
};

async function send(data) {
  if (!SUBMIT_ENDPOINT) { await new Promise((r) => setTimeout(r, 900)); return { ok: true, preview: true }; }
  const res = await fetch(SUBMIT_ENDPOINT, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `The server answered ${res.status}.`);
  return body;
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  if (!form.reportValidity()) return;
  const data = payload();
  [submitBtn, barBtn].forEach((b) => { b.disabled = true; b.classList.add('is-busy'); b.classList.remove('attention'); });
  submitLabel.textContent = 'Saving…'; barBtn.textContent = 'Saving…';
  status.hidden = true;
  try { done(data, await send(data)); }
  catch (err) {
    status.hidden = false;
    status.textContent = `Couldn’t save that — ${err.message} Your answers are still here; try again in a moment.`;
    [submitBtn, barBtn].forEach((b) => { b.disabled = false; b.classList.remove('is-busy'); });
    submitLabel.textContent = 'Claim your seat'; barBtn.textContent = 'Claim your seat';
    readiness();
  }
});

function done(data, r) {
  $('#doneName').textContent = data.name.split(' ')[0] || 'you';
  $('#doneMail').textContent = data.email;
  $('#donePreview').hidden = !r.preview;
  $('#formWrap').hidden = true;
  bar.hidden = true;
  document.body.classList.remove('has-bar');
  const d = $('#done'); d.hidden = false;
  d.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

if (!SUBMIT_ENDPOINT) $('#previewBar').hidden = false;
document.body.classList.add('has-bar');
const hero = $('.hero__img');
Promise.all([document.fonts.ready, hero.complete ? Promise.resolve() : new Promise((r) => { hero.onload = r; hero.onerror = r; })])
  .then(() => document.body.classList.add('ready'));
