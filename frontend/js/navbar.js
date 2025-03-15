document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav ul li a");
    const currentPage = window.location.pathname.split("/").pop(); // Get current page name

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active"); // Add active class only to the current page
        } else {
            link.classList.remove("active"); // Remove from others
        }
    });
});
