/*SEARCH */
const searchBtn = document.getElementById("search-btn");
const searchInp = document.getElementById("search");

searchBtn.onclick = () => {  
  searchBtn.style.display = "none";
  searchInp.style.display = "block";
  searchInp.focus();
};

/* BUTTON CLICKS*/

document.onclick = async (e) => {
  if(!e.target) return;  
  
  // EDIT
  let editBtn = e.target.closest?.("i")?.closest(".edit-btn");
  if(editBtn) {
    window.location = `Form.html?id=${editBtn.dataset.id}`;
    return;
  }
  
  // DELETE
  let delBtn = e.target.closest("i")?.closest(".delete-btn");
if(delBtn) { 
  let id = delBtn.dataset.id;  
  
  if(confirm("Delete ID: " + id + "?")) {
    try {
      let response = await fetch(`http://localhost:3000/employees/${id}`, {
        method: "DELETE"
      });
      
      if(response.ok) {
        setTimeout(fetchData, 100);  // Table refresh
      }
    } catch(err) {
      alert("Server not running!");
    }
  }
}

};

/*TABLE FILL*/
async function fetchData() {  
  let users = await (await fetch("http://localhost:3000/employees")).json();
  users.reverse();
  
  let tableBody = document.getElementById("tab");
  tableBody.innerHTML = "";
  
  users.forEach(user => {
    let row = tableBody.insertRow();
    
    row.innerHTML = `
      <td><div style="display:flex;gap:21px;align-items:center">
      <img src="${user.img||'./assets/tanya.png'}"  width=24 style="border-radius:50%;"> ${user.name}</div></td>
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
searchInp.oninput = () => {
  let text = searchInp.value.toLowerCase();
  document.querySelectorAll("#tab tr").forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(text) ? "" : "none";
  });
};
