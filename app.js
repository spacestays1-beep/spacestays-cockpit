const storageKey = "spacestays-cockpit-v1";
const configKey = "spacestays-cockpit-config-v1";

const seed = {
  leads: [
    {
      id: "L-0001",
      company: "Beispiel Bau GmbH",
      country: "Deutschland",
      region: "Ruhrgebiet",
      industry: "Tiefbau",
      email: "info@beispiel-bau.de",
      phone: "+49 231 000000",
      contact: "Dispo / Projektleitung",
      source: "Website Impressum",
      signal: "Stellenanzeige: Monteure bundesweit",
      status: "Neu",
      followUp: todayOffset(0),
      language: "DE",
      teamSize: 6,
      targetRegion: "Ruhrgebiet",
      notes: "Demo ersetzen",
    },
    {
      id: "L-0002",
      company: "Example Industrial Services",
      country: "Polen",
      region: "Wroclaw",
      industry: "Anlagenbau",
      email: "office@example.com",
      phone: "",
      contact: "Operations",
      source: "Google Maps",
      signal: "Projektteams in Deutschland",
      status: "Kontaktiert",
      followUp: todayOffset(2),
      language: "EN",
      teamSize: 10,
      targetRegion: "Beides",
      notes: "Englisch anschreiben",
    },
    {
      id: "L-0003",
      company: "Rhein Elektro Muster AG",
      country: "Deutschland",
      region: "Köln",
      industry: "Elektro / Industrie",
      email: "dispo@muster-elektro.de",
      phone: "",
      contact: "",
      source: "LinkedIn Unternehmensseite",
      signal: "Offene Monteurstellen",
      status: "Interessiert",
      followUp: todayOffset(1),
      language: "DE",
      teamSize: 4,
      targetRegion: "Rheinland",
      notes: "Angebot vorbereiten",
    },
  ],
  apartments: [
    { id: "A-001", name: "SpaceStays Gelsenkirchen", city: "Gelsenkirchen", region: "Ruhrgebiet", beds: 6, bedrooms: 3, parking: "PKW", status: "frei prüfen" },
    { id: "A-002", name: "SpaceStays Essen Nord", city: "Essen", region: "Ruhrgebiet", beds: 5, bedrooms: 2, parking: "Transporter nah", status: "frei prüfen" },
    { id: "A-003", name: "SpaceStays Mülheim", city: "Mülheim", region: "Ruhrgebiet", beds: 4, bedrooms: 2, parking: "Straße", status: "frei prüfen" },
    { id: "A-004", name: "SpaceStays Recklinghausen", city: "Recklinghausen", region: "Ruhrgebiet", beds: 6, bedrooms: 3, parking: "PKW", status: "frei prüfen" },
    { id: "A-005", name: "SpaceStays Grevenbroich", city: "Grevenbroich", region: "Rheinland", beds: 5, bedrooms: 2, parking: "PKW", status: "frei prüfen" },
  ],
  templates: {
    DE: {
      subject: "Monteurapartments im Ruhrgebiet / Rheinland",
      body:
        "Guten Tag,\n\nwir sind SpaceStays und stellen möblierte Apartments für Monteure und Projektteams im Ruhrgebiet und Rheinland bereit: Essen, Gelsenkirchen, Mülheim, Recklinghausen und Grevenbroich.\n\nFalls Sie regelmäßig Teams in NRW unterbringen müssen, können wir kurzfristig und flexibel Kapazitäten anbieten. Gerne sende ich Ihnen eine kurze Übersicht mit Standorten, Belegung und Konditionen.\n\nBeste Grüße\n[Name]\n[Telefon]\n\nPS: Falls Sie dazu nicht der richtige Kontakt sind, freue ich mich über eine kurze Weiterleitung an Dispo, Projektleitung oder Einkauf.",
    },
    EN: {
      subject: "Furnished worker apartments in NRW, Germany",
      body:
        "Hello,\n\nwe are SpaceStays and provide furnished apartments for construction workers and project teams in NRW, Germany: Essen, Gelsenkirchen, Mülheim, Recklinghausen and Grevenbroich.\n\nIf your teams regularly need accommodation near projects in this region, we can offer flexible short- and mid-term capacity. I can send a compact overview with locations, availability and pricing.\n\nBest regards\n[Name]\n[Phone]",
    },
    PL: {
      subject: "Mieszkania dla ekip montażowych w NRW",
      body:
        "Dzień dobry,\n\nJesteśmy SpaceStays i oferujemy umeblowane apartamenty dla pracowników oraz ekip montażowych w NRW: Essen, Gelsenkirchen, Mülheim, Recklinghausen oraz Grevenbroich.\n\nJeśli Państwa zespoły regularnie pracują przy projektach w Niemczech, możemy zaoferować elastyczne zakwaterowanie krótko- i średnioterminowe.\n\nPozdrawiam\n[Name]\n[Telefon]",
    },
    RO: {
      subject: "Apartamente pentru echipe de muncitori în NRW",
      body:
        "Bună ziua,\n\nSuntem SpaceStays și oferim apartamente mobilate pentru muncitori și echipe de proiect în NRW: Essen, Gelsenkirchen, Mülheim, Recklinghausen și Grevenbroich.\n\nDacă echipele dvs. au nevoie de cazare în Germania, vă pot trimite o prezentare scurtă cu locații, disponibilitate și prețuri.\n\nCu stimă\n[Name]\n[Telefon]",
    },
  },
};

const searchIdeas = [
  ["Bauunternehmen", "Bauunternehmen Monteure bundesweit, construction company workers Germany"],
  ["Elektro / Industrie", "Elektromontage Industrie Monteure, industrial electrical contractors Germany"],
  ["Anlagenbau", "Anlagenbau Montage Team Deutschland, plant engineering installation crew Germany"],
  ["Rohrleitungsbau", "Rohrleitungsbau Monteure Unterkunft, pipeline installation crew accommodation"],
  ["PV / Solar", "PV Montage Team Nordrhein-Westfalen, solar installation crews Germany"],
  ["Personaldienstleister", "Zeitarbeit Bau Monteure Unterkunft, staffing construction workers accommodation"],
];

let state = loadState();
let config = loadConfig();
let supabaseClient = null;
let currentSession = null;
let remoteSaveTimer = null;

const views = {
  dashboard: document.querySelector("#dashboardView"),
  leads: document.querySelector("#leadsView"),
  apartments: document.querySelector("#apartmentsView"),
  campaigns: document.querySelector("#campaignsView"),
  offer: document.querySelector("#offerView"),
  system: document.querySelector("#systemView"),
};

const titles = {
  dashboard: "Dashboard",
  leads: "Leads",
  apartments: "Apartments",
  campaigns: "Kampagnen",
  offer: "Angebot",
  system: "System",
};

bindEvents();
initApp();

function bindEvents() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });

  document.querySelectorAll("[data-view-jump]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.viewJump));
  });

  document.querySelector("#leadSearch").addEventListener("input", renderLeads);
  document.querySelector("#statusFilter").addEventListener("change", renderLeads);
  document.querySelector("#priorityFilter").addEventListener("change", renderLeads);
  document.querySelector("#addLeadBtn").addEventListener("click", () => document.querySelector("#leadDialog").showModal());
  document.querySelector("#leadForm").addEventListener("submit", addLead);
  document.querySelector("#exportCsvBtn").addEventListener("click", exportCsv);
  document.querySelector("#templateLanguage").addEventListener("change", renderTemplate);
  document.querySelector("#templateSubject").addEventListener("input", saveTemplate);
  document.querySelector("#templateBody").addEventListener("input", saveTemplate);
  document.querySelector("#copyTemplateBtn").addEventListener("click", () => copyText(document.querySelector("#templateBody").value));
  document.querySelector("#copyOfferBtn").addEventListener("click", () => copyText(document.querySelector("#offerText").textContent));
  document.querySelector("#addApartmentBtn").addEventListener("click", addApartment);
  document.querySelector("#saveSupabaseBtn").addEventListener("click", saveSupabaseConfig);
  document.querySelector("#clearSupabaseBtn").addEventListener("click", clearSupabaseConfig);
  document.querySelector("#sendLoginBtn").addEventListener("click", sendMagicLink);
  document.querySelector("#signOutBtn").addEventListener("click", signOut);
  document.querySelector("#pushToSupabaseBtn").addEventListener("click", pushToSupabase);
  document.querySelector("#pullFromSupabaseBtn").addEventListener("click", pullFromSupabase);

  ["offerCompany", "offerPeople", "offerStart", "offerNights", "offerRegion", "offerPrice"].forEach((id) => {
    document.querySelector(`#${id}`).addEventListener("input", renderOffer);
  });
}

async function initApp() {
  document.querySelector("#offerStart").value = todayOffset(3);
  document.querySelector("#supabaseUrl").value = config.supabaseUrl || "";
  document.querySelector("#supabaseAnonKey").value = config.supabaseAnonKey || "";
  renderAll();
  await initSupabase();
}

function todayOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function loadState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return structuredClone(seed);
  try {
    return { ...structuredClone(seed), ...JSON.parse(raw) };
  } catch {
    return structuredClone(seed);
  }
}

function loadConfig() {
  const raw = localStorage.getItem(configKey);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function persist(options = {}) {
  localStorage.setItem(storageKey, JSON.stringify(state));
  if (options.remote !== false) scheduleRemoteSave();
}

function persistConfig() {
  localStorage.setItem(configKey, JSON.stringify(config));
}

function renderAll() {
  renderDashboard();
  renderLeads();
  renderApartments();
  renderTemplate();
  renderSearchIdeas();
  renderOffer();
  renderSystemStatus();
}

function showView(name) {
  Object.entries(views).forEach(([key, element]) => element.classList.toggle("active", key === name));
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === name));
  document.querySelector("#viewTitle").textContent = titles[name];
}

function scoreLead(lead) {
  let score = 0;
  if (lead.signal) score += 30;
  if (Number(lead.teamSize) >= 4) score += 20;
  else if (Number(lead.teamSize) > 0) score += 10;
  if (["Ruhrgebiet", "Rheinland", "Beides"].includes(lead.targetRegion || lead.region)) score += 20;
  if (lead.email) score += 10;
  if (lead.phone) score += 5;
  if (["Elektro / Industrie", "Anlagenbau", "Tiefbau", "PV / Solar"].includes(lead.industry)) score += 15;
  else score += 10;
  return Math.min(100, score);
}

function priority(score) {
  if (score >= 75) return "A - Sofort";
  if (score >= 55) return "B - Warm";
  if (score >= 35) return "C - Testen";
  return "D - Niedrig";
}

function isDue(lead) {
  return lead.followUp && new Date(lead.followUp) <= new Date(todayOffset(0)) && !["Kunde", "Absage"].includes(lead.status);
}

function renderDashboard() {
  const enriched = state.leads.map((lead) => ({ ...lead, score: scoreLead(lead) }));
  document.querySelector("#kpiOpen").textContent = enriched.filter((lead) => !["Kunde", "Absage"].includes(lead.status)).length;
  document.querySelector("#kpiA").textContent = enriched.filter((lead) => priority(lead.score) === "A - Sofort").length;
  document.querySelector("#kpiDue").textContent = enriched.filter(isDue).length;
  document.querySelector("#kpiBeds").textContent = state.apartments.reduce((sum, apt) => sum + Number(apt.beds || 0), 0);
  document.querySelector("#nextFocus").textContent = enriched.filter(isDue)[0]?.company || "A-Leads heute kontaktieren";

  const tasks = enriched
    .filter((lead) => priority(lead.score) === "A - Sofort" || isDue(lead))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  document.querySelector("#todayTasks").innerHTML = tasks.length
    ? tasks.map(taskTemplate).join("")
    : '<p class="muted">Keine fälligen Aufgaben. Zeit für neue Leads.</p>';

  const statuses = ["Neu", "Kontaktiert", "Interessiert", "Angebot gesendet", "Kunde", "Absage"];
  const max = Math.max(1, ...statuses.map((status) => state.leads.filter((lead) => lead.status === status).length));
  document.querySelector("#pipelineTotal").textContent = `${state.leads.length} Leads`;
  document.querySelector("#pipelineBars").innerHTML = statuses
    .map((status) => {
      const count = state.leads.filter((lead) => lead.status === status).length;
      return `<div class="bar-row"><span>${status}</span><div class="bar-track"><div class="bar-fill" style="width:${(count / max) * 100}%"></div></div><strong>${count}</strong></div>`;
    })
    .join("");

  const byCity = groupBy(state.apartments, "city");
  document.querySelector("#locationStrip").innerHTML = Object.entries(byCity)
    .map(([city, apartments]) => {
      const beds = apartments.reduce((sum, apt) => sum + Number(apt.beds || 0), 0);
      return `<div class="location"><strong>${city}</strong><span>${apartments.length} Objekt(e), ${beds} Betten</span></div>`;
    })
    .join("");
}

function taskTemplate(lead) {
  return `<div class="task">
    <div><strong>${escapeHtml(lead.company)}</strong><span>${escapeHtml(lead.industry)} · ${escapeHtml(lead.country)} · ${escapeHtml(lead.signal || "Signal ergänzen")}</span></div>
    <span class="pill ${isDue(lead) ? "gold" : ""}">${priority(lead.score)}</span>
  </div>`;
}

function renderLeads() {
  const query = document.querySelector("#leadSearch").value.trim().toLowerCase();
  const status = document.querySelector("#statusFilter").value;
  const prio = document.querySelector("#priorityFilter").value;
  const rows = state.leads
    .map((lead) => ({ ...lead, score: scoreLead(lead) }))
    .filter((lead) => {
      const haystack = [lead.company, lead.country, lead.region, lead.industry, lead.email, lead.signal].join(" ").toLowerCase();
      return (!query || haystack.includes(query)) && (!status || lead.status === status) && (!prio || priority(lead.score) === prio);
    })
    .sort((a, b) => b.score - a.score);

  document.querySelector("#leadRows").innerHTML = rows.map(leadRow).join("");
  document.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", (event) => {
      const lead = state.leads.find((item) => item.id === event.target.dataset.id);
      lead.status = event.target.value;
      if (lead.status === "Kontaktiert") lead.followUp = todayOffset(3);
      persist();
      renderAll();
    });
  });
}

function leadRow(lead) {
  const follow = lead.followUp || "offen";
  const prio = priority(lead.score);
  return `<tr>
    <td class="company-cell"><strong>${escapeHtml(lead.company)}</strong><span>${escapeHtml(lead.signal || "Bedarfssignal fehlt")}</span></td>
    <td>${escapeHtml(lead.country)}<br><span class="muted">${escapeHtml(lead.region || "")}</span></td>
    <td>${escapeHtml(lead.industry)}</td>
    <td><select class="status-select" data-id="${lead.id}">${statusOptions(lead.status)}</select></td>
    <td><span class="pill ${prio.startsWith("A") ? "" : prio.startsWith("B") ? "blue" : "gold"}">${lead.score} · ${prio}</span></td>
    <td>${follow}</td>
    <td>${escapeHtml(lead.email || "Mail fehlt")}<br><span class="muted">${escapeHtml(lead.phone || "Telefon fehlt")}</span></td>
  </tr>`;
}

function statusOptions(current) {
  return ["Neu", "Kontaktiert", "Interessiert", "Angebot gesendet", "Kunde", "Absage"]
    .map((status) => `<option ${status === current ? "selected" : ""}>${status}</option>`)
    .join("");
}

function renderApartments() {
  document.querySelector("#apartmentGrid").innerHTML = state.apartments
    .map(
      (apt) => `<article class="apartment">
        <div class="apartment-visual"></div>
        <div class="apartment-body">
          <h3>${escapeHtml(apt.name)}</h3>
          <p class="muted">${escapeHtml(apt.city)} · ${escapeHtml(apt.region)} · ${escapeHtml(apt.status)}</p>
          <div class="apartment-meta">
            <span>${apt.beds} Betten</span>
            <span>${apt.bedrooms} Zimmer</span>
            <span>${escapeHtml(apt.parking)}</span>
          </div>
        </div>
      </article>`
    )
    .join("");
}

function renderTemplate() {
  const language = document.querySelector("#templateLanguage").value;
  const template = state.templates[language] || seed.templates.DE;
  document.querySelector("#templateSubject").value = template.subject;
  document.querySelector("#templateBody").value = template.body;
}

function saveTemplate() {
  const language = document.querySelector("#templateLanguage").value;
  state.templates[language] = {
    subject: document.querySelector("#templateSubject").value,
    body: document.querySelector("#templateBody").value,
  };
  persist();
}

function renderSearchIdeas() {
  document.querySelector("#searchIdeas").innerHTML = searchIdeas
    .map(([title, text]) => `<div class="search-idea"><strong>${title}</strong><span>${text}</span></div>`)
    .join("");
}

function renderOffer() {
  const company = document.querySelector("#offerCompany").value;
  const people = Number(document.querySelector("#offerPeople").value || 0);
  const nights = Number(document.querySelector("#offerNights").value || 0);
  const region = document.querySelector("#offerRegion").value;
  const price = Number(document.querySelector("#offerPrice").value || 0);
  const start = document.querySelector("#offerStart").value;
  const matching = state.apartments.filter((apt) => region === "Beides" || apt.region === region).slice(0, 3);
  const total = people * nights * price;

  document.querySelector("#offerText").textContent =
    `Hallo,\n\nfür ${company} können wir folgende SpaceStays-Unterbringung anbieten:\n\n` +
    `Zeitraum: ab ${start || "[Startdatum]"} für ${nights} Nächte\n` +
    `Personen: ${people}\n` +
    `Region: ${region}\n\n` +
    `Passende Standorte:\n${matching.map((apt) => `- ${apt.name}, ${apt.city}: ${apt.beds} Betten, ${apt.bedrooms} Schlafzimmer, ${apt.parking}`).join("\n")}\n\n` +
    `Richtpreis: ${price.toLocaleString("de-DE")} EUR p. P. / Nacht\n` +
    `Gesamt netto grob: ${total.toLocaleString("de-DE")} EUR\n\n` +
    `Die finale Verfügbarkeit bestätigen wir nach Termin- und Teamaufteilung.\n\nBeste Grüße\nSpaceStays`;
}

function addLead(event) {
  event.preventDefault();
  const form = new FormData(event.target);
  const lead = {
    id: nextLeadId(),
    company: form.get("company"),
    country: form.get("country"),
    region: form.get("region"),
    industry: form.get("industry"),
    email: form.get("email"),
    phone: form.get("phone"),
    contact: "",
    source: "manuell",
    signal: form.get("signal"),
    status: "Neu",
    followUp: todayOffset(1),
    language: "DE",
    teamSize: Number(form.get("teamSize") || 0),
    targetRegion: form.get("region"),
    notes: "",
  };
  state.leads.unshift(lead);
  persist();
  event.target.reset();
  document.querySelector("#leadDialog").close();
  renderAll();
  showView("leads");
}

function addApartment() {
  const next = state.apartments.length + 1;
  state.apartments.push({
    id: `A-${String(next).padStart(3, "0")}`,
    name: `SpaceStays Objekt ${next}`,
    city: "Essen",
    region: "Ruhrgebiet",
    beds: 4,
    bedrooms: 2,
    parking: "prüfen",
    status: "neu",
  });
  persist();
  renderAll();
}

function nextLeadId() {
  const max = state.leads.reduce((highest, lead) => {
    const number = Number(String(lead.id || "").replace(/\D/g, ""));
    return Number.isFinite(number) ? Math.max(highest, number) : highest;
  }, 0);
  return `L-${String(max + 1).padStart(4, "0")}`;
}

function exportCsv() {
  const headers = ["Firma", "Land", "Region", "Branche", "E-Mail", "Telefon", "Status", "Follow-up", "Score", "Priorität", "Signal"];
  const rows = state.leads.map((lead) => [
    lead.company,
    lead.country,
    lead.region,
    lead.industry,
    lead.email,
    lead.phone,
    lead.status,
    lead.followUp,
    scoreLead(lead),
    priority(scoreLead(lead)),
    lead.signal,
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(";")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "spacestays_leads.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

async function initSupabase() {
  supabaseClient = null;
  currentSession = null;

  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    renderSystemStatus("Noch nicht verbunden.");
    return;
  }

  if (!window.supabase?.createClient) {
    renderSystemStatus("Supabase-Bibliothek konnte nicht geladen werden. Netzwerk prüfen.");
    return;
  }

  try {
    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    currentSession = data.session;
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      currentSession = session;
      renderSystemStatus();
      if (session) pullFromSupabase({ silent: true });
    });
    renderSystemStatus();
    if (currentSession) await pullFromSupabase({ silent: true });
  } catch (error) {
    renderSystemStatus(`Verbindung fehlgeschlagen: ${error.message}`);
  }
}

function isRemoteReady() {
  return Boolean(supabaseClient && currentSession);
}

function renderSystemStatus(message) {
  const badge = document.querySelector("#syncBadge");
  const mode = document.querySelector("#systemMode");
  const connection = document.querySelector("#connectionStatus");
  const login = document.querySelector("#loginStatus");
  const sync = document.querySelector("#syncStatus");

  if (!badge || !mode || !connection || !login || !sync) return;

  badge.classList.toggle("online", isRemoteReady());
  badge.textContent = isRemoteReady() ? "Supabase" : supabaseClient ? "Login offen" : "Lokal";
  mode.textContent = isRemoteReady() ? "Supabase aktiv" : "Lokaler Modus";
  mode.classList.toggle("blue", Boolean(supabaseClient && !currentSession));

  if (message) connection.textContent = message;
  else if (!config.supabaseUrl) connection.textContent = "Noch nicht verbunden.";
  else if (!supabaseClient) connection.textContent = "Supabase-Konfiguration gespeichert, aber Client nicht bereit.";
  else connection.textContent = "Supabase-Konfiguration geladen.";

  login.textContent = currentSession?.user?.email ? `Angemeldet als ${currentSession.user.email}` : "Nicht angemeldet.";
  sync.textContent = isRemoteReady() ? "Automatische Speicherung aktiv." : "Wartet auf Supabase-Login.";
}

async function saveSupabaseConfig() {
  config = {
    supabaseUrl: document.querySelector("#supabaseUrl").value.trim(),
    supabaseAnonKey: document.querySelector("#supabaseAnonKey").value.trim(),
  };
  persistConfig();
  renderSystemStatus("Verbindung wird geprüft...");
  await initSupabase();
}

function clearSupabaseConfig() {
  config = {};
  localStorage.removeItem(configKey);
  supabaseClient = null;
  currentSession = null;
  document.querySelector("#supabaseUrl").value = "";
  document.querySelector("#supabaseAnonKey").value = "";
  renderSystemStatus("Supabase getrennt. Lokaler Modus aktiv.");
}

async function sendMagicLink() {
  if (!supabaseClient) await initSupabase();
  if (!supabaseClient) {
    renderSystemStatus("Bitte zuerst Supabase Project URL und anon key speichern.");
    return;
  }

  const email = document.querySelector("#loginEmail").value.trim();
  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}${window.location.pathname}` },
  });

  document.querySelector("#loginStatus").textContent = error
    ? `Login-Link fehlgeschlagen: ${error.message}`
    : `Magic-Link wurde an ${email} gesendet.`;
}

async function signOut() {
  if (supabaseClient) await supabaseClient.auth.signOut();
  currentSession = null;
  renderSystemStatus("Abgemeldet. Lokaler Modus aktiv.");
}

function scheduleRemoteSave() {
  if (!isRemoteReady()) return;
  clearTimeout(remoteSaveTimer);
  remoteSaveTimer = setTimeout(() => {
    pushToSupabase({ silent: true });
  }, 700);
}

async function pushToSupabase(options = {}) {
  if (!isRemoteReady()) {
    if (!options.silent) document.querySelector("#syncStatus").textContent = "Bitte zuerst mit Supabase einloggen.";
    return;
  }

  try {
    const leadRows = state.leads.map(toDbLead);
    const apartmentRows = state.apartments.map(toDbApartment);
    const templateRows = Object.entries(state.templates).map(([language, template]) => ({
      language,
      subject: template.subject,
      body: template.body,
    }));

    await throwOnError(supabaseClient.from("leads").upsert(leadRows));
    await throwOnError(supabaseClient.from("apartments").upsert(apartmentRows));
    await throwOnError(supabaseClient.from("mail_templates").upsert(templateRows));
    if (!options.silent) document.querySelector("#syncStatus").textContent = "In Supabase gespeichert.";
  } catch (error) {
    document.querySelector("#syncStatus").textContent = `Speichern fehlgeschlagen: ${error.message}`;
  }
}

async function pullFromSupabase(options = {}) {
  if (!isRemoteReady()) {
    if (!options.silent) document.querySelector("#syncStatus").textContent = "Bitte zuerst mit Supabase einloggen.";
    return;
  }

  try {
    const leadsResult = await supabaseClient.from("leads").select("*").order("created_at", { ascending: false });
    const apartmentsResult = await supabaseClient.from("apartments").select("*").order("city", { ascending: true });
    const templatesResult = await supabaseClient.from("mail_templates").select("*").order("language", { ascending: true });
    if (leadsResult.error) throw leadsResult.error;
    if (apartmentsResult.error) throw apartmentsResult.error;
    if (templatesResult.error) throw templatesResult.error;

    const remoteLeads = leadsResult.data.map(fromDbLead);
    const remoteApartments = apartmentsResult.data.map(fromDbApartment);
    const remoteTemplates = templatesFromRows(templatesResult.data);

    state = {
      leads: remoteLeads.length ? remoteLeads : state.leads,
      apartments: remoteApartments.length ? remoteApartments : state.apartments,
      templates: Object.keys(remoteTemplates).length ? remoteTemplates : state.templates,
    };
    persist({ remote: false });
    renderAll();
    if (!options.silent) document.querySelector("#syncStatus").textContent = "Daten aus Supabase geladen.";
  } catch (error) {
    document.querySelector("#syncStatus").textContent = `Laden fehlgeschlagen: ${error.message}`;
  }
}

async function throwOnError(query) {
  const { error } = await query;
  if (error) throw error;
}

function toDbLead(lead) {
  return {
    id: lead.id,
    company: lead.company || "",
    country: lead.country || "",
    region: lead.region || "",
    industry: lead.industry || "",
    email: lead.email || "",
    phone: lead.phone || "",
    contact: lead.contact || "",
    source: lead.source || "",
    signal: lead.signal || "",
    status: lead.status || "Neu",
    follow_up: lead.followUp || null,
    language: lead.language || "DE",
    team_size: Number(lead.teamSize || 0),
    target_region: lead.targetRegion || "",
    notes: lead.notes || "",
  };
}

function fromDbLead(row) {
  return {
    id: row.id,
    company: row.company,
    country: row.country,
    region: row.region,
    industry: row.industry,
    email: row.email,
    phone: row.phone,
    contact: row.contact,
    source: row.source,
    signal: row.signal,
    status: row.status,
    followUp: row.follow_up,
    language: row.language,
    teamSize: row.team_size,
    targetRegion: row.target_region,
    notes: row.notes,
  };
}

function toDbApartment(apt) {
  return {
    id: apt.id,
    name: apt.name || "",
    city: apt.city || "",
    region: apt.region || "",
    beds: Number(apt.beds || 0),
    bedrooms: Number(apt.bedrooms || 0),
    parking: apt.parking || "",
    status: apt.status || "",
  };
}

function fromDbApartment(row) {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    region: row.region,
    beds: row.beds,
    bedrooms: row.bedrooms,
    parking: row.parking,
    status: row.status,
  };
}

function templatesFromRows(rows) {
  return rows.reduce((acc, row) => {
    acc[row.language] = { subject: row.subject, body: row.body };
    return acc;
  }, {});
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
}

function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "Offen";
    acc[value] = acc[value] || [];
    acc[value].push(item);
    return acc;
  }, {});
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
