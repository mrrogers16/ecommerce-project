document.addEventListener("DOMContentLoaded", () => {
    console.log("Script.js loaded");

    // Example: Shopping cart array
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
