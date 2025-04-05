// frontend/js/adminLink.js

document.addEventListener("DOMContentLoaded", () =>
{
    const adminLinkContainer = document.getElementById("admin-panel-link");

    const token = localStorage.getItem("token");
    if (!token) return;

    try
    {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (payload.role === "admin")
        {
            const link = document.createElement("a");
            link.href = "../static_pages/admin.html";
            link.textContent = "Admin Panel";
            link.style.color = "#fff";
            link.style.backgroundColor = "#0b2f98";
            link.style.padding = "10px 16px";
            link.style.borderRadius = "8px";
            link.style.textDecoration = "none";
            link.style.fontWeight = "bold";
            link.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";

            adminLinkContainer.appendChild(link);
        }
    }
    catch (err)
    {
        console.error("Could not decode token:", err);
    }
});
