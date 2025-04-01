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

            // Check for gender/category filter in URL
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get("category");

            let filteredShoes = shoes;
            if (category && category !== "All Shoes") {
                filteredShoes = shoes.filter(shoe =>
                    shoe.gender && shoe.gender.toLowerCase() === category.toLowerCase()
                );
            }

            if (!Array.isArray(filteredShoes) || filteredShoes.length === 0) {
                console.warn("⚠ No products found.");
                productList.innerHTML = `<p class="text-center">No products available.</p>`;
                return;
            }

            // Insert dynamically generated product cards
            productList.innerHTML = `<div class="row g-4">${filteredShoes.map(generateProductCard).join("")}</div>`;
        })
        .catch(error => {
            console.error("❌ Error fetching shoes:", error);
            productList.innerHTML = `<p class="text-center text-danger">Failed to load products. Please try again later.</p>`;
        });

    // Function to generate HTML for each product
    function generateProductCard(product) {
        return `
            <div class="col-md-4">
                <a href="product-details.html?id=${product.id}">
                    <div class="card">
                        <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">$${product.price}</p>
                            <button class="btn btn-primary add-to-cart"
                                data-id="${product.id}"
                                data-name="${product.name}"
                                data-price="${product.price}"
                                data-image="${product.image_url}"
                                data-sizes='${JSON.stringify(product.sizes)}'>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }

    // Handle "Add to Cart" Click
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart")) {
            console.log("Add to Cart button clicked");
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
            console.log("Selected product:", selectedProduct);

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
        selectedProduct.selectedSize = selectedProduct.selectedSize || 7; // Default to "N/A" if not selected

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