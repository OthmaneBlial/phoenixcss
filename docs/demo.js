// Example interactions only. PhoenixCSS does not ship a JavaScript runtime.
const dialog = document.getElementById("exampleModal");
const openDialog = document.getElementById("openModal");
const closeDialog = document.getElementById("closeModal");
const modalAction = document.getElementById("modalAction");

let dialogOpener;
openDialog.addEventListener("click", () => {
  dialogOpener = openDialog;
  dialog.showModal();
  closeDialog.focus();
});

closeDialog.addEventListener("click", () => dialog.close());
modalAction.addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => dialogOpener?.focus());

const navToggle = document.getElementById("exampleNavToggle");
const navMenu = document.getElementById("exampleNavMenu");
const compactNavigation = window.matchMedia("(max-width: 767px)");

function setNavigationOpen(open) {
  navMenu.hidden = !open;
  navToggle.setAttribute("aria-expanded", String(open));
}

function syncNavigation() {
  const compact = compactNavigation.matches;
  navToggle.hidden = !compact;
  setNavigationOpen(!compact);
}

navToggle.addEventListener("click", () => {
  setNavigationOpen(navMenu.hidden);
});

navMenu.addEventListener("click", (event) => {
  if (compactNavigation.matches && event.target.closest("a")) {
    setNavigationOpen(false);
  }
});

compactNavigation.addEventListener("change", syncNavigation);
syncNavigation();
