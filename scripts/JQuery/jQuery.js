// GET ID FROM URL
const empId = new URLSearchParams(window.location.search).get("id");

// SHOW / HIDE ERROR
function showError(id) {
  $(`#${id}`).removeClass('d-none');
  $(`#${id}`).prev().addClass('invalid');
}

function hideError(id) {
  $(`#${id}`).addClass('d-none');
  $(`#${id}`).prev().removeClass('invalid');
}

// VALIDATE FORM
function validateForm() {
  const nameValid = /^[A-Za-z\s]{2,}$/.test($('#name').val());
  const profileValid = $("input[name='profile']:checked").length > 0;
  const genderValid = $("input[name='gender']:checked").length > 0;
  const depValid = $("input[name='department']:checked").length > 0;
  const salaryValid = $('#salary').val().trim() !== "";
  const dateValid = $('#day').val() && $('#month').val() && $('#year').val();

  const checks = [
    { valid: nameValid, error: 'name-error' },
    { valid: profileValid, error: 'img-error' },
    { valid: genderValid, error: 'gender-error' },
    { valid: depValid, error: 'dep-error' },
    { valid: salaryValid, error: 'salary-error' },
    { valid: dateValid, error: 'date-error' }
  ];

   var allValid = true;

  for (var i = 0; i < checks.length; i++) {
    if (checks[i].valid) {
      console.log(i,checks[i]);
      hideError(checks[i].error);
    } else {
      console.log(i,checks[i]);
      showError(checks[i].error);
      allValid = false;
    }
  }
  console.log(allValid);
  return  allValid;
}

// REAL-TIME VALIDATION
$('#name').on('input', function() {
  if ($(this).val().trim().length >= 2) hideError('name-error');
});

$("[name='profile'], [name='gender'], [name='department'], #salary, #day, #month, #year")
  .on('change', validateForm);

// PREFILL FORM IF EDIT
if (empId) {
  $("button[type='submit']").text("Update");
  
  $.getJSON(`http://localhost:3000/employees/${empId}`, function(data) {
    $('#name').val(data.name);
    $('#salary').val(data.salary);
    
    $(`input[name='gender'][value='${data.gender}']`).prop('checked', true);
    $(`input[name='profile'][value='${data.img}']`).prop('checked', true);

    data.department.forEach(dep => {
      $(`input[name='department'][value='${dep}']`).prop('checked', true);
    });

    $('#day').val(data.start_date[0]);
    $('#month').val(data.start_date[1]);
    $('#year').val(data.start_date[2]);

    // Validate prefilled data
    setTimeout(validateForm, 200);
  });
}

// FORM SUBMIT
$('#payrollForm').on('submit', async function(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const name = $('#name').val().trim();
  const payload = {
    img: $("input[name='profile']:checked").val(),
    name,
    gender: $("input[name='gender']:checked").val(),
    department: $("input[name='department']:checked").map(function() { return this.value; }).get(),
    salary: $('#salary').val(),
    start_date: [$('#day').val(), $('#month').val(), $('#year').val()]
  };

  try {
    const employees = await $.getJSON("http://localhost:3000/employees");
    
    const duplicate = employees.some(emp =>
      emp.name.toLowerCase() === name.toLowerCase() && (!empId || emp.id != empId)
    );

    if (duplicate) {
      alert("User already exists");
      return;
    }

    await $.ajax({
      url: empId ? `http://localhost:3000/employees/${empId}` : "http://localhost:3000/employees",
      method: empId ? "PUT" : "POST",
      contentType: "application/json",
      data: JSON.stringify(payload)
    });

    window.location.href = "../index.html";

  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  }
});
