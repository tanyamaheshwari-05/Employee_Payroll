const empId = new URLSearchParams(window.location.search).get("id");

const get = id => document.getElementById(id);

function showError(id) {
  get(id).classList.remove("d-none");
  get(id).previousElementSibling.classList.add("invalid");
}

function hideError(id) {
  get(id).classList.add("d-none");
  get(id).previousElementSibling.classList.remove("invalid");
}

function validateForm() {
  const nameValid = /^[A-Za-z\s]{2,}$/.test(get("name").value);
  const profileValid = document.querySelector("input[name='profile']:checked");
  const genderValid = document.querySelector("input[name='gender']:checked");
  const depValid = document.querySelectorAll("input[name='department']:checked").length > 0;
  const salaryValid = get("salary").value;
  const dateValid = get("day").value && get("month").value && get("year").value;

  const checks = [
    { valid: nameValid, error: "name-error" },
    { valid: profileValid, error: "img-error" },
    { valid: genderValid, error: "gender-error" },
    { valid: depValid, error: "dep-error" },
    { valid: salaryValid, error: "salary-error" },
    { valid: dateValid, error: "date-error" }
  ];

  checks.forEach(c => c.valid ? hideError(c.error) : showError(c.error));
  return checks.every(c => c.valid);
}

get("name").addEventListener("input", validateForm);

[
  ...document.querySelectorAll(
    "[name='profile'], [name='gender'], [name='department'], #salary, #day, #month, #year"
  )
].forEach(el => el.addEventListener("change", validateForm));

if (empId) {
  document.querySelector("button[type='submit']").innerText = "Update";

  fetch(`http://localhost:3000/employees/${empId}`)
    .then(res => res.json())
    .then(data => {
      get("name").value = data.name;
      get("salary").value = data.salary;

      document.querySelector(`[name="gender"][value="${data.gender}"]`).checked = true;
      document.querySelector(`[name="profile"][value="${data.img}"]`).checked = true;

      data.department.forEach(dep => {
        document.querySelector(`[name="department"][value="${dep}"]`).checked = true;
      });

      [get("day").value, get("month").value, get("year").value] = data.start_date;
    });
}

get("payrollForm").addEventListener("submit", async e => {
  e.preventDefault();
  if (!validateForm()) return;

  const name = get("name").value.trim();

  const payload = {
    img: document.querySelector("[name='profile']:checked").value,
    name,
    gender: document.querySelector("[name='gender']:checked").value,
    department: [...document.querySelectorAll("[name='department']:checked")].map(d => d.value),
    salary: get("salary").value,
    start_date: [get("day").value, get("month").value, get("year").value]
  };

  const res = await fetch("http://localhost:3000/employees");
  const employees = await res.json();

  const duplicate = employees.some(emp =>
    emp.name.toLowerCase() === name.toLowerCase() &&
    (!empId || emp.id != empId)
  );

  if (duplicate) {
    alert("User already exists");
    return;
  }

  await fetch(
    empId
      ? `http://localhost:3000/employees/${empId}`
      : "http://localhost:3000/employees",
    {
      method: empId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }
  );

  window.location.href = "../index.html";
});
