// Equipment request tracker. Data lives in memory, seeded from SAMPLE_REQUESTS,
// with new requests saved to the browser's localStorage. No login, no database.

const SAMPLE_REQUESTS = [
  { id: 1, requester: "A. Patel", item: "Laptop docking station", priority: "High", submitted: "2026-11-02" },
  { id: 2, requester: "J. Moreno", item: "Ergonomic chair", priority: "Low", submitted: "2026-11-03" },
  { id: 3, requester: "K. Osei", item: "Replacement monitor (cracked screen)", priority: "High", submitted: "2026-11-04" },
  { id: 4, requester: "L. Chen", item: "Wireless headset", priority: "Medium", submitted: "2026-11-05" },
  { id: 5, requester: "R. Novak", item: "Label printer", priority: "Low", submitted: "2026-11-06" },
  { id: 6, requester: "S. Haddad", item: "Barcode scanner", priority: "Medium", submitted: "2026-11-07" },
  { id: 7, requester: "T. Brooks", item: "Server rack fan (overheating)", priority: "High", submitted: "2026-11-08" },
  { id: 8, requester: "M. Ito", item: "Spare keyboard", priority: "", submitted: "2026-11-09" }
];

const STORAGE_KEY = "equipment-requests:added";

function loadAddedRequests() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveAddedRequests(added) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(added));
  } catch {
    // Storage unavailable: requests still work for this page view.
  }
}

function priorityLabel(priority) {
  return priority ? priority : "Unspecified";
}

function renderRows(requests) {
  const tbody = document.getElementById("request-rows");
  tbody.replaceChildren(
    ...requests.map((r) => {
      const tr = document.createElement("tr");
      const label = priorityLabel(r.priority);
      [r.id, r.requester, r.item, label, r.submitted].forEach((value, i) => {
        const td = document.createElement("td");
        td.textContent = value;
        if (i === 3) td.className = `priority priority-${label.toLowerCase()}`;
        tr.appendChild(td);
      });
      return tr;
    })
  );
}

function init() {
  let added = loadAddedRequests();
  const allRequests = () => [...SAMPLE_REQUESTS, ...added];

  document.getElementById("request-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const nextId = Math.max(...allRequests().map((r) => r.id)) + 1;
    added = [
      ...added,
      {
        id: nextId,
        requester: data.get("requester").trim(),
        item: data.get("item").trim(),
        priority: data.get("priority"),
        submitted: new Date().toISOString().slice(0, 10)
      }
    ];
    saveAddedRequests(added);
    form.reset();
    renderRows(allRequests());
  });

  renderRows(allRequests());
}

if (typeof document !== "undefined") init();
