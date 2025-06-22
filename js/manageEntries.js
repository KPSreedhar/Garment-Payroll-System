document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#entryTable tbody");
  const entries = getFromStorage("workEntries") || [];
  const workers = getFromStorage("workers") || [];

  const getWorkerName = (id) => {
    const worker = workers.find((w) => w.id === id);
    return worker ? worker.name : "Unknown";
  };

  const renderTable = () => {
    tableBody.innerHTML = "";

    if (entries.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No entries found.</td></tr>`;
      return;
    }

    entries.forEach((entry, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td data-label="Date">
          <input type="date" id="date-${index}" value="${entry.date}" />
        </td>
        <td data-label="Worker">${getWorkerName(entry.workerId)}</td>
        <td data-label="Quantity">
          <input type="number" id="qty-${index}" value="${entry.quantity}" min="1" />
        </td>
        <td data-label="Actions">
          <button class="btn-update" data-index="${index}">Update</button>
          <button class="btn-delete" data-index="${index}" style="color:white;background-color: #d32f2f;">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

    attachEventListeners();
  };

  const attachEventListeners = () => {
    document.querySelectorAll(".btn-update").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        updateEntry(index);
      });
    });

    document.querySelectorAll(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        deleteEntry(index);
      });
    });
  };

  const updateEntry = (index) => {
    const dateInput = document.getElementById(`date-${index}`);
    const qtyInput = document.getElementById(`qty-${index}`);

    const date = dateInput?.value;
    const qty = parseInt(qtyInput?.value);

    if (!date || isNaN(qty) || qty <= 0) {
      alert("Please enter a valid date and a quantity greater than 0.");
      return;
    }

    entries[index].date = date;
    entries[index].quantity = qty;

    saveToStorage("workEntries", entries);
    alert("Entry updated successfully.");
    renderTable();
  };

  const deleteEntry = (index) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      entries.splice(index, 1);
      saveToStorage("workEntries", entries);
      renderTable();
    }
  };

  renderTable();
});
