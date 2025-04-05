document.addEventListener("DOMContentLoaded", () => {
    console.log("Script.js loaded");

    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeModal");
    const token = localStorage.getItem("token");
    const welcomeModalElement = document.getElementById('welcomeModal');

    if (!token && !hasSeenWelcome && welcomeModalElement) {
        const welcomeModal = new bootstrap.Modal(welcomeModalElement);
        welcomeModal.show();

        function markModalSeenAndCleanUp() {
            localStorage.setItem("hasSeenWelcomeModal", "true");

            // Forcefully hide and dispose modal properly
            welcomeModal.hide();

            // Clean up backdrop and modal-open class manually (forcefully)
            document.body.classList.remove('modal-open');
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
        }

        document.getElementById('continueAsGuest').addEventListener('click', function () {
            markModalSeenAndCleanUp();
        });

        document.getElementById('loginButton').addEventListener('click', function () {
            markModalSeenAndCleanUp();
            window.location.href = 'login.html';
        });

        document.getElementById('signupButton').addEventListener('click', function () {
            markModalSeenAndCleanUp();
            window.location.href = 'signup.html';
        });
    }

    // Shopping cart logic
    let cart = [];

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart")) {
            const productId = event.target.getAttribute("data-id");
            addToCart(productId);
        }
    });

    function addToCart(productId) {
        cart.push(productId);
        console.log("Cart:", cart);
        alert("Item added to cart!");
    }
});
