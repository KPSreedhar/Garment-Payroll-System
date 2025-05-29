document.getElementById("generateBtn").addEventListener("click", () => {
  const weekStart = document.getElementById("weekStart").value;
  const weekEnd = document.getElementById("weekEnd").value;

  if (!weekStart || !weekEnd) {
    alert("Please select both Start and End dates.");
    return;
  }

  const start = new Date(weekStart);
  const end = new Date(weekEnd);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  if (start > end) {
    alert("Start date must be before or equal to End date.");
    return;
  }

  const workers = getFromStorage("workers") || [];
  const entries = getFromStorage("workEntries") || [];

  const reportData = {};

  entries.forEach(entry => {
    const entryDate = new Date(entry.date);
    if (entryDate >= start && entryDate <= end) {
      if (!reportData[entry.workerId]) {
        reportData[entry.workerId] = 0;
      }
      reportData[entry.workerId] += entry.quantity;
    }
  });

  const tbody = document.querySelector("#reportTable tbody");
  tbody.innerHTML = "";

  workers.forEach(worker => {
    const totalQuantity = reportData[worker.id] || 0;
    const totalSalary = totalQuantity * worker.rate;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Worker">${worker.name}</td>
      <td data-label="Type">${worker.paymentType}</td>
      <td data-label="Rate">${worker.rate}</td>
      <td data-label="Total Quantity">${totalQuantity}</td>
      <td data-label="Total Salary">₹${totalSalary.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  });
});

// Optional: Auto-fill end date with +6 days
document.getElementById("weekStart").addEventListener("change", () => {
  const start = new Date(document.getElementById("weekStart").value);
  if (!isNaN(start)) {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    document.getElementById("weekEnd").value = end.toISOString().split("T")[0];
  }
});
