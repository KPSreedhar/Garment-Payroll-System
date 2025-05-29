// js/workEntries.js

document.addEventListener("DOMContentLoaded", () => {
  const workerSelect = document.getElementById("worker");
  const form = document.getElementById("entryForm");
  const dateInput = document.getElementById("date");
  const quantityInput = document.getElementById("quantity");
  const messageDiv = document.getElementById("message");

  const labelQty = document.getElementById("label-quantity");

  const workers = getFromStorage("workers");

  // Populate dropdown
  workers.forEach(worker => {
    const option = document.createElement("option");
    option.value = worker.id;
    option.textContent = `${worker.name} (${worker.paymentType})`;
    option.dataset.paymentType = worker.paymentType;
    workerSelect.appendChild(option);
  });

  // Update label based on payment type
  workerSelect.addEventListener("change", () => {
    const selected = workerSelect.options[workerSelect.selectedIndex];
    const type = selected.dataset.paymentType;
    labelQty.textContent = `Quantity (${type === "shift" ? "shifts" : "pieces"}):`;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const date = dateInput.value;
    const workerId = parseInt(workerSelect.value);
    const quantity = parseInt(quantityInput.value);

    if (!date || isNaN(workerId) || isNaN(quantity)) {
      alert("All fields must be filled correctly.");
      return;
    }

    const workEntries = getFromStorage("workEntries");

    workEntries.push({
      id: Date.now(),
      date,
      workerId,
      quantity
    });

    saveToStorage("workEntries", workEntries);
    form.reset();
    messageDiv.innerHTML = "<p style='color:green;'>Work entry saved successfully.</p>";
  });
});
