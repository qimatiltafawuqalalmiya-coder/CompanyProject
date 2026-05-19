const SUPABASE_URL = "https://hvhwsuzmrvmguqqljiqb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2aHdzdXptcnZtZ3VxcWxqaXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTM3MDYsImV4cCI6MjA5NDA2OTcwNn0._kRUs0cqkGMu2bffoE4mo9SOIAkdqOA0JRVCgONVf00";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
window.testSupabaseWrite = async function testSupabaseWrite() {
  if (!(await requireAuth())) return;
  const testId = "TEST-" + Date.now();
  const { data, error } = await supabaseClient
    .from("drivers")
    .insert({ id: testId, name: "Connection Test" })
    .select();

  console.log("Supabase write test:", { data, error });
  alert(error ? `Write test failed: ${error.message || error}` : `Write test worked: ${testId}`);
};

let currentSession = null;
let appInitialized = false;

function showLogin(errorMessage = "") {
  document.body.classList.remove("auth-checking");
  document.getElementById("app").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("login-pass").value = "";
  setLoginError(errorMessage);
}

async function showDashboard(session) {
  currentSession = session;
  document.body.classList.remove("auth-checking");
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("app").style.display = "block";
  setLoginError("");
  if (!appInitialized) {
    appInitialized = true;
    await initApp();
  } else {
    renderDashboard();
  }
}

function setLoginError(message) {
  const errorEl = document.getElementById("login-error");
  errorEl.textContent = message;
  errorEl.style.display = message ? "block" : "none";
}

function setLoginBusy(isBusy) {
  const button = document.getElementById("login-button");
  button.disabled = isBusy;
  button.textContent = isBusy ? "Signing in..." : "Sign In";
}

function formatAuthError(error) {
  const message = error?.message || "Could not sign in. Please try again.";
  if (/invalid login credentials/i.test(message)) {
    return "Invalid email or password.";
  }
  if (/email not confirmed/i.test(message)) {
    return "This email has not been confirmed yet. Contact your administrator.";
  }
  return message;
}

async function requireAuth() {
  if (currentSession) return true;
  const { data, error } = await supabaseClient.auth.getSession();
  if (error || !data.session) {
    currentSession = null;
    showLogin("Please sign in to continue.");
    return false;
  }
  currentSession = data.session;
  return true;
}

async function doLogin() {
  const email = document.getElementById("login-user").value.trim();
  const password = document.getElementById("login-pass").value;
  setLoginError("");
  if (!email || !password) {
    setLoginError("Enter your email and password.");
    return;
  }
  setLoginBusy(true);
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setLoginError(formatAuthError(error));
      return;
    }
    await showDashboard(data.session);
  } catch (error) {
    setLoginError(formatAuthError(error));
  } finally {
    setLoginBusy(false);
  }
}
document.getElementById("login-pass").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doLogin();
});
document.getElementById("login-user").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doLogin();
});

async function doLogout() {
  await supabaseClient.auth.signOut();
  currentSession = null;
  appInitialized = false;
  document.getElementById("app").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("login-user").value = "";
  document.getElementById("login-pass").value = "";
  setLoginError("");
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
function documentSummaryHtml(label, records, fields) {
  const invalid = records.filter((record) => worstStatus(record, fields) !== "ok").length;
  const valid = records.length - invalid;
  return `<div class="list-summary">
    <span>Total ${label}: <strong>${records.length}</strong></span>
    <span class="summary-valid">Valid: <strong>${valid}</strong></span>
    <span class="summary-invalid">Invalid: <strong>${invalid}</strong></span>
  </div>`;
}
function violationSummaryHtml(label, records) {
  const paid = records.filter((record) => record.status === "Paid").length;
  const unpaid = records.length - paid;
  return `<div class="list-summary">
    <span>Total ${label}: <strong>${records.length}</strong></span>
    <span class="summary-valid">Paid: <strong>${paid}</strong></span>
    <span class="summary-invalid">Unpaid/Open: <strong>${unpaid}</strong></span>
  </div>`;
}
function formatExportDate(value) {
  return value || "";
}
function mapRowsForExport(rows, columns) {
  return rows.map((row) =>
    Object.fromEntries(columns.map(([label, key]) => [label, formatExportDate(row[key])]))
  );
}
function downloadSheet(kind) {
  if (!window.XLSX) {
    alert("Spreadsheet export is still loading. Please try again in a moment.");
    return;
  }

  const configs = {
    drivers: {
      file: "drivers.xlsx",
      sheet: "Drivers",
      rows: loadDrivers(),
      columns: [
        ["Driver ID", "id"],
        ["Name", "name"],
        ["Iqama ID", "iqamaid"],
        ["Phone", "phone"],
        ["Nationality", "nationality"],
        ["Department", "dept"],
        ["Company", "company"],
        ["Registration Number", "registrationno"],
        ["Responsible", "responsible"],
        ["Driver Type", "drivertype"],
        ["Iqama Expiry", "iqama"],
        ["Work Permit Expiry", "workpermit"],
        ["Driving Licence Expiry", "license"],
        ["Insurance Expiry", "insurance"],
        ["Driver Card No.", "drivercardno"],
        ["Driver Card Expiry", "drivercard"],
        ["Ajeer Expiry", "ajeer"],
        ["Passport Expiry", "passport"],
      ],
    },
    vehicles: {
      file: "vehicles.xlsx",
      sheet: "Vehicles",
      rows: loadVehicles(),
      columns: [
        ["Vehicle ID", "id"],
        ["Plate Number", "plate"],
        ["Make / Model", "make"],
        ["Year", "year"],
        ["Color", "color"],
        ["Vehicle Type", "type"],
        ["Assigned Driver", "driver"],
        ["Insurance Expiry", "insurance"],
        ["Ishtamara Expiry", "ishtamara"],
        ["Tafweed Expiry", "tafweed"],
        ["Operation Card No.", "operationcardno"],
        ["Operation Card Expiry", "operationcardexpiry"],
        ["Fahas Expiry", "fahas"],
        ["GPS Status", "gps"],
      ],
    },
    employees: {
      file: "employees.xlsx",
      sheet: "Employees",
      rows: loadEmployees(),
      columns: [
        ["Employee ID", "id"],
        ["Name", "name"],
        ["Mobile Number", "mobile"],
        ["Date of Birth", "dateofbirth"],
        ["Iqama No.", "iqama"],
        ["Company", "company"],
        ["Nationality", "nationality"],
        ["Occupation", "occupation"],
        ["Date of Contract", "contractstart"],
        ["End of Contract", "contractend"],
        ["Iqama Expiry", "iqamaexpiry"],
        ["Medical Insurance Expiry", "insurance"],
        ["Ajeer Expiry", "ajeer"],
        ["Passport Expiry", "passport"],
      ],
    },
    maroor: {
      file: "maroor-violations.xlsx",
      sheet: "Maroor Violations",
      rows: loadMaroorViolations(),
      columns: [
        ["Violation ID", "id"],
        ["Violation No.", "violationno"],
        ["Plate Number", "plate"],
        ["Driver", "driver"],
        ["Reference Violation No.", "referenceno"],
        ["City", "city"],
        ["Violation Date", "violationdate"],
        ["Violation Time", "violationtime"],
        ["Amount", "amount"],
        ["Status", "status"],
        ["Date Paid", "paiddate"],
        ["Notes", "notes"],
      ],
    },
    efaa: {
      file: "efaa-violations.xlsx",
      sheet: "Efaa Violations",
      rows: loadEfaaViolations(),
      columns: [
        ["Violation ID", "id"],
        ["Violation No.", "violationno"],
        ["Plate Number", "plate"],
        ["Driver", "driver"],
        ["Reference Violation No.", "referenceno"],
        ["City", "city"],
        ["Violation Date", "violationdate"],
        ["Violation Time", "violationtime"],
        ["Amount", "amount"],
        ["Status", "status"],
        ["Date Paid", "paiddate"],
        ["Notes", "notes"],
      ],
    },
  };

  const config = configs[kind];
  if (!config) return;
  const worksheet = XLSX.utils.json_to_sheet(mapRowsForExport(config.rows, config.columns));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, config.sheet);
  XLSX.writeFile(workbook, config.file);
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtTime(t) {
  return t ? t.slice(0, 5) : "-";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function textValue(value) {
  return escapeHtml(value || "—");
}

function dateValue(value) {
  return escapeHtml(fmtDate(value));
}

function dateSortValue(value) {
  if (!value) return Number.POSITIVE_INFINITY;
  const time = new Date(value + "T00:00:00").getTime();
  return Number.isFinite(time) ? time : Number.POSITIVE_INFINITY;
}

function earliestDateValue(record, fields) {
  return Math.min(...fields.map((field) => dateSortValue(record[field])));
}

function compareText(a, b) {
  return String(a || "").localeCompare(String(b || ""), undefined, { numeric: true, sensitivity: "base" });
}

function amountValue(value) {
  const parsed = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function sortRecords(rows, sortValue, dateFields = []) {
  const sorted = [...rows];
  const allDateFields = new Set([
    "iqama", "workpermit", "license", "insurance", "drivercard", "ajeer", "passport", "medical", "visa",
    "ishtamara", "tafweed", "operationcardexpiry", "fahas",
    "dateofbirth", "contractstart", "contractend", "iqamaexpiry",
    "violationdate", "paiddate"
  ]);

  sorted.sort((a, b) => {
    if (sortValue === "date-desc") {
      const aDate = earliestDateValue(a, dateFields);
      const bDate = earliestDateValue(b, dateFields);
      if (!Number.isFinite(aDate)) return 1;
      if (!Number.isFinite(bDate)) return -1;
      return bDate - aDate;
    }
    if (sortValue === "date-asc") {
      const aDate = earliestDateValue(a, dateFields);
      const bDate = earliestDateValue(b, dateFields);
      if (!Number.isFinite(aDate)) return 1;
      if (!Number.isFinite(bDate)) return -1;
      return aDate - bDate;
    }

    let field = sortValue;
    let dir = "asc";
    const lastDash = sortValue.lastIndexOf("-");
    if (lastDash !== -1) {
      const potentialDir = sortValue.slice(lastDash + 1);
      if (potentialDir === "asc" || potentialDir === "desc") {
        field = sortValue.slice(0, lastDash);
        dir = potentialDir;
      }
    }

    if (allDateFields.has(field)) {
      const aVal = dateSortValue(a[field]);
      const bVal = dateSortValue(b[field]);
      if (aVal === bVal) return 0;
      return dir === "asc" ? aVal - bVal : bVal - aVal;
    } else {
      const aVal = a[field];
      const bVal = b[field];
      return dir === "asc" ? compareText(aVal, bVal) : compareText(bVal, aVal);
    }
  });
  return sorted;
}

function sortViolations(rows, sortValue) {
  const sorted = [...rows];
  const allDateFields = new Set(["violationdate", "paiddate"]);

  sorted.sort((a, b) => {
    if (sortValue === "date-desc") {
      const aDate = dateSortValue(a.violationdate);
      const bDate = dateSortValue(b.violationdate);
      if (!Number.isFinite(aDate)) return 1;
      if (!Number.isFinite(bDate)) return -1;
      return bDate - aDate;
    }
    if (sortValue === "date-asc") {
      const aDate = dateSortValue(a.violationdate);
      const bDate = dateSortValue(b.violationdate);
      if (!Number.isFinite(aDate)) return 1;
      if (!Number.isFinite(bDate)) return -1;
      return aDate - bDate;
    }
    if (sortValue === "amount-desc") return amountValue(b.amount) - amountValue(a.amount);
    if (sortValue === "amount-asc") return amountValue(a.amount) - amountValue(b.amount);

    let field = sortValue;
    let dir = "asc";
    const lastDash = sortValue.lastIndexOf("-");
    if (lastDash !== -1) {
      const potentialDir = sortValue.slice(lastDash + 1);
      if (potentialDir === "asc" || potentialDir === "desc") {
        field = sortValue.slice(0, lastDash);
        dir = potentialDir;
      }
    } else {
      if (field === "violationdate" || field === "amount" || field === "paiddate") {
        dir = "desc";
      }
    }

    if (field === "amount") {
      return dir === "asc" ? amountValue(a.amount) - amountValue(b.amount) : amountValue(b.amount) - amountValue(a.amount);
    }
    if (allDateFields.has(field)) {
      const aVal = dateSortValue(a[field]);
      const bVal = dateSortValue(b[field]);
      if (aVal === bVal) return 0;
      return dir === "asc" ? aVal - bVal : bVal - aVal;
    } else {
      const aVal = a[field];
      const bVal = b[field];
      return dir === "asc" ? compareText(aVal, bVal) : compareText(bVal, aVal);
    }
  });
  return sorted;
}

function detailFieldsHtml(fields) {
  return fields
    .map(([label, value]) => `<div class="detail-field">
      <div class="detail-label">${escapeHtml(label)}</div>
      <div class="detail-value">${value}</div>
    </div>`)
    .join("");
}

function detailTableHtml(title, rows, columns, emptyText) {
  if (!rows.length) {
    return `<div class="detail-section">
      <div class="detail-section-title">${escapeHtml(title)}</div>
      <div class="detail-empty">${escapeHtml(emptyText)}</div>
    </div>`;
  }

  return `<div class="detail-section">
    <div class="detail-section-title">${escapeHtml(title)}</div>
    <div class="detail-mini-table-wrap">
      <table class="detail-mini-table">
        <thead><tr>${columns.map(([label]) => `<th>${escapeHtml(label)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows
            .map(
              (row) => `<tr>${columns
                .map(([, render]) => `<td>${render(row)}</td>`)
                .join("")}</tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </div>`;
}

function getDetailModal() {
  let modal = document.getElementById("record-detail-modal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "record-detail-modal";
  modal.className = "modal-overlay";
  modal.innerHTML = `<div class="modal detail-modal">
    <div class="modal-header">
      <div>
        <div class="modal-title" id="record-detail-title"></div>
        <div class="detail-subtitle" id="record-detail-subtitle"></div>
      </div>
      <button class="modal-close" onclick="closeModal('record-detail-modal')">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
    <div id="record-detail-body"></div>
    <div class="detail-actions" id="record-detail-actions"></div>
  </div>`;
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });
  document.body.appendChild(modal);
  return modal;
}

function openRecordDetail(title, subtitle, bodyHtml, actionsHtml = "") {
  const modal = getDetailModal();
  document.getElementById("record-detail-title").textContent = title;
  document.getElementById("record-detail-subtitle").textContent = subtitle || "";
  document.getElementById("record-detail-body").innerHTML = bodyHtml;
  document.getElementById("record-detail-actions").innerHTML = actionsHtml;
  modal.classList.add("open");
}

function findDriverByName(name) {
  const normalized = (name || "").trim().toLowerCase();
  if (!normalized) return null;
  return loadDrivers().find((driver) => (driver.name || "").trim().toLowerCase() === normalized) || null;
}

function printDetail() {
  const title = document.getElementById("record-detail-title").textContent;
  const subtitle = document.getElementById("record-detail-subtitle").textContent;
  const body = document.getElementById("record-detail-body").innerHTML;

  const printWindow = window.open("", "_blank", "width=850,height=900");
  if (!printWindow) {
    alert("Please allow popups to print or export details.");
    return;
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 30px;
            color: #1a1915;
            background: #ffffff;
            line-height: 1.4;
          }
          .header {
            margin-bottom: 24px;
            border-bottom: 2px solid #1a3a2a;
            padding-bottom: 12px;
          }
          .title {
            font-size: 22px;
            font-weight: 600;
            color: #1a3a2a;
          }
          .subtitle {
            font-size: 13px;
            color: #6b6960;
            margin-top: 4px;
          }
          .detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 24px;
          }
          .detail-field {
            border: 1px solid #e8e6df;
            border-radius: 8px;
            background: #f9f8f5;
            padding: 10px 12px;
          }
          .detail-label {
            color: #9e9b91;
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: .05em;
            margin-bottom: 4px;
          }
          .detail-value {
            font-size: 13px;
            color: #1a1915;
            font-weight: 500;
            word-break: break-word;
          }
          .detail-section {
            margin-top: 24px;
          }
          .detail-section-title {
            font-size: 12px;
            font-weight: 600;
            color: #1a3a2a;
            border-bottom: 1px solid #e8e6df;
            padding-bottom: 4px;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: .06em;
          }
          .detail-mini-table-wrap {
            border: 1px solid #e8e6df;
            border-radius: 8px;
            overflow: hidden;
          }
          .detail-mini-table {
            width: 100%;
            border-collapse: collapse;
          }
          .detail-mini-table th {
            background: #f9f8f5;
            color: #9e9b91;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            padding: 8px 10px;
            border-bottom: 1px solid #e8e6df;
            text-align: left;
            letter-spacing: .05em;
          }
          .detail-mini-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #e8e6df;
            font-size: 12px;
          }
          .detail-mini-table tr:last-child td {
            border-bottom: none;
          }
          .detail-empty {
            color: #9e9b91;
            font-style: italic;
            padding: 10px;
            border: 1px dashed #d4d1c8;
            border-radius: 8px;
            background: #f9f8f5;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${title}</div>
          <div class="subtitle">${subtitle}</div>
        </div>
        ${body}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

function downloadDetailPDF() {
  printDetail();
}

function downloadDetailExcel() {
  const title = document.getElementById("record-detail-title").textContent;
  const subtitle = document.getElementById("record-detail-subtitle").textContent;

  const data = [];
  data.push([title]);
  if (subtitle) data.push([subtitle]);
  data.push([]);
  data.push(["Field", "Value"]);

  const fields = document.querySelectorAll("#record-detail-body .detail-field");
  fields.forEach(field => {
    const labelEl = field.querySelector(".detail-label");
    const valEl = field.querySelector(".detail-value");
    if (labelEl && valEl) {
      data.push([labelEl.textContent.trim(), valEl.textContent.trim()]);
    }
  });

  const sections = document.querySelectorAll("#record-detail-body .detail-section");
  sections.forEach(sec => {
    const secTitleEl = sec.querySelector(".detail-section-title");
    const secTitle = secTitleEl ? secTitleEl.textContent.trim() : "Section";
    data.push([]);
    data.push([secTitle]);

    const table = sec.querySelector("table");
    if (table) {
      const headers = [];
      table.querySelectorAll("th").forEach(th => headers.push(th.textContent.trim()));
      data.push(headers);

      table.querySelectorAll("tbody tr").forEach(tr => {
        const row = [];
        tr.querySelectorAll("td").forEach(td => row.push(td.textContent.trim()));
        data.push(row);
      });
    } else {
      const emptyEl = sec.querySelector(".detail-empty");
      const empty = emptyEl ? emptyEl.textContent.trim() : "No records found.";
      data.push([empty]);
    }
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Details");
  XLSX.writeFile(wb, `${title.replace(/[^a-zA-Z0-9]/g, "_")}_Details.xlsx`);
}

function detailActionButtons(editCall) {
  return `
    <div style="display: flex; gap: 8px; margin-right: auto; flex-wrap: wrap;">
      <button class="btn-export" onclick="downloadDetailPDF()" style="padding: 7px 11px; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 14px; height: 14px;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h4v2h-4v2h4v2H9V7h6v2z"/></svg> PDF
      </button>
      <button class="btn-export" onclick="downloadDetailExcel()" style="padding: 7px 11px; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 14px; height: 14px;"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 12H9v-2h3v-2H9V9h3V7H7v10h5v-2z"/></svg> Excel
      </button>
      <button class="btn-export" onclick="printDetail()" style="padding: 7px 11px; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 14px; height: 14px;"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg> Print
      </button>
    </div>
    <button class="btn-cancel" onclick="closeModal('record-detail-modal')">Cancel</button>
    <button class="btn-save" onclick="closeModal('record-detail-modal'); ${editCall}">Edit</button>`;
}

function showDriverDetails(idx) {
  const driver = loadDrivers()[idx];
  if (!driver) return;

  const driverName = (driver.name || "").trim().toLowerCase();
  const assignedVehicles = loadVehicles().filter(
    (vehicle) => (vehicle.driver || "").trim().toLowerCase() === driverName
  );
  const relatedMaroor = loadMaroorViolations().filter(
    (violation) => (violation.driver || "").trim().toLowerCase() === driverName && violation.status !== "Paid"
  );
  const relatedEfaa = loadEfaaViolations().filter(
    (violation) => (violation.driver || "").trim().toLowerCase() === driverName && violation.status !== "Paid"
  );

  openRecordDetail(
    driver.name || "Driver Details",
    `${driver.id || "No ID"} · ${driver.drivertype || "Driver"}`,
    `<div class="detail-grid">${detailFieldsHtml([
      ["Driver ID", textValue(driver.id)],
      ["Full Name", textValue(driver.name)],
      ["Iqama ID No.", textValue(driver.iqamaid)],
      ["Phone Number", textValue(driver.phone)],
      ["Nationality", textValue(driver.nationality)],
      ["Department", textValue(driver.dept)],
      ["Company Name", textValue(driver.company)],
      ["Registration Number", textValue(driver.registrationno)],
      ["Responsible", textValue(driver.responsible)],
      ["Driver Type", textValue(driver.drivertype)],
      ["Iqama Expiry", dateValue(driver.iqama)],
      ["Work Permit Expiry", dateValue(driver.workpermit)],
      ["Driving Licence Expiry", dateValue(driver.license)],
      ["Insurance Expiry", dateValue(driver.insurance)],
      ["Driver Card No.", textValue(driver.drivercardno)],
      ["Driver Card Expiry", dateValue(driver.drivercard)],
      ["Ajeer Expiry", dateValue(driver.ajeer)],
      ["Passport Expiry", dateValue(driver.passport)],
    ])}</div>
    ${detailTableHtml("Assigned Vehicles", assignedVehicles, [
      ["ID", (vehicle) => textValue(vehicle.id)],
      ["Plate", (vehicle) => textValue(vehicle.plate)],
      ["Make / Model", (vehicle) => textValue(vehicle.make)],
      ["Type", (vehicle) => textValue(vehicle.type)],
      ["GPS", (vehicle) => textValue(vehicle.gps)],
    ], "No vehicles assigned to this driver.")}
    ${detailTableHtml("Maroor Violations", relatedMaroor, [
      ["No.", (violation) => textValue(violation.violationno)],
      ["Plate", (violation) => textValue(violation.plate)],
      ["Date", (violation) => dateValue(violation.violationdate)],
      ["Amount", (violation) => textValue(violation.amount)],
      ["Status", (violation) => textValue(violation.status)],
    ], "No Maroor violations for this driver.")}
    ${detailTableHtml("Efaa Violations", relatedEfaa, [
      ["No.", (violation) => textValue(violation.violationno)],
      ["Plate", (violation) => textValue(violation.plate)],
      ["Date", (violation) => dateValue(violation.violationdate)],
      ["Amount", (violation) => textValue(violation.amount)],
      ["Status", (violation) => textValue(violation.status)],
    ], "No Efaa violations for this driver.")}`,
    detailActionButtons(`editDriver(${idx})`)
  );
}

function showVehicleDetails(idx) {
  const vehicle = loadVehicles()[idx];
  if (!vehicle) return;
  const driver = findDriverByName(vehicle.driver);
  const plate = (vehicle.plate || "").trim().toLowerCase();
  const relatedMaroor = loadMaroorViolations().filter(
    (violation) => (violation.plate || "").trim().toLowerCase() === plate && violation.status !== "Paid"
  );
  const relatedEfaa = loadEfaaViolations().filter(
    (violation) => (violation.plate || "").trim().toLowerCase() === plate && violation.status !== "Paid"
  );

  openRecordDetail(
    vehicle.plate || "Vehicle Details",
    `${vehicle.id || "No ID"} · ${vehicle.make || "Vehicle"}`,
    `<div class="detail-grid">${detailFieldsHtml([
      ["Vehicle ID", textValue(vehicle.id)],
      ["Plate Number", textValue(vehicle.plate)],
      ["Make / Model", textValue(vehicle.make)],
      ["Year", textValue(vehicle.year)],
      ["Color", textValue(vehicle.color)],
      ["Vehicle Type", textValue(vehicle.type)],
      ["Car Type", textValue(vehicle.cartype)],
      ["Assigned Driver", textValue(vehicle.driver)],
      ["Insurance Expiry", dateValue(vehicle.insurance)],
      ["Ishtamara Expiry", dateValue(vehicle.ishtamara)],
      ["Tafweed Expiry", dateValue(vehicle.tafweed)],
      ["Operation Card No.", textValue(vehicle.operationcardno)],
      ["Operation Card Expiry", dateValue(vehicle.operationcardexpiry)],
      ["Fahas Expiry", dateValue(vehicle.fahas)],
      ["GPS Status", textValue(vehicle.gps)],
    ])}</div>
    ${driver ? `<div class="detail-section">
      <div class="detail-section-title">Assigned Driver Data</div>
      <div class="detail-grid">${detailFieldsHtml([
        ["Driver ID", textValue(driver.id)],
        ["Full Name", textValue(driver.name)],
        ["Iqama ID No.", textValue(driver.iqamaid)],
        ["Phone Number", textValue(driver.phone)],
        ["Nationality", textValue(driver.nationality)],
        ["Company", textValue(driver.company)],
        ["Driver Type", textValue(driver.drivertype)],
        ["Licence Expiry", dateValue(driver.license)],
      ])}</div>
    </div>` : `<div class="detail-section"><div class="detail-section-title">Assigned Driver Data</div><div class="detail-empty">No matching driver record found.</div></div>`}
    ${detailTableHtml("Maroor Violations", relatedMaroor, [
      ["No.", (violation) => textValue(violation.violationno)],
      ["Driver", (violation) => textValue(violation.driver)],
      ["Date", (violation) => dateValue(violation.violationdate)],
      ["Amount", (violation) => textValue(violation.amount)],
      ["Status", (violation) => textValue(violation.status)],
    ], "No Maroor violations for this vehicle.")}
    ${detailTableHtml("Efaa Violations", relatedEfaa, [
      ["No.", (violation) => textValue(violation.violationno)],
      ["Driver", (violation) => textValue(violation.driver)],
      ["Date", (violation) => dateValue(violation.violationdate)],
      ["Amount", (violation) => textValue(violation.amount)],
      ["Status", (violation) => textValue(violation.status)],
    ], "No Efaa violations for this vehicle.")}`,
    detailActionButtons(`editVehicle(${idx})`)
  );
}

function showEmployeeDetails(idx) {
  const employee = loadEmployees()[idx];
  if (!employee) return;

  openRecordDetail(
    employee.name || "Employee Details",
    `${employee.id || "No ID"} · ${employee.occupation || "Employee"}`,
    `<div class="detail-grid">${detailFieldsHtml([
      ["Employee ID", textValue(employee.id)],
      ["Full Name", textValue(employee.name)],
      ["Mobile Number", textValue(employee.mobile)],
      ["Date of Birth", dateValue(employee.dateofbirth)],
      ["Iqama No.", textValue(employee.iqama)],
      ["Company", textValue(employee.company)],
      ["Nationality", textValue(employee.nationality)],
      ["Occupation", textValue(employee.occupation)],
      ["Date of Contract", dateValue(employee.contractstart)],
      ["End of Contract", dateValue(employee.contractend)],
      ["Iqama Expiry", dateValue(employee.iqamaexpiry)],
      ["Medical Insurance Expiry", dateValue(employee.insurance)],
      ["Ajeer Expiry", dateValue(employee.ajeer)],
      ["Passport Expiry", dateValue(employee.passport)],
    ])}</div>`,
    detailActionButtons(`editEmployee(${idx})`)
  );
}

const DRIVER_FIELDS = [
  "iqama",
  "workpermit",
  "license",
  "insurance",
  "drivercard",
  "ajeer",
  "passport",
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
async function showPage(name) {
  if (!(await requireAuth())) return;
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
  if (name === "dashboard") { renderDashboard(); }
  else if (name === "drivers") { if (driversCache.length === 0) { refreshDrivers().then(() => renderDrivers()); } else { renderDrivers(); } }
  else if (name === "vehicles") { if (vehiclesCache.length === 0) { refreshVehicles().then(() => renderVehicles()); } else { renderVehicles(); } }
  else if (name === "employees") { if (employeesCache.length === 0) { refreshEmployees().then(() => renderEmployees()); } else { renderEmployees(); } }
  else if (name === "maroor-violations") { if (maroorViolationsCache.length === 0) { refreshMaroorViolations().then(() => renderMaroorViolations()); } else { renderMaroorViolations(); } }
  else if (name === "efaa-violations") { if (efaaViolationsCache.length === 0) { refreshEfaaViolations().then(() => renderEfaaViolations()); } else { renderEfaaViolations(); } }
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
  const typeFilter = (document.getElementById("driver-type-filter")?.value || "").toLowerCase();
  const sortValue = document.getElementById("driver-sort")?.value || "date-asc";
  const drivers = sortRecords(loadDrivers().filter(
    (d) =>
      ((d.name || "").toLowerCase().includes(q) ||
      (d.id || "").toLowerCase().includes(q) ||
      (d.iqamaid || "").includes(q) ||
      (d.drivercardno || "").toLowerCase().includes(q) ||
      (d.nationality || "").toLowerCase().includes(q) ||
      (d.dept || "").toLowerCase().includes(q) ||
      (d.company || "").toLowerCase().includes(q) ||
      (d.registrationno || "").toLowerCase().includes(q) ||
      (d.responsible || "").toLowerCase().includes(q) ||
      (d.drivertype || "").toLowerCase().includes(q)) &&
      (!typeFilter || (d.drivertype || "").toLowerCase() === typeFilter || (typeFilter === "service" && (d.drivertype || "").toLowerCase() === "services"))
  ), sortValue, DRIVER_FIELDS);
  if (drivers.length === 0) {
    document.getElementById("drivers-table").innerHTML =
      '<div class="empty">No drivers found.</div>' +
      documentSummaryHtml("Drivers", loadDrivers(), DRIVER_FIELDS);
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
    html += `<tr class="${rc} clickable-row" onclick="showDriverDetails(${ri})" title="View driver details">
      <td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${d.id || "—"
      }</span></td>
      <td>
        <div style="font-weight:500">${d.name}</div>
        <div style="font-size:11px;color:var(--text3)">Company: ${d.company || "-"} | Reg: ${d.registrationno || "-"} | Responsible: ${d.responsible || "-"}</div>
        <div style="font-size:11px;color:var(--text3)">Type: ${d.drivertype || "-"}</div>
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
      ${["drivercard", "ajeer", "passport"].map((f) => {
        const days = daysUntil(d[f]);
        return `<td>${statusLabel(days)}<div class="date-sub">${fmtDate(
          d[f]
        )}</div></td>`;
      }).join("")}
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="event.stopPropagation(); editDriver(${ri})" title="Edit">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-icon del" onclick="event.stopPropagation(); deleteDriver(${ri})" title="Delete">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  });
  html += "</tbody></table>";
  document.getElementById("drivers-table").innerHTML =
    html + documentSummaryHtml("Drivers", loadDrivers(), DRIVER_FIELDS);
}

// ══════════ VEHICLES TABLE ══════════
function renderVehicles() {
  const q = (
    document.getElementById("vehicle-search")?.value || ""
  ).toLowerCase();
  const sortValue = document.getElementById("vehicle-sort")?.value || "date-asc";
  const carTypeFilter = document.getElementById("vehicle-cartype-filter")?.value || "";

  const filteredVehicles = loadVehicles().filter((v) => {
    const matchesSearch =
      (v.plate || "").toLowerCase().includes(q) ||
      (v.id || "").toLowerCase().includes(q) ||
      (v.make || "").toLowerCase().includes(q) ||
      (v.operationcardno || "").toLowerCase().includes(q) ||
      (v.driver || "").toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (carTypeFilter && (v.cartype || "") !== carTypeFilter) {
      return false;
    }

    return true;
  });

  const vehicles = sortRecords(filteredVehicles, sortValue, VEHICLE_FIELDS);
  if (vehicles.length === 0) {
    document.getElementById("vehicles-table").innerHTML =
      '<div class="empty">No vehicles found.</div>' +
      documentSummaryHtml("Vehicles", loadVehicles(), VEHICLE_FIELDS);
    return;
  }
  let html = `<table><thead><tr>
    <th>ID</th>
    <th>Vehicle</th>
    <th>Car Type</th>
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
    html += `<tr class="${rc} clickable-row" onclick="showVehicleDetails(${ri})" title="View vehicle details">
      <td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${v.id || "—"
      }</span></td>
      <td>
        <div style="font-weight:500">${v.plate}</div>
        <div style="font-size:11px;color:var(--text3)">${v.make || ""} ${v.year ? "· " + v.year : ""
      } ${v.color ? "· " + v.color : ""}</div>
      </td>
      <td style="color:var(--text2);font-size:13px">${v.cartype || "—"}</td>
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
          <button class="btn-icon edit" onclick="event.stopPropagation(); editVehicle(${ri})" title="Edit">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-icon del" onclick="event.stopPropagation(); deleteVehicle(${ri})" title="Delete">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  });
  html += "</tbody></table>";
  document.getElementById("vehicles-table").innerHTML =
    html + documentSummaryHtml("Vehicles", loadVehicles(), VEHICLE_FIELDS);
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
  document.getElementById("d-company").value = d.company || "";
  document.getElementById("d-registrationno").value = d.registrationno || "";
  document.getElementById("d-responsible").value = d.responsible || "";
  document.getElementById("d-drivertype").value = d.drivertype || "";
  document.getElementById("d-iqama").value = d.iqama || "";
  document.getElementById("d-workpermit").value = d.workpermit || "";
  document.getElementById("d-license").value = d.license || "";
  document.getElementById("d-insurance").value = d.insurance || "";
  document.getElementById("d-drivercardno").value = d.drivercardno || "";
  document.getElementById("d-drivercard").value = d.drivercard || "";
  document.getElementById("d-ajeer").value = d.ajeer || "";
  document.getElementById("d-passport").value = d.passport || "";
  document.getElementById("driver-modal").classList.add("open");
}
function editDriver(idx) {
  openDriverModal(idx);
}
async function deleteDriver(idx) {
  if (!(await requireAuth())) return;
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
  if (!(await requireAuth())) return;
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
      company: document.getElementById("d-company").value.trim(),
      registrationno: document.getElementById("d-registrationno").value.trim(),
      responsible: document.getElementById("d-responsible").value.trim(),
      drivertype: document.getElementById("d-drivertype").value,
      iqama: document.getElementById("d-iqama").value,
      workpermit: document.getElementById("d-workpermit").value,
      license: document.getElementById("d-license").value,
      insurance: document.getElementById("d-insurance").value,
      drivercardno: document.getElementById("d-drivercardno").value.trim(),
      drivercard: document.getElementById("d-drivercard").value,
      ajeer: document.getElementById("d-ajeer").value,
      passport: document.getElementById("d-passport").value,
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
function populateAssignedDriverOptions(selectedDriver = "") {
  const select = document.getElementById("v-driver");
  const names = [...new Set(loadDrivers().map((driver) => driver.name).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
  select.innerHTML = "";
  select.append(new Option("Select driver", ""));
  names.forEach((name) => select.append(new Option(name, name)));
  if (selectedDriver && !names.includes(selectedDriver)) {
    select.append(new Option(selectedDriver, selectedDriver));
  }
  select.value = selectedDriver || "";
}
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
  document.getElementById("v-cartype").value = v.cartype || "";
  populateAssignedDriverOptions(v.driver || "");
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
  if (!(await requireAuth())) return;
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
  if (!(await requireAuth())) return;
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
      cartype: document.getElementById("v-cartype").value,
      driver: document.getElementById("v-driver").value,
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
  const sortValue = document.getElementById("employee-sort")?.value || "date-asc";
  const natFilter = document.getElementById("employee-nat-filter")?.value || "";

  const filteredEmployees = loadEmployees().filter((e) => {
    const matchesSearch =
      (e.id || "").toLowerCase().includes(q) ||
      (e.name || "").toLowerCase().includes(q) ||
      (e.iqama || "").includes(q) ||
      (e.nationality || "").toLowerCase().includes(q) ||
      (e.occupation || "").toLowerCase().includes(q) ||
      (e.company || "").toLowerCase().includes(q) ||
      (e.mobile || "").includes(q);

    if (!matchesSearch) return false;

    if (natFilter) {
      const isSaudi = (e.nationality || "").trim().toLowerCase() === "saudi";
      if (natFilter === "saudi") {
        return isSaudi;
      } else if (natFilter === "non-saudi") {
        return !isSaudi;
      }
    }

    return true;
  });

  const employees = sortRecords(filteredEmployees, sortValue, EMPLOYEE_FIELDS);
  let html = `<table><thead><tr>
    <th>Employee ID</th>
    <th>Name</th>
    <th>Mobile Number</th>
    <th>Date of Birth</th>
    <th>Iqama No.</th>
    <th>Company</th><th>Nationality</th>
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
    html += `<tr><td colspan="15" style="text-align:center;color:var(--text3);padding:32px">No employees found.</td></tr>`;
    html += "</tbody></table>";
    document.getElementById("employees-table").innerHTML =
      html + documentSummaryHtml("Employees", loadEmployees(), EMPLOYEE_FIELDS);
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
    html += `<tr class="${rc} clickable-row" onclick="showEmployeeDetails(${ri})" title="View employee details">
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${e.id || "â€”"}</td>
      <td>
        <div style="font-weight:500">${e.name}</div>
        <div style="font-size:11px;color:var(--text3)">${e.occupation || ""}</div>
      </td>
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${e.mobile || "—"}</td>
      <td><div class="date-sub">${fmtDate(e.dateofbirth)}</div></td>
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${e.iqama || "—"}</td>
      <td style="color:var(--text2);font-size:13px">${e.company || "—"}</td><td style="color:var(--text2);font-size:13px">${e.nationality || "—"}</td>
      <td style="color:var(--text2);font-size:13px">${e.occupation || "—"}</td>
      <td><div class="date-sub">${fmtDate(e.contractstart)}</div></td>
      <td>${statusLabel(daysUntil(e.contractend))}<div class="date-sub">${fmtDate(e.contractend)}</div></td>
      <td>${statusLabel(daysUntil(e.iqamaexpiry))}<div class="date-sub">${fmtDate(e.iqamaexpiry)}</div></td>
      <td>${statusLabel(daysUntil(e.insurance))}<div class="date-sub">${fmtDate(e.insurance)}</div></td>
      <td>${statusLabel(daysUntil(e.ajeer))}<div class="date-sub">${fmtDate(e.ajeer)}</div></td>
      <td>${statusLabel(daysUntil(e.passport))}<div class="date-sub">${fmtDate(e.passport)}</div></td>
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="event.stopPropagation(); editEmployee(${ri})" title="Edit">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-icon del" onclick="event.stopPropagation(); deleteEmployee(${ri})" title="Delete">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  });
  html += "</tbody></table>";
  document.getElementById("employees-table").innerHTML =
    html + documentSummaryHtml("Employees", loadEmployees(), EMPLOYEE_FIELDS);
}

// ══════════ EMPLOYEE MODAL ══════════
let editEmployeeIdx = -1;
function openEmployeeModal(idx = -1) {
  editEmployeeIdx = idx;
  const employees = loadEmployees();
  const e = idx >= 0 ? employees[idx] : {};
  document.getElementById("employee-modal-title").textContent =
    idx >= 0 ? "Edit Employee" : "Add Employee";
  document.getElementById("e-id").value =
    e.id || "E" + String(employees.length + 1).padStart(3, "0");
  document.getElementById("e-name").value = e.name || "";
  document.getElementById("e-mobile").value = e.mobile || "";
  document.getElementById("e-dateofbirth").value = e.dateofbirth || "";
  document.getElementById("e-iqama").value = e.iqama || "";
  document.getElementById("e-company").value = e.company || "";
  document.getElementById("e-nationality").value = e.nationality || "";
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
  if (!(await requireAuth())) return;
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
  if (!(await requireAuth())) return;
  if (isSaving) return;
  const name = document.getElementById("e-name").value.trim();
  const id = document.getElementById("e-id").value.trim();
  if (!id) {
    alert("Employee ID is required.");
    return;
  }
  if (!name) {
    alert("Employee name is required.");
    return;
  }
  isSaving = true;
  try {
    const employees = loadEmployees();
    const existingIdx = employees.findIndex((employee) => employee.id === id);
    if (existingIdx >= 0 && existingIdx !== editEmployeeIdx) {
      alert("Employee ID must be unique.");
      return;
    }
    const previousId = editEmployeeIdx >= 0 ? employees[editEmployeeIdx].id : id;
    const rec = {
      id,
      name,
      mobile: document.getElementById("e-mobile").value.trim(),
      dateofbirth: document.getElementById("e-dateofbirth").value,
      iqama: document.getElementById("e-iqama").value.trim(),
      company: document.getElementById("e-company").value.trim(),
      nationality: document.getElementById("e-nationality").value.trim(),
      occupation: document.getElementById("e-occupation").value.trim(),
      contractstart: document.getElementById("e-contractstart").value,
      contractend: document.getElementById("e-contractend").value,
      iqamaexpiry: document.getElementById("e-iqamaexpiry").value,
      insurance: document.getElementById("e-insurance").value,
      ajeer: document.getElementById("e-ajeer").value,
      passport: document.getElementById("e-passport").value,
    };
    const query = editEmployeeIdx >= 0
      ? supabaseClient.from("employees").update(cleanRecord(rec)).eq("id", previousId)
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
  const sortValue = document.getElementById(config.sortId)?.value || "date-desc";
  const rows = sortViolations(config.load().filter(
    (v) =>
      (v.id || "").toLowerCase().includes(q) ||
      (v.violationno || "").toLowerCase().includes(q) ||
      (v.referenceno || "").toLowerCase().includes(q) ||
      (v.plate || "").toLowerCase().includes(q) ||
      (v.driver || "").toLowerCase().includes(q) ||
      (v.city || "").toLowerCase().includes(q) ||
      (v.status || "").toLowerCase().includes(q)
  ), sortValue);

  if (rows.length === 0) {
    document.getElementById(config.tableId).innerHTML =
      `<div class="empty">No ${config.label.toLowerCase()} records found.</div>` +
      violationSummaryHtml(config.label, config.load());
    return;
  }

  let html = `<table><thead><tr>
    <th>ID</th>
    <th>Violation No.</th>
    <th>Plate</th>
    <th>Driver</th>
    <th>Reference No.</th>
    <th>City</th>
    <th>Date</th>
    <th>Time</th>
    <th>Amount</th>
    <th>Status</th>
    <th>Date Paid</th>
    <th>Notes</th>
    <th>Actions</th>
  </tr></thead><tbody>`;

  const allRows = config.load();
  rows.forEach((v) => {
    const ri = allRows.findIndex((x) => x === v);
    html += `<tr class="clickable-row" onclick="showViolationDetails('${kind}', ${ri})" title="View ${config.label.toLowerCase()} details">
      <td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${v.id || "—"}</span></td>
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${v.violationno || "—"}</td>
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${v.plate || "—"}</td>
      <td style="color:var(--text2);font-size:13px">${v.driver || "—"}</td>
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${v.referenceno || "-"}</td>
      <td style="color:var(--text2);font-size:13px">${v.city || "-"}</td>
      <td><div class="date-sub">${fmtDate(v.violationdate)}</div></td>
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${fmtTime(v.violationtime)}</td>
      <td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--text2)">${v.amount || "—"}</td>
      <td>${violationStatusBadge(v.status)}</td>
      <td><div class="date-sub">${v.status === "Paid" ? fmtDate(v.paiddate) : "-"}</div></td>
      <td style="color:var(--text2);font-size:13px">${v.notes || "—"}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon edit" onclick="event.stopPropagation(); ${config.editFn}(${ri})" title="Edit">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-icon del" onclick="event.stopPropagation(); ${config.deleteFn}(${ri})" title="Delete">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </td>
    </tr>`;
  });
  html += "</tbody></table>";
  document.getElementById(config.tableId).innerHTML =
    html + violationSummaryHtml(config.label, config.load());
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
      sortId: "maroor-violation-sort",
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
      sortId: "efaa-violation-sort",
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

function findVehicleByPlate(plate) {
  const normalized = (plate || "").trim().toLowerCase();
  if (!normalized) return null;
  return loadVehicles().find((vehicle) => (vehicle.plate || "").trim().toLowerCase() === normalized) || null;
}

function showViolationDetails(kind, idx) {
  const config = getViolationConfig(kind);
  const violation = config.load()[idx];
  if (!violation) return;

  const driver = findDriverByName(violation.driver);
  const vehicle = findVehicleByPlate(violation.plate);

  openRecordDetail(
    violation.violationno || `${config.label} Details`,
    `${violation.id || "No ID"} - ${violation.plate || "No plate"} - ${violation.status || "No status"}`,
    `<div class="detail-grid">${detailFieldsHtml([
      ["Violation ID", textValue(violation.id)],
      ["Violation No.", textValue(violation.violationno)],
      ["Plate Number", textValue(violation.plate)],
      ["Driver", textValue(violation.driver)],
      ["Violation Date", dateValue(violation.violationdate)],
      ["Time Of Violation", textValue(fmtTime(violation.violationtime))],
      ["Reference Violation No.", textValue(violation.referenceno)],
      ["City Of Violation", textValue(violation.city)],
      ["Amount", textValue(violation.amount)],
      ["Status", textValue(violation.status)],
      ["Date Of Paid", violation.status === "Paid" ? dateValue(violation.paiddate) : textValue("-")],
      ["Notes", textValue(violation.notes)],
    ])}</div>
    ${driver ? `<div class="detail-section">
      <div class="detail-section-title">Driver Data</div>
      <div class="detail-grid">${detailFieldsHtml([
        ["Driver ID", textValue(driver.id)],
        ["Full Name", textValue(driver.name)],
        ["Iqama ID No.", textValue(driver.iqamaid)],
        ["Phone Number", textValue(driver.phone)],
        ["Company", textValue(driver.company)],
        ["Driver Type", textValue(driver.drivertype)],
      ])}</div>
    </div>` : `<div class="detail-section"><div class="detail-section-title">Driver Data</div><div class="detail-empty">No matching driver record found.</div></div>`}
    ${vehicle ? `<div class="detail-section">
      <div class="detail-section-title">Vehicle Data</div>
      <div class="detail-grid">${detailFieldsHtml([
        ["Vehicle ID", textValue(vehicle.id)],
        ["Plate Number", textValue(vehicle.plate)],
        ["Make / Model", textValue(vehicle.make)],
        ["Vehicle Type", textValue(vehicle.type)],
        ["GPS Status", textValue(vehicle.gps)],
        ["Assigned Driver", textValue(vehicle.driver)],
      ])}</div>
    </div>` : `<div class="detail-section"><div class="detail-section-title">Vehicle Data</div><div class="detail-empty">No matching vehicle record found.</div></div>`}`,
    detailActionButtons(`${config.editFn}(${idx})`)
  );
}

let editMaroorViolationIdx = -1;
let editEfaaViolationIdx = -1;

function togglePaidDateField(prefix) {
  const status = document.getElementById(`${prefix}-status`).value;
  const group = document.getElementById(`${prefix}-paiddate-group`);
  const paidDate = document.getElementById(`${prefix}-paiddate`);
  const isPaid = status === "Paid";
  group.style.display = isPaid ? "" : "none";
  if (!isPaid) paidDate.value = "";
}

function applyViolationRowFilter(query, row) {
  if (row?.uid) return query.eq("uid", row.uid);
  return query.eq("id", row.id);
}


function populateViolationDropdowns(prefix, selectedPlate, selectedDriver) {
  // Populate plate dropdown from registered vehicles
  const plateSelect = document.getElementById(`${prefix}-plate`);
  const driverSelect = document.getElementById(`${prefix}-driver`);
  if (!plateSelect || !driverSelect) return;

  const plates = [...new Set(loadVehicles().map((v) => v.plate).filter(Boolean))].sort();
  plateSelect.innerHTML = '<option value="">Select plate...</option>';
  plates.forEach((plate) => {
    const opt = new Option(plate, plate);
    plateSelect.appendChild(opt);
  });
  // Add the saved plate if it's not already there (backward-compat)
  if (selectedPlate && !plates.includes(selectedPlate)) {
    plateSelect.appendChild(new Option(selectedPlate, selectedPlate));
  }
  plateSelect.value = selectedPlate || '';

  // Populate driver dropdown from registered drivers
  const driverNames = [...new Set(loadDrivers().map((d) => d.name).filter(Boolean))].sort();
  driverSelect.innerHTML = '<option value="">Select driver...</option>';
  driverNames.forEach((name) => {
    driverSelect.appendChild(new Option(name, name));
  });
  if (selectedDriver && !driverNames.includes(selectedDriver)) {
    driverSelect.appendChild(new Option(selectedDriver, selectedDriver));
  }
  driverSelect.value = selectedDriver || '';
}

function openViolationModal(kind, idx = -1) {
  const config = getViolationConfig(kind);
  if (kind === "maroor") editMaroorViolationIdx = idx;
  else editEfaaViolationIdx = idx;

  const rows = config.load();
  const v = idx >= 0 ? rows[idx] : {};
  document.getElementById(config.titleId).textContent =
    idx >= 0 ? `Edit ${config.label}` : `Add ${config.label}`;
  document.getElementById(`${config.prefix}-id`).value = v.id || '';
  document.getElementById(`${config.prefix}-violationno`).value = v.violationno || '';
  // Populate dropdowns BEFORE setting their values
  populateViolationDropdowns(config.prefix, v.plate || '', v.driver || '');
  document.getElementById(`${config.prefix}-violationdate`).value = v.violationdate || '';
  document.getElementById(`${config.prefix}-violationtime`).value = v.violationtime || '';
  document.getElementById(`${config.prefix}-referenceno`).value = v.referenceno || '';
  document.getElementById(`${config.prefix}-city`).value = v.city || '';
  document.getElementById(`${config.prefix}-amount`).value = v.amount || '';
  document.getElementById(`${config.prefix}-status`).value = v.status || '';
  document.getElementById(`${config.prefix}-paiddate`).value = v.paiddate || '';
  document.getElementById(`${config.prefix}-notes`).value = v.notes || '';
  togglePaidDateField(config.prefix);
  document.getElementById(config.modalId).classList.add('open');
}

async function saveViolation(kind) {
  if (!(await requireAuth())) return;
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
    const editingRow = editIdx >= 0 ? rows[editIdx] : null;
    const rec = {
      id:
        document.getElementById(`${config.prefix}-id`).value.trim() ||
        (editIdx >= 0
          ? editingRow.id
          : config.idPrefix + String(rows.length + 1).padStart(3, "0")),
      violationno,
      plate: document.getElementById(`${config.prefix}-plate`).value.trim(),
      driver: document.getElementById(`${config.prefix}-driver`).value.trim(),
      violationdate: document.getElementById(`${config.prefix}-violationdate`).value,
      violationtime: document.getElementById(`${config.prefix}-violationtime`).value,
      referenceno: document.getElementById(`${config.prefix}-referenceno`).value.trim(),
      city: document.getElementById(`${config.prefix}-city`).value.trim(),
      amount: document.getElementById(`${config.prefix}-amount`).value.trim(),
      status: document.getElementById(`${config.prefix}-status`).value,
      paiddate:
        document.getElementById(`${config.prefix}-status`).value === "Paid"
          ? document.getElementById(`${config.prefix}-paiddate`).value
          : "",
      notes: document.getElementById(`${config.prefix}-notes`).value.trim(),
    };
    const query = editIdx >= 0
      ? applyViolationRowFilter(supabaseClient.from(config.table).update(cleanRecord(rec)), editingRow)
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
  if (!(await requireAuth())) return;
  const config = getViolationConfig(kind);
  if (!confirm(`Remove this ${config.label.toLowerCase()}?`)) return;
  const row = config.load()[idx];
  if (!row) return;
  const { error } = await applyViolationRowFilter(supabaseClient.from(config.table).delete(), row);
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
  if (!(await requireAuth())) return;
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

async function initializeAuth() {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error || !data.session) {
    currentSession = null;
    showLogin();
  } else {
    await showDashboard(data.session);
  }
}

supabaseClient.auth.onAuthStateChange((event, session) => {
  currentSession = session;
  if (event === "SIGNED_OUT") {
    showLogin();
  }
});

initializeAuth();
