// GET ID FROM URL
const params = new URLSearchParams(window.location.search);
const empId = params.get("id");

// SHOW/HIDE ERROR
function showError(id) {
  $(`#${id}`).removeClass('d-none').addClass('d-block');
  $(`#${id}`).closest('.col-9').find('input, select, .profile-option img').addClass('is-invalid');
}

function hideError(id) {
  $(`#${id}`).addClass('d-none').removeClass('d-block');
  $(`#${id}`).closest('.col-9').find('input, select, .profile-option img').removeClass('is-invalid');
}

// SIMPLE VALIDATION
function validateForm() {
  const checks = [
    $('#name').val().trim().length >= 3,
    !!$("input[name='profile']:checked").val(),
    !!$("input[name='gender']:checked").val(),
    $("input[name='department']:checked").length > 0,
    !!$('#salary').val(),
    !!($('#day').val() && $('#month').val() && $('#year').val())
  ];
  
  const errors = ['name-error','img-error','gender-error','dep-error','salary-error','date-error'];
  errors.forEach((error, i) => checks[i] ? hideError(error) : showError(error));
  
  return checks.every(c => c);
}

// REAL-TIME VALIDATION
$('#name').on('input', () => $('#name').val().trim().length >= 3 && hideError('name-error'));
$('[name="profile"], [name="gender"], [name="department"], #salary, #day, #month, #year').on('change', validateForm);

// PREFILL FORM IF EDIT (FETCH)
if (empId) {
  $('button[type="submit"]').text("Update");
  $('#formTitle').text("Edit Employee Payroll Form");
  
  fetch(`http://localhost:3000/employees/${empId}`)
    .then(res => res.json())
    .then(data => {
      $('#formTitle').text("Edit Employee Payroll Form");
      
      $('#name').val(data.name);
      $('#salary').val(data.salary);
      
      $(`input[name="gender"][value="${data.gender}"]`).prop('checked', true);
      $(`input[name="profile"][value="${data.img}"]`).prop('checked', true);
      
      data.department.forEach(dep => {
        $(`input[name="department"][value="${dep}"]`).prop('checked', true);
      });
      
      $('#day').val(data.start_date[0]);
      $('#month').val(data.start_date[1]);
      $('#year').val(data.start_date[2]);
      
      setTimeout(validateForm, 500);
    });
}

// FORM SUBMIT with FETCH
$('#payrollForm').on('submit', async function(e) {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  const name = $('#name').val().trim();
  const img = $("input[name='profile']:checked").val();
  const gender = $("input[name='gender']:checked").val();
  
  const department = $("input[name='department']:checked").map(function() {
    return this.value;
  }).get();
  
  const salary = $('#salary').val();
  
  const start_date = [
    $('#day').val(),
    $('#month').val(),
    $('#year').val()
  ];
  
  const employeeData = { img, name, gender, department, salary, start_date };
  
  const url = empId ? `http://localhost:3000/employees/${empId}` : "http://localhost:3000/employees";
  const method = empId ? "PUT" : "POST";
  
  await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employeeData)
  });
  
  window.location.href = "Table.html";
});
