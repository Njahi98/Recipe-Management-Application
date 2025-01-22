const trashcan = document.querySelector(".delete-btn");

trashcan.addEventListener("click", (e) => {
  const endpoint = `/recipes/${trashcan.dataset.doc}`;

  fetch(endpoint, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => (window.location.href = data.redirect))
    .catch((err) => console.log(err));
});