const fileInput = document.getElementById("fileInput");
const convertButton = document.getElementById("convertButton");
const downloadButton = document.getElementById("downloadButton");
const fileNameEl = document.getElementById("fileName");
const recordCountEl = document.getElementById("recordCount");
const unknownCountEl = document.getElementById("unknownCount");
const messageEl = document.getElementById("message");
const previewHeadEl = document.getElementById("previewHead");
const previewBodyEl = document.getElementById("previewBody");
const dropzone = document.getElementById("dropzone");

const knownFields = {
  "TEST NUMBER": "test_number",
  DATE: "date",
  TIME: "time",
  TESTER: "tester",
  "APP NO": "app_no",
  "TEST MODE": "test_mode",
  INS: "ins",
  "EARTH CURRENT": "earth_current",
  EARTH: "earth",
  IEC: "iec",
  "LEAD CONTINUITY": "lead_continuity",
  USER: "user",
  SITE: "site",
};

const previewColumns = [
  "test_number",
  "date",
  "time",
  "app_no",
  "test_mode",
  "ins",
  "earth_current",
  "earth",
  "iec",
  "lead_continuity",
  "user",
  "site",
  "text_1",
  "text_2",
  "text_3",
  "text_4",
];

const labelMatchers = [...Object.keys(knownFields), "TEXT"].sort(
  (left, right) => right.length - left.length,
);

let currentRows = [];
let currentFileStem = "seaward-pat";
let currentObjectUrl = null;

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (file) {
    currentFileStem = stripExtension(file.name);
    fileNameEl.textContent = file.name;
    messageEl.textContent = `Loaded ${file.name}. Click Convert to CSV.`;
    convertButton.disabled = false;
  } else {
    fileNameEl.textContent = "No file selected";
    convertButton.disabled = true;
  }
});

convertButton.addEventListener("click", async () => {
  const file = fileInput.files?.[0];
  if (!file) {
    messageEl.textContent = "Choose a `.txt` export first.";
    return;
  }

  const text = await file.text();
  const parsed = parseExport(text);
  currentRows = parsed.rows;

  recordCountEl.textContent = String(parsed.rows.length);
  unknownCountEl.textContent = String(parsed.unknownLabels.length);

  const csv = toCsv(parsed.rows);
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
  }
  currentObjectUrl = url;

  downloadButton.href = url;
  downloadButton.download = `${currentFileStem}.csv`;
  downloadButton.hidden = false;
  downloadButton.setAttribute("aria-disabled", "false");

  messageEl.textContent =
    `Parsed ${parsed.rows.length} records.\n` +
    (parsed.unknownLabels.length
      ? `Unknown labels preserved in extras_json: ${parsed.unknownLabels.join(", ")}`
      : "No unknown labels found.");

  renderPreview(parsed.rows);
});

downloadButton.addEventListener("click", (event) => {
  if (!currentRows.length) {
    event.preventDefault();
  }
});

dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropzone.classList.remove("dragover");
  const file = event.dataTransfer.files?.[0];
  if (!file) {
    return;
  }

  const transfer = new DataTransfer();
  transfer.items.add(file);
  fileInput.files = transfer.files;
  fileInput.dispatchEvent(new Event("change"));
});

function parseExport(text) {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const blocks = [];
  let currentBlock = [];

  for (const line of lines) {
    if (/^\s*TEST NUMBER\b/.test(line) && currentBlock.length) {
      blocks.push(currentBlock);
      currentBlock = [line];
      continue;
    }

    if (line.trim() || currentBlock.length) {
      currentBlock.push(line);
    }
  }

  if (currentBlock.length) {
    blocks.push(currentBlock);
  }

  const rows = [];
  const unknownLabels = new Set();

  for (const [index, block] of blocks.entries()) {
    const row = {
      record_index: index + 1,
      test_number: "",
      date: "",
      time: "",
      tester: "",
      app_no: "",
      test_mode: "",
      ins: "",
      earth_current: "",
      earth: "",
      iec: "",
      lead_continuity: "",
      user: "",
      site: "",
      text_1: "",
      text_2: "",
      text_3: "",
      text_4: "",
      extras_json: "",
    };

    const extras = [];
    let textIndex = 0;

    for (const rawLine of block) {
      const line = rawLine.trimEnd();
      if (!line.trim()) {
        continue;
      }

      const content = line.trimStart();
      let label = "";
      let value = "";

      for (const candidate of labelMatchers) {
        if (content === candidate) {
          label = candidate;
          value = "";
          break;
        }

        if (content.startsWith(`${candidate} `)) {
          label = candidate;
          value = content.slice(candidate.length).trimStart();
          break;
        }
      }

      if (!label) {
        const fallback = content.match(/^([A-Z][A-Z ]*?)\s+(.*)$/);
        if (!fallback) {
          continue;
        }

        label = normalizeLabel(fallback[1]);
        value = fallback[2].trim();
      }

      if (!label) {
        continue;
      }

      if (label === "TEXT") {
        textIndex += 1;
        if (textIndex <= 4) {
          row[`text_${textIndex}`] = value;
        } else {
          extras.push({ label: `TEXT_${textIndex}`, value });
          unknownLabels.add(`TEXT_${textIndex}`);
        }
        continue;
      }

      const mapped = knownFields[label];
      if (mapped) {
        row[mapped] = value;
      } else {
        extras.push({ label, value });
        unknownLabels.add(label);
      }
    }

    row.extras_json = extras.length ? JSON.stringify(extras) : "";
    rows.push(row);
  }

  return { rows, unknownLabels: [...unknownLabels] };
}

function toCsv(rows) {
  const headers = Object.keys(rows[0] ?? {
    record_index: "",
    test_number: "",
    date: "",
    time: "",
    tester: "",
    app_no: "",
    test_mode: "",
    ins: "",
    earth_current: "",
    earth: "",
    iec: "",
    lead_continuity: "",
    user: "",
    site: "",
    text_1: "",
    text_2: "",
    text_3: "",
    text_4: "",
    extras_json: "",
  });

  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header] ?? "")).join(","));
  }
  return lines.join("\n");
}

function renderPreview(rows) {
  previewHeadEl.innerHTML = "";
  previewBodyEl.innerHTML = "";

  const headers = previewColumns;
  for (const header of headers) {
    const th = document.createElement("th");
    th.textContent = header;
    previewHeadEl.appendChild(th);
  }

  rows.slice(0, 8).forEach((row) => {
    const tr = document.createElement("tr");
    for (const header of headers) {
      const td = document.createElement("td");
      td.textContent = row[header] ?? "";
      tr.appendChild(td);
    }
    previewBodyEl.appendChild(tr);
  });
}

function csvEscape(value) {
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function normalizeLabel(label) {
  return label.replace(/\s+/g, " ").trim();
}

function stripExtension(name) {
  return name.replace(/\.[^.]+$/, "");
}

window.SeawardPatConverter = {
  parseExport,
  toCsv,
};
