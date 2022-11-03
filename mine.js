let API = "http://localhost:8000/sultans";

let name = document.querySelector("#name");
let lname = document.querySelector("#lname");
let phone = document.querySelector("#phone");
let image = document.querySelector("#image");
let btn = document.querySelector("#btn-add");

let list = document.querySelector("#contact-list");

let editName = document.querySelector("#edit-name");
let editLname = document.querySelector("#edit-lname");
let editPhone = document.querySelector("#edit-phone");
let editImage = document.querySelector("#edit-image");
let editSaveBtn = document.querySelector("#btn-save-edit");
let exampleModal = document.querySelector("#exampleModal");

btn.addEventListener("click", async function () {
  let obj = {
    name: name.value,
    lname: lname.value,
    phone: phone.value,
    image: image.value,
  };
  console.log(obj);

  if (
    !name.value.trim() ||
    !lname.value.trim() ||
    !phone.value.trim() ||
    !image.value.trim()
  ) {
    alert("Ты тупой?");
    return;
  }
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  name.value = "";
  lname.value = "";
  phone.value = "";
  image.value = "";

  salamat();
});

async function salamat() {
  let sultans = await fetch(API)
    .then((res) => res.json())
    .catch((err) => console.log(err));
  list.innerHTML = "";
  sultans.forEach((elem) => {
    let newElem = document.querySelector("div");
    console.log(elem.id);
    newElem.id = elem.id;
    newElem.innerHTML = `
    <div class="card m-5" style="width: 18rem;">
  <img src=${elem.image} class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${elem.name}</h5>
    <p class="card-text">${elem.lname}</p>
    <p class="card-text">${elem.phone}</p>
    <a href="#" id=${elem.id} onclick="deleteSultans(${elem.id})" class="btn btn-danger btn-delete">DELETE</a>
    <a href="#" id="${elem.id}" class="btn btn-dark btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal" >Edit</a>
    </div>
    </div>
    `;
    list.append(newElem);
  });
}
salamat();

function deleteSultans(id) {
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => salamat());
}
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editName.value = data.name;
        editLname.value = data.lname;
        editPhone.value = data.phone;
        editImage.value = data.image;
        editSaveBtn.setAttribute("id", data.id);
      });
  }
});
editSaveBtn.addEventListener("click", function () {
  let id = this.id;
  let name = editName.value;
  let lname = editLname.value;
  let phone = editPhone.value;
  let image = editImage.value;
  if (!name || !lname || !phone || !image) return;
  let editedContact = {
    name: name,
    lname: lname,
    phone: phone,
    image: image,
  };
  saveEdit(editedContact, id);
});
function saveEdit(editedContact, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedContact),
  }).then(() => {
    salamat();
  });
  let modal = bootsrap.modal.getInstance(exampleModal);
  modal.hide();
}
