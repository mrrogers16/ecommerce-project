document.addEventListener("DOMContentLoaded", () => {
    const productId = new URLSearchParams(window.location.search).get('id'); // Get the product ID from the URL

    if (!productId) {
        console.error("❌ No product ID provided in URL.");
        return;
    }

    // Fetch product data using the product ID
    fetch(`https://fly-feet.com/api/shoes/${productId}`)
        .then(response => response.json())
        .then(data => {
            const product = data; // Assuming the product data is returned directly
            populateProductDetails(product);
        })
        .catch(error => {
            console.error("❌ Error fetching product details:", error);
            document.getElementById("product-detail").innerHTML = `<p class="text-center text-danger">Failed to load product details. Please try again later.</p>`;
        });

    // Function to populate product details on the page
    function populateProductDetails(product) {
        const productDetail = document.getElementById("product-detail");

        productDetail.innerHTML = `
            <div class="col-md-6">
                <img src="${product.image_url}" class="img-fluid" alt="${product.name}">
            </div>
            <div class="col-md-6">
                <h2 id="product-name">${product.name}</h2>
                <p><strong>Brand:</strong> ${product.brand}</p>
                <p><strong>Price:</strong> $${product.price}</p>
                <p><strong>Sizes:</strong> ${product.sizes.join(", ")}</p>
                <p><strong>Description:</strong> ${product.description || "No description available."}</p>
                <button class="btn btn-success add-to-cart" 
                        data-id="${product.id}" 
                        data-name="${product.name}" 
                        data-brand="${product.brand}" 
                        data-price="${product.price}" 
                        data-image="${product.image_url}" 
                        data-sizes='${JSON.stringify(product.sizes)}'>
                    Add to Cart
                </button>
            </div>
        `;
    }

    // Handle "Add to Cart" Click
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart")) {
            const button = event.target;
            const selectedProduct = {
                id: button.getAttribute("data-id"),
                name: button.getAttribute("data-name"),
                brand: button.getAttribute("data-brand"),
                price: parseFloat(button.getAttribute("data-price")),
                image: button.getAttribute("data-image"),
                sizes: JSON.parse(button.getAttribute("data-sizes")),
                selectedSize: null,
            };

            // Show the size modal (assuming the modal functionality is the same as before)
            showSizeModal(selectedProduct);
        }
    });

    function showSizeModal(selectedProduct) {
        const sizeModal = document.getElementById("sizeModal");
        const sizeOptions = document.getElementById("sizeOptions");

        sizeOptions.innerHTML = selectedProduct.sizes.map(size => `
            <button class="size-btn" data-size="${size}">${size}</button>
        `).join("");

        sizeModal.style.display = "flex";

        document.querySelectorAll(".size-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                selectedProduct.selectedSize = btn.getAttribute("data-size");
            });
        });

        document.getElementById("confirmSize").onclick = () => {
            if (!selectedProduct.selectedSize) {
                alert("Please select a size.");
                return;
            }

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push(selectedProduct);
            localStorage.setItem("cart", JSON.stringify(cart));

            alert(`${selectedProduct.name} (Size ${selectedProduct.selectedSize}) added to cart!`);
            sizeModal.style.display = "none";
        };
    }
});