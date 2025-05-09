document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        try {
            const res = await fetch("/api/customers/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok && data.token) {
                // Save the token for later use
                localStorage.setItem("token", data.token);

                // Decode the token and redirect accordingly
                const payload = JSON.parse(atob(data.token.split('.')[1]));
                const role = payload.role;

                // Send a message to clean up the backdrop before redirect
                window.postMessage('removeBackdrop', '*');

                // Redirect based on the user's role
                if (role === "admin") {
                    window.location.href = "/static_pages/admin.html";
                } else {
                    window.location.href = "shop.html";
                }
            } else {
                alert(data.error || "Login failed. Please try again.");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong while logging in.");
        }
    });
});
