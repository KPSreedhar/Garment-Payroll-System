document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("workerForm");
  const nameInput = document.getElementById("name");
  const paymentTypeInput = document.getElementById("paymentType");
  const rateInput = document.getElementById("rate");
  const tableBody = document.getElementById("tableBody");
  const submitButton = document.getElementById("submitBtn");
  const cancelButton = document.getElementById("cancelBtn");

  let editWorkerId = null; // Track editing state

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const paymentType = paymentTypeInput.value;
    const rate = parseFloat(rateInput.value);

    if (!name || !paymentType || isNaN(rate) || rate <= 0) {
  alert("Please fill in all fields correctly with a positive rate.");
  return;
}


    let workers = getFromStorage("workers");

    if (editWorkerId) {
      // Edit mode
      workers = workers.map(worker =>
        worker.id === editWorkerId
          ? { ...worker, name, paymentType, rate }
          : worker
      );
      editWorkerId = null;
      submitButton.textContent = "Add Worker";
      cancelButton.style.display = "none";
    } else {
      // Add mode
      workers.push({
        id: Date.now(),
        name,
        paymentType,
        rate,
      });
    }

    saveToStorage("workers", workers);
    form.reset();
    renderWorkerTable();
  });

  cancelButton.addEventListener("click", () => {
    form.reset();
    editWorkerId = null;
    submitButton.textContent = "Add Worker";
    cancelButton.style.display = "none";
  });

  function renderWorkerTable() {
    const workers = getFromStorage("workers");
    tableBody.innerHTML = "";

    if (workers.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 4;
      cell.textContent = "No workers added yet.";
      cell.style.textAlign = "center";
      row.appendChild(cell);
      tableBody.appendChild(row);
      return;
    }

    workers.forEach(worker => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${worker.name}</td>
        <td>${worker.paymentType.toUpperCase()}</td>
        <td>₹${worker.rate.toFixed(2)}</td>
        <td style="text-align:center; white-space:nowrap; width:100px;">
          <button onclick="editWorker(${worker.id})">✏️</button>
          <button onclick="deleteWorker(${worker.id})">🗑️</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  }

  // Edit and delete globally accessible
  window.editWorker = function (id) {
    const workers = getFromStorage("workers");
    const worker = workers.find(w => w.id === id);
    if (!worker) return;

    nameInput.value = worker.name;
    paymentTypeInput.value = worker.paymentType;
    rateInput.value = worker.rate;

    editWorkerId = id;
    submitButton.textContent = "Save Changes";
    cancelButton.style.display = "inline-block";

    // Auto-scroll to top of the form
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  window.deleteWorker = function (id) {
    if (!confirm("Are you sure you want to delete this worker?")) return;

    let workers = getFromStorage("workers");
    workers = workers.filter(worker => worker.id !== id);
    saveToStorage("workers", workers);
    renderWorkerTable();

    if (editWorkerId === id) {
      form.reset();
      editWorkerId = null;
      submitButton.textContent = "Add Worker";
      cancelButton.style.display = "none";
    }
  };

  function getFromStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  }

  function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  renderWorkerTable();
});
