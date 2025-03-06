document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Products.js loaded!");

    const productList = document.getElementById("product-list");

    if (!productList) {
        console.error("❌ Error: Product list container not found!");
        return;
    }

    // Example Product Data (You can replace this with an API fetch)
    const products = [
        { id: 1, name: "Running Shoes", price: 59.99, image: "../assets/images/shoe1.jpg" },
        { id: 2, name: "Casual Sneakers", price: 49.99, image: "../frontend/assets/images/shoe2.jpg" },
        { id: 3, name: "Basketball Shoes", price: 89.99, image: "../frontend/assets/images/shoe3.jpg" }
    ];

    // Function to generate Bootstrap-styled product cards
    function generateProductCard(product) {
        return `
            <div class="col-md-4">
                <div class="card shadow-sm">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">$${product.price.toFixed(2)}</p>
                        <button class="btn btn-success add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Insert product cards into the page
    productList.innerHTML = `<div class="row g-4">${products.map(generateProductCard).join("")}</div>`;

    console.log("✅ Products added to the page!");

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", event => {
            const productId = event.target.getAttribute("data-id");
            addToCart(productId);
        });
    });

    // Function to handle adding to cart
    function addToCart(productId) {
        console.log(`🛒 Product ${productId} added to cart!`);
        alert(`Product ${productId} added to cart!`);
    }
});
