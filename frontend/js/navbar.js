document.addEventListener("DOMContentLoaded", () => {
    // Get current page URL path (e.g., "contact.html")
    let currentPage = window.location.pathname.split("/").pop();

    // Find the matching navbar link and add "active" class
    document.querySelectorAll("#navbar a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
});
