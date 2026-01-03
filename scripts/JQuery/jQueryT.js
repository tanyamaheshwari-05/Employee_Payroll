/*SEARCH */
const searchBtn = $("#search-btn");
const searchInp = $("#search");

searchBtn.on('click', function() {  // CLICK → HIDE BUTTON, SHOW BOX
  searchBtn.hide();
  searchInp.show().focus();
});

/*  BUTTON CLICKS  */
$(document).on('click', async function(e) {
  if(!e.target) return; 
  
  // EDIT
  let editBtn = $(e.target).closest('i').closest('.edit-btn');
  if(editBtn.length) {
    window.location = `./Layout/Form.html?id=${editBtn.data('id')}`;
    return;
  }
  
  // DELETE
  let delBtn = $(e.target).closest('i').closest('.delete-btn');
  if(delBtn.length) { 
    let id = delBtn.data('id');  
    
    if(confirm("Delete ID: " + id + "?")) {
      try {
        let response = await $.ajax({
          url: `http://localhost:3000/employees/${id}`,
          method: "DELETE"
        });
        
        if(response) {
          setTimeout(fetchData, 100);  // Table refresh
        }
      } catch(err) {
        alert("Server not running!");
      }
    }
  }
});

/*TABLE FILL*/
async function fetchData() {  // table
  let users = await $.get("http://localhost:3000/employees");
  users.reverse();
  
  let tableBody = $("#tab");
  tableBody.empty();
  
  users.forEach(user => {
    let row = tableBody[0].insertRow();
    
    row.innerHTML = `
      <td><div style="display:flex;gap:21px;align-items:center">
      <img src="${user.img||'./assets/tanya.png'}" width=24 style="border-radius:50%;"> ${user.name}</div></td>
      <td>${user.gender||"-"}</td>
      <td>${(user.department||[]).map(d=>`<span style="background:#E9FEA5;color:black;padding:4px 8px;border-radius:20px;font-size:10px">${d}</span>`).join(" ") || "-"}</td>
      <td>₹${user.salary||0}</td>
      <td>${(user.start_date||[]).join(" ")||"-"}</td>
      <td>
        <button class="btn btn-sm delete-btn px-1 py-0" data-id="${user.id}">
          <i class="bi bi-trash3-fill" style="color:#658298"></i>
        </button>
        <button class="btn btn-sm edit-btn px-1 py-0" data-id="${user.id}">
          <i class="bi bi-pencil-fill" style="color:#658292"></i>
        </button>
      </td>
    `;
  });
}

fetchData();  // START

/*SEARCH FILTER*/
searchInp.on('input', function() {
  let text = searchInp.val().toLowerCase();
  $("#tab tr").each(function() {
    $(this).toggle($(this).text().toLowerCase().includes(text));
  });
});
