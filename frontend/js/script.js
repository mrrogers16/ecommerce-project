document.addEventListener("DOMContentLoaded", () => {
    console.log("Script.js loaded");


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
