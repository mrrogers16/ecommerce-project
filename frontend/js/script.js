document.addEventListener("DOMContentLoaded", () => {
    console.log("Script.js loaded");

    // First visit modal logic
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeModal");
    const token = localStorage.getItem("token");
    const welcomeModalElement = document.getElementById('welcomeModal');

    if (!token && !hasSeenWelcome && welcomeModalElement) {
        const welcomeModal = new bootstrap.Modal(welcomeModalElement);
        welcomeModal.show();

        // Mark as seen to prevent future popups
        localStorage.setItem("hasSeenWelcomeModal", "true");

        // Close modal when 'Continue as Guest' is clicked
        document.getElementById('continueAsGuest').addEventListener('click', function () {
            welcomeModal.hide();
        });

        // Redirect to login or sign up pages when respective buttons are clicked
        document.getElementById('loginButton').addEventListener('click', function () {
            window.location.href = 'login.html';
        });

        document.getElementById('signupButton').addEventListener('click', function () {
            window.location.href = 'signup.html';
        });
    }

    // Shopping cart logic
    let cart = [];

    // Listen for add-to-cart clicks globally
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart")) {
            const productId = event.target.getAttribute("data-id");
            addToCart(productId);
        }
    });

    // Add item to cart function
    function addToCart(productId) {
        cart.push(productId);
        console.log("Cart:", cart);
        alert("Item added to cart!");
    }
});
