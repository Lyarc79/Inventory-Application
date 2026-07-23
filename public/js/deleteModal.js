const deleteDialog = document.getElementById("delete-modal");
const deleteForm = document.getElementById("delete-form");
const itemNameSpan = document.getElementById("modal-item-name");
const itemTypeSpan = document.getElementById("modal-item-type");
document.querySelectorAll(".open-delete-btn").forEach((btn) =>
  btn.addEventListener("click", (e) => {
    const { name, type, action } = e.currentTarget.dataset;
    itemNameSpan.textContent = name;
    itemTypeSpan.textContent = type;
    deleteForm.setAttribute("action", action);
    deleteDialog.showModal();
  }),
);
document.getElementById("close-modal-btn").addEventListener("click", () => {
  deleteDialog.close();
});
