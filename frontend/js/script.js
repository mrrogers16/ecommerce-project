document.addEventListener("DOMContentLoaded", () => 
    {
        console.log("Script.js loaded");
    
        // First visit modal logic
        const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeModal");
        const token = localStorage.getItem("token");
        const welcomeModalElement = document.getElementById('welcomeModal');
    
        if (!token && !hasSeenWelcome && welcomeModalElement) 
        {
            const welcomeModal = new bootstrap.Modal(welcomeModalElement);
            welcomeModal.show();
    
            function markModalSeen()
            {
                localStorage.setItem("hasSeenWelcomeModal", "true");
            }
    
            document.getElementById('continueAsGuest').addEventListener('click', function () 
            {
                markModalSeen();
                welcomeModal.hide();
            });
    
            document.getElementById('loginButton').addEventListener('click', function () 
            {
                markModalSeen();
                window.location.href = 'login.html';
            });
    
            document.getElementById('signupButton').addEventListener('click', function () 
            {
                markModalSeen();
                window.location.href = 'signup.html';
            });
        }
    
        // Shopping cart logic
        let cart = [];
    
        document.addEventListener("click", (event) => 
        {
            if (event.target.classList.contains("add-to-cart")) 
            {
                const productId = event.target.getAttribute("data-id");
                addToCart(productId);
            }
        });
    
        function addToCart(productId) 
        {
            cart.push(productId);
            console.log("Cart:", cart);
            alert("Item added to cart!");
        }
    });
    