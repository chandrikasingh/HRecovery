/* =========================================================
   Vehicle Data
   ========================================================= */

let vehicle_list = [];
let records = [];


/* =========================================================
   Storage
   ========================================================= */

const KEY = "himanshu_recovery_records_v1";


/* =========================================================
   Utility
   ========================================================= */

const doc = (id) => document.getElementById(id);

function norm(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase();
}

function esc(value) {
    return String(value ?? "").replace(
        /[&<>'"]/g,
        (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;"
        }[char])
    );
}


/* =========================================================
   Toast
   ========================================================= */

function toast(message) {
    doc("toast").textContent = message;
    doc("toast").style.display = "block";

    setTimeout(() => {
        doc("toast").style.display = "none";
    }, 2200);
}


/* =========================================================
   Storage / Statistics
   ========================================================= */

function save() {
    localStorage.setItem(
        KEY,
        JSON.stringify(records)
    );

    updateStats();
}

function updateStats() {
    doc("count").textContent =
        records.length.toLocaleString();
}

/* =========================================================
   Default Load : Vehicle List from data/bls_vehicle.csv
   ========================================================= */
async function loadVehicles() {
    try {
        const response = await fetch(
          "./data/bls_vehicle.csv",
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                "Unable to load this CSV"
            );
        }

        const text = await response.text();

        const rows = parseCSV(text);

        if (!rows.length) {
            throw new Error(
                "CSV is empty"
            );
        }

        const imported = rows
            .map((row) => ({
                ...row,
                vehicle: row["REG NO"] || ""
            }))
            .filter(record => record.vehicle);

        if (!imported.length) {
            throw new Error(
                "No vehicle numbers found in CSV"
            );
        }

        /*
         * Keep original CSV data in memory.
         */
        vehicle_list = imported;

        /*
         * Load saved/imported records if available.
         * Otherwise use bls_vehicle.csv.
         */
        const saved =
            localStorage.getItem(KEY);

        if (saved) {
            const parsed =
                JSON.parse(saved);

            records = Array.isArray(parsed)
                ? parsed
                : [...vehicle_list];
        } else {
            records = [...vehicle_list];
        }

        console.log(
            "bls_vehicle.csv:",
            vehicle_list
        );

        console.log(
            "records:",
            records
        );

        updateStats();
        search();

    } catch (error) {
        console.error(
            "Failed to load bls_vehicle.csv"
        );

        vehicle_list = [];
        records = [];

        updateStats();
        search();

        toast(
            "Unable to load bls_vehicle.csv"
        );
    }
}



/* =========================================================
   Storage Clear / Reset
   ========================================================= */

function clearStoredData() {
    /*
     * Remove imported/saved records.
     */
    localStorage.removeItem(KEY);

    /*
     * Restore original CSV data.
     */
    records = [...vehicle_list];

    updateStats();
    search();

    toast(
        "Original data restored"
    );
}


/* =========================================================
   Search
   ========================================================= */

function search() {
    const query = norm(
        doc("q").value
    );

    const results = query
        ? records.filter(
              (record) =>
                  norm(
                      record.vehicle
                  ).includes(query)
          )
        : records.slice(0, 100);

    doc("matches").textContent =
        results.length.toLocaleString();

    render(results);
}


/* =========================================================
   Render Results
   ========================================================= */

function render(results) {
    const box = doc("results");

    if (!results.length) {
        box.innerHTML =
            '<div class="empty">No matching vehicle found.</div>';

        return;
    }

    box.innerHTML = results
        .slice(0, 100)
        .map((record) => `
            <div
                class="result"
                data-i="${records.indexOf(record)}"
            >
                <div class="reg">
                    ${esc(record.vehicle)}
                </div>

                <div class="meta">
                    Vehicle registration
                </div>
            </div>
        `)
        .join("");

    box.querySelectorAll(".result").forEach((item) => {
        item.onclick = () => {
            showDetail(Number(item.dataset.i));
        };
    });
}


/* =========================================================
   Detail
   ========================================================= */

function showDetail(index) {
    const record = records[index];

    if (!record) {
        return;
    }

    doc("home").style.display = "none";
    doc("detail").style.display = "block";

    doc("detailCard").innerHTML = `
        <h2>${esc(record.vehicle)}</h2>

        <div class="row">
            <div class="label">PIN-CODE</div>
            <div class="value">${esc(record["PIN-CODE"])}</div>
        </div>

        <div class="row">
            <div class="label">BRANCH</div>
            <div class="value">${esc(record["BRANCH"])}</div>
        </div>

        <div class="row">
            <div class="label">LOAN NO</div>
            <div class="value">${esc(record["LOAN NO"])}</div>
        </div>

        <div class="row">
            <div class="label">MODEL</div>
            <div class="value">${esc(record["MODEL"])}</div>
        </div>

        <div class="row">
            <div class="label">MOBILE NO</div>
            <div class="value">${esc(record["MOBILE NO"])}</div>
        </div>

        <div class="row">
            <div class="label">CUSTOMER NAME</div>
            <div class="value">${esc(record["CUSTOMER NAME"])}</div>
        </div>

        <div class="row">
            <div class="label">REG NO</div>
            <div class="value">${esc(record["REG NO"])}</div>
        </div>

        <div class="row">
            <div class="label">ADDRESS</div>
            <div class="value">${esc(record["ADESS"])}</div>
        </div>

        <div class="row">
            <div class="label">EMI</div>
            <div class="value">${esc(record["EMI"])}</div>
        </div>

        <div class="row">
            <div class="label">TOTAL EMI DUE</div>
            <div class="value">${esc(record["TOTAL EMI DUE"])}</div>
        </div>

        <div class="row">
            <div class="label">TENURE</div>
            <div class="value">${esc(record["TENURE"])}</div>
        </div>
    `;
}



/* =========================================================
   Back
   ========================================================= */

doc("back").onclick = () => {
    doc("detail").style.display =
        "none";

    doc("home").style.display =
        "block";
};


/* =========================================================
   Search Events
   ========================================================= */

doc("search").onclick = search;

doc("q").addEventListener(
    "input",
    search
);

doc("q").addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Enter") {
            search();
        }
    }
);


/* =========================================================
   Import CSV
   ========================================================= */

doc("importBtn").onclick = () => {
    doc("file").click();
};

doc("file").onchange = (event) => {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        try {
            const rows = parseCSV(reader.result);

            if (!rows.length) {
                throw new Error(
                    "CSV is empty"
                );
            }


const imported = rows
    .map((row) => ({
        ...row,
        vehicle: row["REG NO"] || ""
    }))
    .filter(record => record.vehicle);

            if (!imported.length) {
                console.log(
                    "CSV rows:",
                    rows
                );

                console.log(
                    "CSV headers:",
                    Object.keys(rows[0])
                );

                throw new Error(
                    "No vehicle numbers found"
                );
            }

            /*
             * Replace current records
             */
            records = imported;

            /*
             * Save imported records
             */
            save();

            /*
             * Refresh results
             */
            search();

            toast(
                records.length.toLocaleString() +
                " records imported"
            );

        } catch (error) {
            console.error(
                "CSV import error:",
                error
            );

            alert(
                "CSV import failed: " +
                error.message
            );
        }
    };

    reader.onerror = () => {
        alert(
            "Unable to read the CSV file."
        );
    };

    reader.readAsText(file);

    /*
     * Allow selecting the same file again.
     */
    event.target.value = "";
};


/* =========================================================
   Reset Data
   ========================================================= */

doc("clearBtn").onclick = () => {
    if (
        confirm(
            "Reset to the original vehicle list?"
        )
    ) {
        clearStoredData();
    }
};


/* =========================================================
   CSV Parser
   ========================================================= */

function parseCSV(text) {
    const rows = [];

    let row = [];
    let cell = "";
    let quote = false;

    for (
        let i = 0;
        i < text.length;
        i++
    ) {
        const current =
            text[i];

        const next =
            text[i + 1];

        /*
         * Quoted field
         */
        if (current === '"') {

            if (
                quote &&
                next === '"'
            ) {
                cell += '"';
                i++;

            } else {
                quote = !quote;
            }
        }

        /*
         * Column separator
         */
        else if (
            current === "," &&
            !quote
        ) {
            row.push(cell);
            cell = "";
        }

        /*
         * New row
         */
        else if (
            (
                current === "\n" ||
                current === "\r"
            ) &&
            !quote
        ) {

            if (
                current === "\r" &&
                next === "\n"
            ) {
                i++;
            }

            row.push(cell);
            cell = "";

            if (
                row.some(
                    (value) =>
                        value.trim() !== ""
                )
            ) {
                rows.push(row);
            }

            row = [];
        }

        /*
         * Normal character
         */
        else {
            cell += current;
        }
    }

    /*
     * Add final row
     */
    if (
        cell !== "" ||
        row.length
    ) {
        row.push(cell);

        if (
            row.some(
                (value) =>
                    value.trim() !== ""
            )
        ) {
            rows.push(row);
        }
    }

    if (!rows.length) {
        return [];
    }

    /*
     * First row = headers
     */
    const headers =
        rows
            .shift()
            .map(
                (header, index) =>
                    header.trim() ||
                    `Column doc{index + 1}`
            );

    /*
     * Convert rows into objects
     */
    return rows.map(
        (values) =>
            Object.fromEntries(
                headers.map(
                    (header, index) => [
                        header,
                        values[index] ?? ""
                    ]
                )
            )
    );
}


/* =========================================================
   Initialisation
   ========================================================= */

loadVehicles();

