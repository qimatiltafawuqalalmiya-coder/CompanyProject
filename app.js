const SUPABASE_URL = "https://hvhwsuzmrvmguqqljiqb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2aHdzdXptcnZtZ3VxcWxqaXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTM3MDYsImV4cCI6MjA5NDA2OTcwNn0._kRUs0cqkGMu2bffoE4mo9SOIAkdqOA0JRVCgONVf00";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.testSupabaseWrite = async function testSupabaseWrite() {
  const testId = "TEST-" + Date.now();
  const { data, error } = await supabaseClient
    .from("drivers")
    .insert({ id: testId, name: "Connection Test" })
    .select();

  console.log("Supabase write test:", { data, error });
  alert(error ? `Write test failed: ${error.message || error}` : `Write test worked: ${testId}`);
};

const USERS = { admin: "admin123", manager: "fleet2024" };

function doLogin() {
  const u = document.getElementById("login-user").value.trim();
  const p = document.getElementById("login-pass").value;
  if (USERS[u] && USERS[u] === p) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("app").style.display = "block";
    initApp();
  } else {
    document.getElementById("login-error").style.display = "block";
  }
}
document.getElementById("login-pass").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doLogin();
});
document.getElementById("login-user").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doLogin();
});

function doLogout() {
  document.getElementById("app").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("login-user").value = "";
  document.getElementById("login-pass").value = "";
  document.getElementById("login-error").style.display = "none";
}

// ══════════ DATABASE (localStorage) ══════════
const DEFAULT_DRIVERS = [
  {
    id: "D001",
    name: "Mohammed Al-Rashidi",
    iqamaid: "2456789012",
    phone: "+966 50 123 4567",
    nationality: "Saudi",
    dept: "Operations",
    iqama: "2025-06-05",
    workpermit: "2025-05-20",
    license: "2025-12-01",
    insurance: "2025-05-28",
    drivercardno: "DC-1001",
    drivercard: "2025-05-28",
    ajeer: "2025-06-30",
    passport: "2026-03-10",
    medical: "2025-08-01",
    visa: "2025-09-15",
  },
  {
    id: "D002",
    name: "Ahmed Hassan Karimi",
    iqamaid: "2567890123",
    phone: "+966 55 234 5678",
    nationality: "Pakistani",
    dept: "Logistics",
    iqama: "2025-08-20",
    workpermit: "2025-08-20",
    license: "2026-01-15",
    insurance: "2025-11-30",
    drivercardno: "DC-1002",
    drivercard: "2026-02-10",
    ajeer: "2025-08-20",
    passport: "2027-05-01",
    medical: "2025-10-10",
    visa: "2025-08-20",
  },
  {
    id: "D003",
    name: "Rajesh Kumar Singh",
    iqamaid: "2678901234",
    phone: "+966 56 345 6789",
    nationality: "Indian",
    dept: "Operations",
    iqama: "2026-02-14",
    workpermit: "2026-02-14",
    license: "2026-05-20",
    insurance: "2026-01-01",
    drivercardno: "DC-1003",
    drivercard: "2025-12-31",
    ajeer: "2026-02-14",
    passport: "2028-11-20",
    medical: "2026-03-01",
    visa: "2026-02-14",
  },
  {
    id: "D004",
    name: "Santhosh Mathew",
    iqamaid: "2789012345",
    phone: "+966 57 456 7890",
    nationality: "Indian",
    dept: "Delivery",
    iqama: "2024-12-01",
    workpermit: "2024-12-01",
    license: "2025-03-15",
    insurance: "2024-11-30",
    drivercardno: "DC-1004",
    drivercard: "2024-12-15",
    ajeer: "2024-12-01",
    passport: "2025-06-10",
    medical: "2025-01-20",
    visa: "2024-12-01",
  },
  {
    id: "D005",
    name: "Karim Al-Dossari",
    iqamaid: "2890123456",
    phone: "+966 50 567 8901",
    nationality: "Saudi",
    dept: "Operations",
    iqama: "2026-07-10",
    workpermit: "2026-07-10",
    license: "2026-09-01",
    insurance: "2026-05-15",
    drivercardno: "DC-1005",
    drivercard: "2026-08-20",
    ajeer: "2026-07-10",
    passport: "2029-01-01",
    medical: "2026-10-01",
    visa: "",
  },
];

const DEFAULT_VEHICLES = [
  {
    id: "V001",
    plate: "ABC-1234",
    make: "Toyota Hilux",
    year: "2021",
    color: "White",
    driver: "Mohammed Al-Rashidi",
    type: "Pickup",
    insurance: "2025-05-25",
    ishtamara: "2025-06-10",
    tafweed: "2025-07-01",
    operationcardno: "OP-1001",
    operationcardexpiry: "2025-12-01",
    fahas: "2025-11-15",
    gps: "On",
  },
  {
    id: "V002",
    plate: "XYZ-5678",
    make: "Ford F-150",
    year: "2022",
    color: "Silver",
    driver: "Ahmed Hassan Karimi",
    type: "Pickup",
    insurance: "2025-09-30",
    ishtamara: "2025-10-15",
    tafweed: "2025-11-01",
    operationcardno: "OP-1002",
    operationcardexpiry: "2026-01-20",
    fahas: "2026-02-28",
    gps: "On",
  },
  {
    id: "V003",
    plate: "MNO-9012",
    make: "Mitsubishi L200",
    year: "2020",
    color: "Blue",
    driver: "Rajesh Kumar Singh",
    type: "Pickup",
    insurance: "2025-12-31",
    ishtamara: "2026-01-10",
    tafweed: "2026-02-01",
    operationcardno: "OP-1003",
    operationcardexpiry: "2026-03-15",
    fahas: "2026-04-01",
    gps: "Off",
  },
  {
    id: "V004",
    plate: "PQR-3456",
    make: "Isuzu D-Max",
    year: "2019",
    color: "White",
    driver: "Santhosh Mathew",
    type: "Truck",
    insurance: "2024-11-20",
    ishtamara: "2024-12-05",
    tafweed: "2025-01-01",
    operationcardno: "OP-1004",
    operationcardexpiry: "2025-02-28",
    fahas: "2025-03-10",
    gps: "Off",
  },
  {
    id: "V005",
    plate: "STU-7890",
    make: "Mercedes Sprinter",
    year: "2022",
    color: "Grey",
    driver: "Karim Al-Dossari",
    type: "Van",
    insurance: "2025-05-30",
    ishtamara: "2025-11-01",
    tafweed: "2026-01-15",
    operationcardno: "OP-1005",
    operationcardexpiry: "2026-03-10",
    fahas: "2025-05-15",
    gps: "On",
  },
];

let driversCache = [];
let vehiclesCache = [];
let employeesCache = [];
let maroorViolationsCache = [];
let efaaViolationsCache = [];
let isSaving = false;

function cleanRecord(record) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, value === "" ? null : value])
  );
}

function loadDrivers() {
  return driversCache;
}
function loadVehicles() {
  return vehiclesCache;
}
function loadMaroorViolations() {
  return maroorViolationsCache;
}
function loadEfaaViolations() {
  return efaaViolationsCache;
}

function showDbError(action, error) {
  console.error(`${action}:`, error);
  const details = error?.message || error?.details || error?.hint || JSON.stringify(error);
  alert(`${action}.\n\n${details}`);
}

async function refreshDrivers() {
  const { data, error } = await supabaseClient.from("drivers").select("*").order("id");
  if (error) {
    showDbError("Could not load drivers from Supabase", error);
    return;
  }
  driversCache = data || [];
}

async function refreshVehicles() {
  const { data, error } = await supabaseClient.from("vehicles").select("*").order("id");
  if (error) {
    showDbError("Could not load vehicles from Supabase", error);
    return;
  }
  vehiclesCache = data || [];
}

async function refreshMaroorViolations() {
  const { data, error } = await supabaseClient.from("maroor_violations").select("*").order("id");
  if (error) {
    showDbError("Could not load Maroor violations from Supabase", error);
    return;
  }
  maroorViolationsCache = data || [];
}

async function refreshEfaaViolations() {
  const { data, error } = await supabaseClient.from("efaa_violations").select("*").order("id");
  if (error) {
    showDbError("Could not load Efaa violations from Supabase", error);
    return;
  }
  efaaViolationsCache = data || [];
}

async function seedDefaultsIfEmpty() {
  return;
  if (driversCache.length === 0) {
    const { error } = await supabaseClient.from("drivers").upsert(DEFAULT_DRIVERS.map(cleanRecord));
    if (error) showDbError("Could not add default drivers to Supabase", error);
    await refreshDrivers();
  }

  if (vehiclesCache.length === 0) {
    const { error } = await supabaseClient.from("vehicles").upsert(DEFAULT_VEHICLES.map(cleanRecord));
    if (error) showDbError("Could not add default vehicles to Supabase", error);
    await refreshVehicles();
  }
}

// ══════════ UTILS ══════════
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

function daysUntil(ds) {
  if (!ds) return null;
  const d = new Date(ds + "T00:00:00");
  d.setHours(0, 0, 0, 0);
  return Math.floor((d - TODAY) / 86400000);
}
function statusClass(days) {
  if (days === null) return "na";
  if (days < 0) return "expired";
  if (days <= 30) return "expiring";
  return "ok";
}
function statusLabel(days) {
  if (days === null) return '<span class="badge na">N/A</span>';
  if (days < 0)
    return `<span class="badge expired">Expired ${Math.abs(days)}d ago</span>`;
  if (days <= 30) return `<span class="badge expiring">${days}d left</span>`;
  return `<span class="badge ok">Valid</span>`;
}
function worstStatus(record, fields) {
  const statuses = fields
    .map((f) => daysUntil(record[f]))
    .filter((d) => d !== null);
  if (statuses.some((d) => d < 0)) return "expired";
  if (statuses.some((d) => d <= 30)) return "expiring";
  return "ok";
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const DRIVER_FIELDS = [
  "iqama",
  "workpermit",
  "license",
  "insurance",
  "drivercard",
  "ajeer",
  "passport",
  "medical",
  "visa",
];
const VEHICLE_FIELDS = [
  "insurance",
  "ishtamara",
  "tafweed",
  "operationcardexpiry",
  "fahas",
];

const DRIVER_LABELS = {
  iqama: "Iqama",
  workpermit: "Work Permit",
  license: "Driving Licence",
  insurance: "Insurance",
  drivercard: "Driver Card",
  ajeer: "Ajeer",
  passport: "Passport",
  medical: "Medical",
  visa: "Visa",
};
const VEHICLE_LABELS = {
  insurance: "Insurance",
  ishtamara: "Ishtamara",
  tafweed: "Tafweed",
  operationcardexpiry: "Operation Card",
  fahas: "Fahas",
};
const EMPLOYEE_FIELDS = ["iqamaexpiry", "insurance", "ajeer", "passport", "contractend"];
const EMPLOYEE_LABELS = {
  iqamaexpiry: "Iqama",
  insurance: "Medical Insurance",
  ajeer: "Ajeer",
  passport: "Passport",
  contractend: "End of Contract",
};

// ══════════ NAVIGATION ══════════
function showPage(name) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  document.getElementById("page-" + name).classList.add("active");
  document
    .querySelectorAll(".nav-item")
  [["dashboard", "drivers", "vehicles", "employees", "maroor-violations", "efaa-violations"].indexOf(name)].classList.add(
    "active"
  );
  if (name === "dashboard") renderDashboard();
  if (name === "drivers") renderDrivers();
  if (name === "vehicles") renderVehicles();
  if (name === "employees") renderEmployees();
  if (name === "maroor-violations") renderMaroorViolations();
  if (name === "efaa-violations") renderEfaaViolations();
}

// ══════════ DASHBOARD ══════════
function renderDashboard() {
  const drivers = loadDrivers();
  const vehicles = loadVehicles();
  const employees = loadEmployees();
  const maroorViolations = loadMaroorViolations();
  const efaaViolations = loadEfaaViolations();
  const now = new Date();
  document.getElementById("dash-date").textContent = now.toLocaleDateString(
    "en-US",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );

  const dExpired = drivers.filter((d) =>
    DRIVER_FIELDS.some((f) => {
      const days = daysUntil(d[f]);
      return days !== null && days < 0;
    })
  ).length;
  const dWarn = drivers.filter(
    (d) => worstStatus(d, DRIVER_FIELDS) === "expiring"
  ).length;
  const vExpired = vehicles.filter((v) =>
    VEHICLE_FIELDS.some((f) => {
      const days = daysUntil(v[f]);
      return days !== null && days < 0;
    })
  ).length;
  const vWarn = vehicles.filter(
    (v) => worstStatus(v, VEHICLE_FIELDS) === "expiring"
  ).length;
  const eExpired = employees.filter((e) =>
    EMPLOYEE_FIELDS.some((f) => {
      const days = daysUntil(e[f]);
      return days !== null && days < 0;
    })
  ).length;
  const eWarn = employees.filter(
    (e) => worstStatus(e, EMPLOYEE_FIELDS) === "expiring"
  ).length;

  const maroorCount = maroorViolations.length;
  const efaaCount = efaaViolations.length;
  const totalAlerts = dExpired + dWarn + vExpired + vWarn + eExpired + eWarn + maroorCount + efaaCount;
  const badge = document.getElementById("alert-badge");
  if (totalAlerts > 0) {
    badge.style.display = "";
    badge.textContent = totalAlerts;
  } else {
    badge.style.display = "none";
  }

  document.getElementById("dash-stats").innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Total Drivers</div>
      <div class="stat-val c-total">${drivers.length}</div>
      <span class="stat-badge c-green">${drivers.length - dExpired - dWarn} valid</span>
    </div>
    <div class="stat-card">
      <div class="stat-label">Driver Issues</div>
      <div class="stat-val c-red">${dExpired + dWarn}</div>
      <span class="stat-badge c-red">${dExpired} expired · ${dWarn} expiring</span>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Vehicles</div>
      <div class="stat-val c-total">${vehicles.length}</div>
      <span class="stat-badge c-green">${vehicles.length - vExpired - vWarn} valid</span>
    </div>
    <div class="stat-card">
      <div class="stat-label">Vehicle Issues</div>
      <div class="stat-val c-amber">${vExpired + vWarn}</div>
      <span class="stat-badge c-amber">${vExpired} expired · ${vWarn} expiring</span>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Employees</div>
      <div class="stat-val c-total">${employees.length}</div>
      <span class="stat-badge c-green">${employees.length - eExpired - eWarn} valid</span>
    </div>
    <div class="stat-card">
      <div class="stat-label">Employee Issues</div>
      <div class="stat-val c-red">${eExpired + eWarn}</div>
      <span class="stat-badge c-red">${eExpired} expired · ${eWarn} expiring</span>
    </div>
    <div class="stat-card">
      <div class="stat-label">Maroor Violation</div>
      <div class="stat-val ${maroorCount > 0 ? "c-red" : "c-green"}">${maroorCount}</div>
      <span class="stat-badge ${maroorCount > 0 ? "c-red" : "c-green"}">${maroorCount} violation${maroorCount > 1 ? "s" : ""}</span>
    </div>
    <div class="stat-card">
      <div class="stat-label">Efaa Violation</div>
      <div class="stat-val ${efaaCount > 0 ? "c-red" : "c-green"}">${efaaCount}</div>
      <span class="stat-badge ${efaaCount > 0 ? "c-red" : "c-green"}">${efaaCount} violation${efaaCount > 1 ? "s" : ""}</span>
    </div>
  `;

  // Collect all alerts (expired + expiring within 60 days)
  const alerts = [];
  drivers.forEach((d) => {
    DRIVER_FIELDS.forEach((f) => {
      const days = daysUntil(d[f]);
      if (days !== null && days < 60) {
        alerts.push({
          type: days < 0 ? "expired" : "expiring",
          name: d.name,
          doc: DRIVER_LABELS[f],
          date: d[f],
          days,
          category: "Driver",
        });
      }
    });
  });
  vehicles.forEach((v) => {
    VEHICLE_FIELDS.forEach((f) => {
      const days = daysUntil(v[f]);
      if (days !== null && days < 60) {
        alerts.push({
          type: days < 0 ? "expired" : "expiring",
          name: v.plate + " — " + v.make,
          doc: VEHICLE_LABELS[f],
          date: v[f],
          days,
          category: "Vehicle",
        });
      }
    });
  });
  employees.forEach((e) => {
    EMPLOYEE_FIELDS.forEach((f) => {
      const days = daysUntil(e[f]);
      if (days !== null && days < 60) {
        alerts.push({
          type: days < 0 ? "expired" : "expiring",
          name: e.name,
          doc: EMPLOYEE_LABELS[f],
          date: e[f],
          days,
          category: "Employee",
        });
      }
    });
  });
  alerts.sort((a, b) => a.days - b.days);

  const expired = alerts.filter((a) => a.type === "expired");
  const expiring = alerts.filter((a) => a.type === "expiring");

  let html = "";
  if (alerts.length === 0) {
    html =
      '<div class="all-clear">✓ All documents are valid. No alerts at this time.</div>';
  }
  if (expired.length > 0) {
    html += `<div class="dash-section-title" style="color:var(--red)">🔴 Expired Documents (${expired.length})</div><div class="dash-alert-grid">`;
    expired.forEach((a) => {
      html += `<div class="dash-alert-card expired">
        <div class="dash-alert-icon"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg></div>
        <div>
          <div class="dash-alert-name">${a.name}</div>
          <div class="dash-alert-doc">${a.category} · ${a.doc}</div>
          <div class="dash-alert-date">Expired ${fmtDate(a.date)} — ${Math.abs(
        a.days
      )} days ago</div>
        </div>
      </div>`;
    });
    html += "</div>";
  }
  if (expiring.length > 0) {
    html += `<div class="dash-section-title" style="color:var(--amber);margin-top:${expired.length ? 20 : 0
      }px">🟡 Expiring Within 60 Days (${expiring.length
      })</div><div class="dash-alert-grid">`;
    expiring.forEach((a) => {
      html += `<div class="dash-alert-card expiring">
        <div class="dash-alert-icon"><svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg></div>
        <div>
          <div class="dash-alert-name">${a.name}</div>
          <div class="dash-alert-doc">${a.category} · ${a.doc}</div>
          <div class="dash-alert-date">Expires ${fmtDate(a.date)} — <strong>${a.days
        } days left</strong></div>
        </div>
      </div>`;
    });
    html += "</div>";
  }
  document.getElementById("dash-alerts").innerHTML = html;
}

// ══════════ DRIVERS TABLE ══════════
function renderDrivers() {
  const q = (
    document.getElementById("driver-search")?.value || ""
  ).toLowerCase();
  const drivers = loadDrivers().filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      (d.id || "").toLowerCase().includes(q) ||
      (d.iqamaid || "").includes(q) ||
      (d.drivercardno || "").toLowerCase().includes(q) ||
      (d.nationality || "").toLowerCase().includes(q) ||
      (d.dept || "").toLowerCase().includes(q)
  );
  if (drivers.length === 0) {
    document.getElementById("drivers-table").innerHTML =
      '<div class="empty">No drivers found.</div>';
    return;
  }
  let html = `<table><thead><tr>
    <th>ID</th>
    <th>Driver</th>
    <th>Iqama ID</th>
    <th>Iqama Expiry</th>
    <th>Work Permit</th>
    <th>Drv. Licence</th>
    <th>Insurance</th>
    <th>Driver Card No.</th>
    <th>Driver Card</th>
    <th>Ajeer</th>
    <th>Passport</th>
    <th>Medical</th>
    <th>Visa</th>
    <th>Actions</th>
  </tr></thead><tbody>`;

  const allD = loadDrivers();
  drivers.forEach((d) => {
    const ws = worstStatus(d, DRIVER_FIELDS);
    const rc =
      ws === "expired"
        ? "row-expired"
        : ws === "expiring"
          ? "row-expiring"
          : "";
    const ri = allD.findIndex((x) => x.id === d.id);
    html += `<tr class="${rc}">
      <td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${d.id || "—"
      }</span></td>
      <td>
        <div style="font-weight:500">${d.name}</div>
        <div style="font-size:11px;color:var(--text3)">${d.nationality || ""} ${d.dept ? "· " + d.dept : ""
      }</div>
      </td>
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${d.iqamaid || "—"
      }</td>
      ${["iqama", "workpermit", "license", "insurance"].map((f) => {
        const days = daysUntil(d[f]);
        return `<td>${statusLabel(days)}<div class="date-sub">${fmtDate(
          d[f]
        )}</div></td>`;
      }).join("")}
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${d.drivercardno || "—"}</td>
      ${["drivercard", "ajeer", "passport", "medical", "visa"].map((f) => {
        const days = daysUntil(d[f]);
        return `<td>${statusLabel(days)}<div class="date-sub">${fmtDate(
          d[f]
        )}</div></td>`;
      }).join("")}
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="editDriver(${ri})" title="Edit">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-icon del" onclick="deleteDriver(${ri})" title="Delete">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  });
  html += "</tbody></table>";
  document.getElementById("drivers-table").innerHTML = html;
}

// ══════════ VEHICLES TABLE ══════════
function renderVehicles() {
  const q = (
    document.getElementById("vehicle-search")?.value || ""
  ).toLowerCase();
  const vehicles = loadVehicles().filter(
    (v) =>
      (v.plate || "").toLowerCase().includes(q) ||
      (v.id || "").toLowerCase().includes(q) ||
      (v.make || "").toLowerCase().includes(q) ||
      (v.operationcardno || "").toLowerCase().includes(q) ||
      (v.driver || "").toLowerCase().includes(q)
  );
  if (vehicles.length === 0) {
    document.getElementById("vehicles-table").innerHTML =
      '<div class="empty">No vehicles found.</div>';
    return;
  }
  let html = `<table><thead><tr>
    <th>ID</th>
    <th>Vehicle</th>
    <th>Driver</th>
    <th>Insurance</th>
    <th>Ishtamara</th>
    <th>Tafweed</th>
    <th>Operation Card No.</th>
    <th>Operation Card</th>
    <th>Fahas</th>
    <th>GPS Status</th>
    <th>Actions</th>
  </tr></thead><tbody>`;

  const allV = loadVehicles();
  vehicles.forEach((v) => {
    const ws = worstStatus(v, VEHICLE_FIELDS);
    const rc =
      ws === "expired"
        ? "row-expired"
        : ws === "expiring"
          ? "row-expiring"
          : "";
    const ri = allV.findIndex((x) => x.id === v.id);
    html += `<tr class="${rc}">
      <td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${v.id || "—"
      }</span></td>
      <td>
        <div style="font-weight:500">${v.plate}</div>
        <div style="font-size:11px;color:var(--text3)">${v.make || ""} ${v.year ? "· " + v.year : ""
      } ${v.color ? "· " + v.color : ""}</div>
      </td>
      <td style="color:var(--text2);font-size:13px">${v.driver || "—"}</td>
      ${["insurance", "ishtamara", "tafweed"].map((f) => {
        const days = daysUntil(v[f]);
        return `<td>${statusLabel(days)}<div class="date-sub">${fmtDate(
          v[f]
        )}</div></td>`;
      }).join("")}
      <td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${v.operationcardno || "—"}</span></td>
      ${["operationcardexpiry", "fahas"].map((f) => {
        const days = daysUntil(v[f]);
        return `<td>${statusLabel(days)}<div class="date-sub">${fmtDate(
          v[f]
        )}</div></td>`;
      }).join("")}
      <td>${v.gps === "On"
        ? '<span class="badge ok">On</span>'
        : v.gps === "Off"
          ? '<span class="badge expired">Off</span>'
          : '<span class="badge na">N/A</span>'
      }</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="editVehicle(${ri})" title="Edit">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-icon del" onclick="deleteVehicle(${ri})" title="Delete">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  });
  html += "</tbody></table>";
  document.getElementById("vehicles-table").innerHTML = html;
}

// ══════════ DRIVER MODAL ══════════
let editDriverIdx = -1;
function openDriverModal(idx = -1) {
  editDriverIdx = idx;
  const drivers = loadDrivers();
  const d = idx >= 0 ? drivers[idx] : {};
  document.getElementById("driver-modal-title").textContent =
    idx >= 0 ? "Edit Driver" : "Add Driver";
  document.getElementById("d-name").value = d.name || "";
  document.getElementById("d-id").value = d.id || "";
  document.getElementById("d-iqamaid").value = d.iqamaid || "";
  document.getElementById("d-phone").value = d.phone || "";
  document.getElementById("d-nationality").value = d.nationality || "";
  document.getElementById("d-dept").value = d.dept || "";
  document.getElementById("d-iqama").value = d.iqama || "";
  document.getElementById("d-workpermit").value = d.workpermit || "";
  document.getElementById("d-license").value = d.license || "";
  document.getElementById("d-insurance").value = d.insurance || "";
  document.getElementById("d-drivercardno").value = d.drivercardno || "";
  document.getElementById("d-drivercard").value = d.drivercard || "";
  document.getElementById("d-ajeer").value = d.ajeer || "";
  document.getElementById("d-passport").value = d.passport || "";
  document.getElementById("d-medical").value = d.medical || "";
  document.getElementById("d-visa").value = d.visa || "";
  document.getElementById("driver-modal").classList.add("open");
}
function editDriver(idx) {
  openDriverModal(idx);
}
async function deleteDriver(idx) {
  if (!confirm("Remove this driver?")) return;
  const driver = driversCache[idx];
  if (!driver) return;
  const { error } = await supabaseClient.from("drivers").delete().eq("id", driver.id);
  if (error) {
    showDbError("Could not delete driver from Supabase", error);
    return;
  }
  await refreshDrivers();
  renderDrivers();
  renderDashboard();
}
async function saveDriver() {
  if (isSaving) return;
  const name = document.getElementById("d-name").value.trim();
  if (!name) {
    alert("Driver name is required.");
    return;
  }
  isSaving = true;
  try {
    const drivers = loadDrivers();
    const rec = {
      id:
        document.getElementById("d-id").value.trim() ||
        (editDriverIdx >= 0
          ? drivers[editDriverIdx].id
          : "D" + String(drivers.length + 1).padStart(3, "0")),
      name,
      iqamaid: document.getElementById("d-iqamaid").value.trim(),
      phone: document.getElementById("d-phone").value.trim(),
      nationality: document.getElementById("d-nationality").value.trim(),
      dept: document.getElementById("d-dept").value.trim(),
      iqama: document.getElementById("d-iqama").value,
      workpermit: document.getElementById("d-workpermit").value,
      license: document.getElementById("d-license").value,
      insurance: document.getElementById("d-insurance").value,
      drivercardno: document.getElementById("d-drivercardno").value.trim(),
      drivercard: document.getElementById("d-drivercard").value,
      ajeer: document.getElementById("d-ajeer").value,
      passport: document.getElementById("d-passport").value,
      medical: document.getElementById("d-medical").value,
      visa: document.getElementById("d-visa").value,
    };
    const query = editDriverIdx >= 0
      ? supabaseClient.from("drivers").update(cleanRecord(rec)).eq("id", rec.id)
      : supabaseClient.from("drivers").insert(cleanRecord(rec));
    const { error } = await query;
    if (error) {
      showDbError("Could not save driver to Supabase", error);
      return;
    }
    await refreshDrivers();
    closeModal("driver-modal");
    renderDrivers();
    renderDashboard();
  } catch (error) {
    showDbError("Could not save driver to Supabase", error);
  } finally {
    isSaving = false;
  }
}

// ══════════ VEHICLE MODAL ══════════
let editVehicleIdx = -1;
function openVehicleModal(idx = -1) {
  editVehicleIdx = idx;
  const vehicles = loadVehicles();
  const v = idx >= 0 ? vehicles[idx] : {};
  document.getElementById("vehicle-modal-title").textContent =
    idx >= 0 ? "Edit Vehicle" : "Add Vehicle";
  document.getElementById("v-id").value = v.id || "";
  document.getElementById("v-plate").value = v.plate || "";
  document.getElementById("v-make").value = v.make || "";
  document.getElementById("v-year").value = v.year || "";
  document.getElementById("v-color").value = v.color || "";
  document.getElementById("v-type").value = v.type || "";
  document.getElementById("v-driver").value = v.driver || "";
  document.getElementById("v-insurance").value = v.insurance || "";
  document.getElementById("v-ishtamara").value = v.ishtamara || "";
  document.getElementById("v-tafweed").value = v.tafweed || "";
  document.getElementById("v-operationcardno").value = v.operationcardno || "";
  document.getElementById("v-operationcardexpiry").value = v.operationcardexpiry || "";
  document.getElementById("v-fahas").value = v.fahas || v.maintenance || "";
  document.getElementById("v-gps").value = v.gps || "";
  document.getElementById("vehicle-modal").classList.add("open");
}
function editVehicle(idx) {
  openVehicleModal(idx);
}
async function deleteVehicle(idx) {
  if (!confirm("Remove this vehicle?")) return;
  const vehicle = vehiclesCache[idx];
  if (!vehicle) return;
  const { error } = await supabaseClient.from("vehicles").delete().eq("id", vehicle.id);
  if (error) {
    showDbError("Could not delete vehicle from Supabase", error);
    return;
  }
  await refreshVehicles();
  renderVehicles();
  renderDashboard();
}
async function saveVehicle() {
  if (isSaving) return;
  const plate = document.getElementById("v-plate").value.trim();
  if (!plate) {
    alert("Plate number is required.");
    return;
  }
  isSaving = true;
  try {
    const vehicles = loadVehicles();
    const rec = {
      id:
        document.getElementById("v-id").value.trim() ||
        (editVehicleIdx >= 0
          ? vehicles[editVehicleIdx].id
          : "V" + String(vehicles.length + 1).padStart(3, "0")),
      plate,
      make: document.getElementById("v-make").value.trim(),
      year: document.getElementById("v-year").value.trim(),
      color: document.getElementById("v-color").value.trim(),
      type: document.getElementById("v-type").value,
      driver: document.getElementById("v-driver").value.trim(),
      insurance: document.getElementById("v-insurance").value,
      ishtamara: document.getElementById("v-ishtamara").value,
      tafweed: document.getElementById("v-tafweed").value,
      operationcardno: document.getElementById("v-operationcardno").value.trim(),
      operationcardexpiry: document.getElementById("v-operationcardexpiry").value,
      fahas: document.getElementById("v-fahas").value,
      gps: document.getElementById("v-gps").value,
    };
    const query = editVehicleIdx >= 0
      ? supabaseClient.from("vehicles").update(cleanRecord(rec)).eq("id", rec.id)
      : supabaseClient.from("vehicles").insert(cleanRecord(rec));
    const { error } = await query;
    if (error) {
      showDbError("Could not save vehicle to Supabase", error);
      return;
    }
    await refreshVehicles();
    closeModal("vehicle-modal");
    renderVehicles();
    renderDashboard();
  } catch (error) {
    showDbError("Could not save vehicle to Supabase", error);
  } finally {
    isSaving = false;
  }
}

// ══════════ MODAL UTILS ══════════
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}
document.querySelectorAll(".modal-overlay").forEach((m) => {
  m.addEventListener("click", (e) => {
    if (e.target === m) m.classList.remove("open");
  });
});

// ══════════ EMPLOYEES TABLE ══════════
function loadEmployees() {
  return employeesCache;
}

async function refreshEmployees() {
  const { data, error } = await supabaseClient.from("employees").select("*").order("id");
  if (error) {
    showDbError("Could not load employees from Supabase", error);
    return;
  }
  employeesCache = data || [];
}

function renderEmployees() {
  const q = (
    document.getElementById("employee-search")?.value || ""
  ).toLowerCase();
  const employees = loadEmployees().filter(
    (e) =>
      (e.name || "").toLowerCase().includes(q) ||
      (e.iqama || "").includes(q) ||
      (e.occupation || "").toLowerCase().includes(q) ||
      (e.company || "").toLowerCase().includes(q) ||
      (e.mobile || "").includes(q)
  );
  let html = `<table><thead><tr>
    <th>Name</th>
    <th>Mobile Number</th>
    <th>Date of Birth</th>
    <th>Iqama No.</th>
    <th>Company</th>
    <th>Occupation</th>
    <th>Date of Contract</th>
    <th>End of Contract</th>
    <th>Iqama Expiry</th>
    <th>Medical Insurance</th>
    <th>Ajeer</th>
    <th>Passport Expiry</th>
    <th>Actions</th>
  </tr></thead><tbody>`;
  if (employees.length === 0) {
    html += `<tr><td colspan="13" style="text-align:center;color:var(--text3);padding:32px">No employees found.</td></tr>`;
    html += "</tbody></table>";
    document.getElementById("employees-table").innerHTML = html;
    return;
  }

  const allE = loadEmployees();
  employees.forEach((e) => {
    const ws = worstStatus(e, EMPLOYEE_FIELDS);
    const rc =
      ws === "expired"
        ? "row-expired"
        : ws === "expiring"
          ? "row-expiring"
          : "";
    const ri = allE.findIndex((x) => x.id === e.id);
    html += `<tr class="${rc}">
      <td>
        <div style="font-weight:500">${e.name}</div>
        <div style="font-size:11px;color:var(--text3)">${e.occupation || ""}</div>
      </td>
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${e.mobile || "—"}</td>
      <td><div class="date-sub">${fmtDate(e.dateofbirth)}</div></td>
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${e.iqama || "—"}</td>
      <td style="color:var(--text2);font-size:13px">${e.company || "—"}</td>
      <td style="color:var(--text2);font-size:13px">${e.occupation || "—"}</td>
      <td><div class="date-sub">${fmtDate(e.contractstart)}</div></td>
      <td>${statusLabel(daysUntil(e.contractend))}<div class="date-sub">${fmtDate(e.contractend)}</div></td>
      <td>${statusLabel(daysUntil(e.iqamaexpiry))}<div class="date-sub">${fmtDate(e.iqamaexpiry)}</div></td>
      <td>${statusLabel(daysUntil(e.insurance))}<div class="date-sub">${fmtDate(e.insurance)}</div></td>
      <td>${statusLabel(daysUntil(e.ajeer))}<div class="date-sub">${fmtDate(e.ajeer)}</div></td>
      <td>${statusLabel(daysUntil(e.passport))}<div class="date-sub">${fmtDate(e.passport)}</div></td>
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="editEmployee(${ri})" title="Edit">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-icon del" onclick="deleteEmployee(${ri})" title="Delete">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  });
  html += "</tbody></table>";
  document.getElementById("employees-table").innerHTML = html;
}

// ══════════ EMPLOYEE MODAL ══════════
let editEmployeeIdx = -1;
function openEmployeeModal(idx = -1) {
  editEmployeeIdx = idx;
  const employees = loadEmployees();
  const e = idx >= 0 ? employees[idx] : {};
  document.getElementById("employee-modal-title").textContent =
    idx >= 0 ? "Edit Employee" : "Add Employee";
  document.getElementById("e-name").value = e.name || "";
  document.getElementById("e-mobile").value = e.mobile || "";
  document.getElementById("e-dateofbirth").value = e.dateofbirth || "";
  document.getElementById("e-iqama").value = e.iqama || "";
  document.getElementById("e-company").value = e.company || "";
  document.getElementById("e-occupation").value = e.occupation || "";
  document.getElementById("e-contractstart").value = e.contractstart || "";
  document.getElementById("e-contractend").value = e.contractend || "";
  document.getElementById("e-iqamaexpiry").value = e.iqamaexpiry || "";
  document.getElementById("e-insurance").value = e.insurance || "";
  document.getElementById("e-ajeer").value = e.ajeer || "";
  document.getElementById("e-passport").value = e.passport || "";
  document.getElementById("employee-modal").classList.add("open");
}
function editEmployee(idx) {
  openEmployeeModal(idx);
}
async function deleteEmployee(idx) {
  if (!confirm("Remove this employee?")) return;
  const employee = employeesCache[idx];
  if (!employee) return;
  const { error } = await supabaseClient.from("employees").delete().eq("id", employee.id);
  if (error) {
    showDbError("Could not delete employee from Supabase", error);
    return;
  }
  await refreshEmployees();
  renderEmployees();
  renderDashboard();
}
async function saveEmployee() {
  if (isSaving) return;
  const name = document.getElementById("e-name").value.trim();
  if (!name) {
    alert("Employee name is required.");
    return;
  }
  isSaving = true;
  try {
    const employees = loadEmployees();
    const rec = {
      id:
        editEmployeeIdx >= 0
          ? employees[editEmployeeIdx].id
          : "E" + String(employees.length + 1).padStart(3, "0"),
      name,
      mobile: document.getElementById("e-mobile").value.trim(),
      dateofbirth: document.getElementById("e-dateofbirth").value,
      iqama: document.getElementById("e-iqama").value.trim(),
      company: document.getElementById("e-company").value.trim(),
      occupation: document.getElementById("e-occupation").value.trim(),
      contractstart: document.getElementById("e-contractstart").value,
      contractend: document.getElementById("e-contractend").value,
      iqamaexpiry: document.getElementById("e-iqamaexpiry").value,
      insurance: document.getElementById("e-insurance").value,
      ajeer: document.getElementById("e-ajeer").value,
      passport: document.getElementById("e-passport").value,
    };
    const query = editEmployeeIdx >= 0
      ? supabaseClient.from("employees").update(cleanRecord(rec)).eq("id", rec.id)
      : supabaseClient.from("employees").insert(cleanRecord(rec));
    const { error } = await query;
    if (error) {
      showDbError("Could not save employee to Supabase", error);
      return;
    }
    await refreshEmployees();
    closeModal("employee-modal");
    renderEmployees();
    renderDashboard();
  } catch (error) {
    showDbError("Could not save employee to Supabase", error);
  } finally {
    isSaving = false;
  }
}

// ══════════ VIOLATIONS TABLES ══════════
function renderViolationTable(kind) {
  const config = getViolationConfig(kind);
  const q = (document.getElementById(config.searchId)?.value || "").toLowerCase();
  const rows = config.load().filter(
    (v) =>
      (v.id || "").toLowerCase().includes(q) ||
      (v.violationno || "").toLowerCase().includes(q) ||
      (v.plate || "").toLowerCase().includes(q) ||
      (v.driver || "").toLowerCase().includes(q) ||
      (v.status || "").toLowerCase().includes(q)
  );

  if (rows.length === 0) {
    document.getElementById(config.tableId).innerHTML =
      `<div class="empty">No ${config.label.toLowerCase()} records found.</div>`;
    return;
  }

  let html = `<table><thead><tr>
    <th>ID</th>
    <th>Violation No.</th>
    <th>Plate</th>
    <th>Driver</th>
    <th>Date</th>
    <th>Amount</th>
    <th>Status</th>
    <th>Accident Details</th>
    <th>Actions</th>
  </tr></thead><tbody>`;

  const allRows = config.load();
  rows.forEach((v) => {
    const ri = allRows.findIndex((x) => x.id === v.id);
    html += `<tr>
      <td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${v.id || "—"}</span></td>
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${v.violationno || "—"}</td>
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${v.plate || "—"}</td>
      <td style="color:var(--text2);font-size:13px">${v.driver || "—"}</td>
      <td><div class="date-sub">${fmtDate(v.violationdate)}</div></td>
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${v.amount || "—"}</td>
      <td>${violationStatusBadge(v.status)}</td>
      <td style="color:var(--text2);font-size:13px">${v.notes || "—"}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="${config.editFn}(${ri})" title="Edit">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-icon del" onclick="${config.deleteFn}(${ri})" title="Delete">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  });
  html += "</tbody></table>";
  document.getElementById(config.tableId).innerHTML = html;
}

function violationStatusBadge(status) {
  if (status === "Paid") return '<span class="badge ok">Paid</span>';
  if (status === "Disputed") return '<span class="badge expiring">Disputed</span>';
  if (status === "Open") return '<span class="badge expired">Open</span>';
  return '<span class="badge na">N/A</span>';
}

function getViolationConfig(kind) {
  return kind === "maroor"
    ? {
      label: "Maroor Violation",
      modalId: "maroor-violation-modal",
      titleId: "maroor-violation-modal-title",
      tableId: "maroor-violations-table",
      searchId: "maroor-violation-search",
      prefix: "mrv",
      idPrefix: "MRV",
      table: "maroor_violations",
      load: loadMaroorViolations,
      refresh: refreshMaroorViolations,
      render: renderMaroorViolations,
      editFn: "editMaroorViolation",
      deleteFn: "deleteMaroorViolation",
    }
    : {
      label: "Efaa Violation",
      modalId: "efaa-violation-modal",
      titleId: "efaa-violation-modal-title",
      tableId: "efaa-violations-table",
      searchId: "efaa-violation-search",
      prefix: "efv",
      idPrefix: "EFV",
      table: "efaa_violations",
      load: loadEfaaViolations,
      refresh: refreshEfaaViolations,
      render: renderEfaaViolations,
      editFn: "editEfaaViolation",
      deleteFn: "deleteEfaaViolation",
    };
}

let editMaroorViolationIdx = -1;
let editEfaaViolationIdx = -1;

function openViolationModal(kind, idx = -1) {
  const config = getViolationConfig(kind);
  if (kind === "maroor") editMaroorViolationIdx = idx;
  else editEfaaViolationIdx = idx;

  const rows = config.load();
  const v = idx >= 0 ? rows[idx] : {};
  document.getElementById(config.titleId).textContent =
    idx >= 0 ? `Edit ${config.label}` : `Add ${config.label}`;
  document.getElementById(`${config.prefix}-id`).value = v.id || "";
  document.getElementById(`${config.prefix}-violationno`).value = v.violationno || "";
  document.getElementById(`${config.prefix}-plate`).value = v.plate || "";
  document.getElementById(`${config.prefix}-driver`).value = v.driver || "";
  document.getElementById(`${config.prefix}-violationdate`).value = v.violationdate || "";
  document.getElementById(`${config.prefix}-amount`).value = v.amount || "";
  document.getElementById(`${config.prefix}-status`).value = v.status || "";
  document.getElementById(`${config.prefix}-notes`).value = v.notes || "";
  document.getElementById(config.modalId).classList.add("open");
}

async function saveViolation(kind) {
  if (isSaving) return;
  const config = getViolationConfig(kind);
  const editIdx = kind === "maroor" ? editMaroorViolationIdx : editEfaaViolationIdx;
  const violationno = document.getElementById(`${config.prefix}-violationno`).value.trim();
  if (!violationno) {
    alert("Violation number is required.");
    return;
  }

  isSaving = true;
  try {
    const rows = config.load();
    const rec = {
      id:
        document.getElementById(`${config.prefix}-id`).value.trim() ||
        (editIdx >= 0
          ? rows[editIdx].id
          : config.idPrefix + String(rows.length + 1).padStart(3, "0")),
      violationno,
      plate: document.getElementById(`${config.prefix}-plate`).value.trim(),
      driver: document.getElementById(`${config.prefix}-driver`).value.trim(),
      violationdate: document.getElementById(`${config.prefix}-violationdate`).value,
      amount: document.getElementById(`${config.prefix}-amount`).value.trim(),
      status: document.getElementById(`${config.prefix}-status`).value,
      notes: document.getElementById(`${config.prefix}-notes`).value.trim(),
    };
    const query = editIdx >= 0
      ? supabaseClient.from(config.table).update(cleanRecord(rec)).eq("id", rec.id)
      : supabaseClient.from(config.table).insert(cleanRecord(rec));
    const { error } = await query;
    if (error) {
      showDbError(`Could not save ${config.label.toLowerCase()} to Supabase`, error);
      return;
    }
    await config.refresh();
    closeModal(config.modalId);
    config.render();
    renderDashboard();
  } catch (error) {
    showDbError(`Could not save ${config.label.toLowerCase()} to Supabase`, error);
  } finally {
    isSaving = false;
  }
}

async function deleteViolation(kind, idx) {
  const config = getViolationConfig(kind);
  if (!confirm(`Remove this ${config.label.toLowerCase()}?`)) return;
  const row = config.load()[idx];
  if (!row) return;
  const { error } = await supabaseClient.from(config.table).delete().eq("id", row.id);
  if (error) {
    showDbError(`Could not delete ${config.label.toLowerCase()} from Supabase`, error);
    return;
  }
  await config.refresh();
  config.render();
  renderDashboard();
}

function renderMaroorViolations() {
  renderViolationTable("maroor");
}
function renderEfaaViolations() {
  renderViolationTable("efaa");
}
function openMaroorViolationModal(idx = -1) {
  openViolationModal("maroor", idx);
}
function openEfaaViolationModal(idx = -1) {
  openViolationModal("efaa", idx);
}
function editMaroorViolation(idx) {
  openMaroorViolationModal(idx);
}
function editEfaaViolation(idx) {
  openEfaaViolationModal(idx);
}
function saveMaroorViolation() {
  saveViolation("maroor");
}
function saveEfaaViolation() {
  saveViolation("efaa");
}
function deleteMaroorViolation(idx) {
  deleteViolation("maroor", idx);
}
function deleteEfaaViolation(idx) {
  deleteViolation("efaa", idx);
}

// ══════════ INIT ══════════
async function initApp() {
  const now = new Date();
  document.getElementById("sidebar-date").textContent = now.toLocaleDateString(
    "en-GB",
    { day: "2-digit", month: "short", year: "numeric" }
  );
  await refreshDrivers();
  await refreshVehicles();
  await refreshEmployees();
  await refreshMaroorViolations();
  await refreshEfaaViolations();
  await seedDefaultsIfEmpty();
  renderDashboard();
}
