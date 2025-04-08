document.addEventListener("DOMContentLoaded", () => {
    const productId = new URLSearchParams(window.location.search).get('id'); // Get the product ID from the URL
    const addToCartBtn = document.getElementById("add-to-cart-btn");

    // Fetch product data using the product ID
    fetch(`https://fly-feet.com/api/shoes/${productId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log the response to check its structure

            // Check if the product data exists
            const product = data; // No need to access 'product' if it's the top-level object

            if (!product) {
                console.error('Product not found!');
                return;
            }

            // Populate product details on the page
            document.getElementById("product-name").innerText = product.name;
            document.getElementById("product-image").src = product.image_url;
            document.getElementById("product-description").innerText = product.description;
            document.getElementById("product-price").innerText = `$${product.price}`;
            document.getElementById("product-quantity").innerText = `${product.stock} left in stock`;
            document.getElementById("product-brand").innerText = product.brand;

            // Populate size options
            const sizeSelect = document.getElementById("size-select");
            product.sizes.forEach(size => {
                const option = document.createElement("option");
                option.value = size;
                option.innerText = size;
                sizeSelect.appendChild(option);
            });

            // Handle add to cart functionality here...
            addToCartBtn.addEventListener("click", () => {
                const selectedSize = sizeSelect.value;
                // addToCart() is inside of script.js
                addToCart(product.id,
                    selectedSize,
                    1,
                    product.name,
                    product.image_url,
                    parseFloat(product.price)
                );
            });
        })
        .catch(error => {
            console.error("Error fetching product details:", error);
        });
});