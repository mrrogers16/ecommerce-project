document.addEventListener("DOMContentLoaded", () => {
  const drawer = document.getElementById("side-drawer");
  const toggleBtn = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("close-drawer");
  const shopToggle = document.getElementById("shop-toggle");
  const shopParent = shopToggle?.closest(".has-submenu");

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener("click", () => {
      drawer.classList.add("open");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      drawer.classList.remove("open");
    });
  }

  if (shopToggle && shopParent) {
    shopToggle.addEventListener("click", (e) => {
      e.preventDefault();
      shopParent.classList.toggle("open");
    });
  }
});
