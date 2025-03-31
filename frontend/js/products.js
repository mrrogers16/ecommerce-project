document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Fetching products from API...");

    const productList = document.getElementById("product-list");
    const sizeModal = document.getElementById("sizeModal");
    const sizeOptions = document.getElementById("sizeOptions");
    const confirmSizeButton = document.getElementById("confirmSize");
    const closeModalButton = document.querySelector(".close");

    if (!productList || !sizeModal) {
        console.error("❌ Error: Required elements not found!");
        return;
    }

    // Ensure modal is hidden when page loads
    sizeModal.style.display = "none";

    let selectedProduct = null;

    // Fetch products from the live API
    fetch("https://fly-feet.com/api/shoes")
        .then(response => response.json())
        .then(data => {
            console.log("✅ API Response:", data);
            
            // Extract the shoes array from the results property
            const shoes = data.results;

            if (!Array.isArray(shoes) || shoes.length === 0) {
                console.warn("⚠ No products found.");
                productList.innerHTML = `<p class="text-center">No products available.</p>`;
                return;
            }

            // Insert dynamically generated product cards
            productList.innerHTML = `<div class="row g-4">${shoes.map(generateProductCard).join("")}</div>`;
        })
        .catch(error => {
            console.error("❌ Error fetching shoes:", error);
            productList.innerHTML = `<p class="text-center text-danger">Failed to load products. Please try again later.</p>`;
        });

    // Function to generate HTML for each product
    function generateProductCard(product) {
        // Sanitize data before insertion
        const sanitize = str => String(str).replace(/[&<>"']/g, char => {
            const entities = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return entities[char];
        });

        // Format price safely
        const formatPrice = (price) => {
            const numPrice = parseFloat(price);
            return !isNaN(numPrice) ? numPrice.toFixed(2) : 'N/A';
        };

        return `
    <div class="col-md-4 d-flex">
        <div class="card shadow-sm w-100">
                    <img src="${sanitize(product.image_url || '')}" class="card-img-top" alt="${sanitize(product.name || '')}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${sanitize(product.name || '')}</h5>
                        <p class="card-text"><strong>Brand:</strong> ${sanitize(product.brand || '')}</p>
                        <p class="card-text"><strong>Price:</strong> ${product.price ? '$' + formatPrice(product.price) : 'N/A'}</p>
                        <p class="card-text"><strong>Sizes:</strong> ${product.sizes ? sanitize(product.sizes.join(", ")) : "N/A"}</p>
                        <button class="btn btn-success add-to-cart" 
                            data-id="${sanitize(product.id || '')}" 
                            data-name="${sanitize(product.name || '')}" 
                            data-brand="${sanitize(product.brand || '')}" 
                            data-price="${product.price ? sanitize(String(product.price)) : ''}" 
                            data-image="${sanitize(product.image_url || '')}" 
                            data-sizes='${sanitize(JSON.stringify(product.sizes || []))}'>Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Handle "Add to Cart" Click
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart")) {
            const button = event.target;
            selectedProduct = {
                id: button.getAttribute("data-id"),
                name: button.getAttribute("data-name"),
                brand: button.getAttribute("data-brand"),
                price: parseFloat(button.getAttribute("data-price")),
                image: button.getAttribute("data-image"),
                sizes: JSON.parse(button.getAttribute("data-sizes")),
                selectedSize: null,
            };

            showSizeModal();
        }
    });

    function showSizeModal() {
        if (!selectedProduct || !sizeOptions) return;
        
        // Clear previous event listeners by replacing the element
        const newSizeOptions = sizeOptions.cloneNode(false);
        sizeOptions.parentNode.replaceChild(newSizeOptions, sizeOptions);
        sizeOptions = newSizeOptions;

        sizeOptions.innerHTML = selectedProduct.sizes.map(size => `
            <button class="size-btn" data-size="${size}">${size}</button>
        `).join("");

        sizeModal.style.display = "flex";

        // Add event listeners to new buttons
        document.querySelectorAll(".size-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                selectedProduct.selectedSize = btn.getAttribute("data-size");
            });
        });
    }

    // Add null checks for DOM elements
    if (!sizeOptions || !confirmSizeButton || !closeModalButton) {
        console.error("❌ Error: Required modal elements not found!");
        return;
    }

    // Confirm size selection
    confirmSizeButton.onclick = () => {
        if (!selectedProduct.selectedSize) {
            alert("Please select a size.");
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(selectedProduct);
        localStorage.setItem("cart", JSON.stringify(cart));

        alert(`${selectedProduct.name} (Size ${selectedProduct.selectedSize}) added to cart!`);
        sizeModal.style.display = "none"; // Close the modal after confirming
    };

    // Close modal when clicking "X"
    closeModalButton.addEventListener("click", () => {
        sizeModal.style.display = "none";
    });

    // Close modal when clicking outside the content box
    window.addEventListener("click", (event) => {
        if (event.target === sizeModal) {
            sizeModal.style.display = "none";
        }
    });
});
