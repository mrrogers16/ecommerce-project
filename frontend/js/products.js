document.addEventListener("DOMContentLoaded", () => {
    console.log("Fetching products from API...");

    const productList = document.getElementById("product-list");
    const sizeModal = document.getElementById("sizeModal");
    const sizeOptions = document.getElementById("sizeOptions");
    const confirmSizeButton = document.getElementById("confirmSize");
    const closeModalButton = document.querySelector(".close");

    if (!productList || !sizeModal) {
        console.error("Error: Required elements not found!");
        return;
    }

    // Ensure modal is hidden when page loads
    sizeModal.style.display = "none";

    let selectedProduct = null;
    let allProducts = []; // Store all products

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

    // Fetch products from the API endpoint
    fetch("https://fly-feet.com/api/shoes")
        .then(response => response.json())
        .then(data => {
            console.log("✅ API Response:", data);
            allProducts = data.results;

            // Initialize filters
            initializeFilters(allProducts);

            // Initial render of products
            renderProducts(allProducts);
        })
        .catch(error => {
            console.error(" Error fetching shoes:", error);
            productList.innerHTML = `<p class="text-center text-danger">Failed to load products. Please try again later.</p>`;
        });

    function initializeFilters(products) {
        // Get unique brands
        const brands = [...new Set(products.map(p => p.brand))].sort();
        const brandSelect = document.getElementById('brand-select');
        brands.forEach(brand => {
            if (brand) { // Only add non-empty brands
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                brandSelect.appendChild(option);
            }
        });

        // Get unique sizes
        const sizes = [...new Set(products.flatMap(p => p.sizes))].sort((a, b) => a - b);
        const sizeSelect = document.getElementById('size-select');
        sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });
    }

    function applyFilters() {
        const brandFilter = document.getElementById('brand-select').value;
        const sizeFilter = document.getElementById('size-select').value;
        const minPrice = parseFloat(document.getElementById('price-min').value) || 0;
        const maxPrice = parseFloat(document.getElementById('price-max').value) || Infinity;

        let filtered = allProducts.filter(product => {
            const matchesBrand = !brandFilter || product.brand === brandFilter;
            const matchesSize = !sizeFilter || product.sizes.includes(parseFloat(sizeFilter));
            const matchesPrice = product.price >= minPrice &&
                (!maxPrice || product.price <= maxPrice);

            return matchesBrand && matchesSize && matchesPrice;
        });

        // Apply current sort
        const sortValue = document.getElementById('sort-select').value;
        filtered = sortProducts(filtered, sortValue);

        renderProducts(filtered);
    }

    // Add event listeners for filters
    document.getElementById('apply-filters')?.addEventListener('click', applyFilters);
    document.getElementById('clear-filters')?.addEventListener('click', () => {
        document.getElementById('brand-select').value = '';
        document.getElementById('size-select').value = '';
        document.getElementById('price-min').value = '';
        document.getElementById('price-max').value = '';
        document.getElementById('sort-select').value = 'default';
        renderProducts(allProducts);
    });

    // Sort products function
    function sortProducts(products, sortBy) {
        const sorted = [...products];
        switch (sortBy) {
            case 'price-asc':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }
        return sorted;
    }

    function renderProducts(products) {
        if (!Array.isArray(products) || products.length === 0) {
            productList.innerHTML = `<p class="text-center">No products found matching your criteria.</p>`;
            return;
        }

        productList.innerHTML = `<div class="row g-4">${products.map(generateProductCard).join("")}</div>`;
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

    // Add this function at the top level of your script
    function showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;

        // Add to document
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Then modify the confirm size button click handler
    confirmSizeButton.onclick = () => {
        if (!selectedProduct.selectedSize) {
            showToast("Please select a size");
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(selectedProduct);
        localStorage.setItem("cart", JSON.stringify(cart));

        const token = localStorage.getItem('token');
        if (!token) {
            showToast("Please log in to add items to your cart.");
            sizeModal.style.display = "none";
            return;
        }

        fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                shoe_id: selectedProduct.id,
                quantity: 1,
                selectedSize: selectedProduct.selectedSize
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add item to backend cart');
                }
                return response.json();
            })
            .then(data => {
                console.log('Backend cart updated', data);
                window.updateCartCount && window.updateCartCount();
                showToast(`${selectedProduct.name} (Size ${selectedProduct.selectedSize}) added to cart`)
            })
            .catch(error => {
                console.error('Error adding to backend cart:', error);
                showToast('Error adding to cart. Please try again.');
            });

        sizeModal.style.display = 'none';
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

    // Add sort change listener
    document.getElementById('sort-select')?.addEventListener('change', (e) => {
        const sorted = sortProducts(allProducts, e.target.value);
        renderProducts(sorted);
    });
});