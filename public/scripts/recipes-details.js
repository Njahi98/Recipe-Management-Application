import { createModal } from "./modal.js";
const trashcan = document.querySelector(".delete-btn");


trashcan.addEventListener("click", () => {
  createModal('Are you sure?','Do you really want to delete this recipe? This action cannot be undone.',()=>{
    const endpoint = `/recipes/${trashcan.dataset.doc}`;
  
    fetch(endpoint, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => (window.location.href = data.redirect))
      .catch((err) => console.log(err));
  })
});




