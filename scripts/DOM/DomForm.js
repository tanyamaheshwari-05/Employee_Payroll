// 1. GET ID FROM URL
const empId = new URLSearchParams(window.location.search).get("id");

// 2. SHOW / HIDE ERROR
function showError(id) {
  document.getElementById(id).classList.remove("d-none");
  document.getElementById(id).previousElementSibling.classList.add("is-invalid");
}

function hideError(id) {
  document.getElementById(id).classList.add("d-none");
  document.getElementById(id).previousElementSibling.classList.remove("is-invalid");
}

// 3. VALIDATION
function validateForm() {
  const checks = [
    document.getElementById("name").value.length >= 2,
    document.querySelectorAll("input[name='profile']:checked").length,
    document.querySelectorAll("input[name='gender']:checked").length,
    document.querySelectorAll("input[name='department']:checked").length,
    document.getElementById("salary").value,
    document.getElementById("day").value &&
      document.getElementById("month").value &&
      document.getElementById("year").value
  ];

  const errors = [
    "name-error",
    "img-error",
    "gender-error",
    "dep-error",
    "salary-error",
    "date-error"
  ];

  errors.forEach((err, i) =>
    checks[i] ? hideError(err) : showError(err)
  );

  return checks.every(Boolean);
}

// 4. REAL TIME VALIDATION
document.getElementById("name").addEventListener("input", () => {
  if (document.getElementById("name").value.length >= 3) {
    hideError("name-error");
  }
});

document.querySelectorAll(
  "[name='profile'], [name='gender'], [name='department'], #salary, #day, #month, #year"
).forEach(el => el.addEventListener("change", validateForm));

// 5. EDIT PREFILL
if (empId) {
  document.querySelector("button[type='submit']").innerText = "Update";
  document.getElementById("formTitle").innerText = "Edit Employee Payroll Form";

  fetch(`http://localhost:3000/employees/${empId}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("name").value = data.name;
      document.getElementById("salary").value = data.salary;

      document.querySelector(`input[name="gender"][value="${data.gender}"]`).checked = true;
      document.querySelector(`input[name="profile"][value="${data.img}"]`).checked = true;

      data.department.forEach(dep => {
        document.querySelector(`input[name="department"][value="${dep}"]`).checked = true;
      });

      document.getElementById("day").value = data.start_date[0];
      document.getElementById("month").value = data.start_date[1];
      document.getElementById("year").value = data.start_date[2];
    });
}

// 6. FORM SUBMIT
document.getElementById("payrollForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!validateForm()) return;

  const data = {
    img: document.querySelector("input[name='profile']:checked").value,
    name: document.getElementById("name").value,
    gender: document.querySelector("input[name='gender']:checked").value,
    department: Array.from(
      document.querySelectorAll("input[name='department']:checked")
    ).map(d => d.value),
    salary: document.getElementById("salary").value,
    start_date: [
      document.getElementById("day").value,
      document.getElementById("month").value,
      document.getElementById("year").value
    ]
  };

  const url = empId
    ? `http://localhost:3000/employees/${empId}`
    : "http://localhost:3000/employees";

  fetch(url, {
    method: empId ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(() => (window.location.href = "Table.html"));
});
