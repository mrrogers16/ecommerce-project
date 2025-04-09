document.addEventListener("DOMContentLoaded", () => {
    console.log("Fetching products from API...");

    const productList = document.getElementById("product-list");
    const paginationContainer = document.getElementById("pagination-container");
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
    let currentPage = 1;
    let totalPages = 1;

    // Get category from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    // Function to generate HTML for each product
    function generateProductCard(product) {
        return `
            <div class="col-md-4">
                <div class="card">
                    <a href="product-details.html?id=${product.id}">
                        <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">$${product.price}</p>
                        </div>
                    </a>
                    <div class="card-footer text-center">
                        <a href="product-details.html?id=${product.id}" class="btn btn-primary">
                            Show Details
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // Function to fetch products from API with pagination    
    function fetchProducts(page = 1) {
        currentPage = page; // Update current page
        
        const apiUrl = `https://fly-feet.com/api/shoes?page=${currentPage}&limit=10`;
    
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log("✅ API Response:", data);
                allProducts = data.results; // Store all products for the current page
                totalPages = data.totalPages; // Update total pages for pagination
    
                renderProducts(allProducts); // Render products
                renderPagination(); // Update pagination controls
            })
            .catch(error => {
                console.error("Error fetching shoes:", error);
                productList.innerHTML = `<p class="text-center text-danger">Failed to load products. Please try again later.</p>`;
            });
    }
    

    // Fetch products from the API endpoint with category filter
    let apiUrl = "https://fly-feet.com/api/shoes";
    if (category && category !== "All Shoes") {
        apiUrl += `?category=${encodeURIComponent(category.toLowerCase())}`;
    }

    fetch(apiUrl)
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
            console.error("Error fetching shoes:", error);
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

    function createPaginationButton(text, onClick, disabled) {
        const button = document.createElement("button");
        button.textContent = text;
        button.disabled = disabled;
        button.onclick = onClick;
        return button;
    }

    function renderPagination() {
        const paginationContainer = document.getElementById("paginationContainer");
        if (!paginationContainer){
            console.error("Pagination container not found!");
            return;
        } 
        paginationContainer.innerHTML = ""; // Clear previous pagination
    
        // Add First, Previous, Next, Last buttons based on the current page
        const firstButton = createPaginationButton("First", () => fetchProducts(1), currentPage === 1);
        const prevButton = createPaginationButton("Previous", () => fetchProducts(currentPage - 1), currentPage === 1);
        const nextButton = createPaginationButton("Next", () => fetchProducts(currentPage + 1), currentPage === totalPages);
        const lastButton = createPaginationButton("Last", () => fetchProducts(totalPages), currentPage === totalPages);
    
        const pageInfo = document.createElement("span");
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
        const jumpInput = document.createElement("input");
        jumpInput.type = "number";
        jumpInput.min = 1;
        jumpInput.max = totalPages;
        jumpInput.placeholder = "Page #";
        jumpInput.style.width = "70px";
        jumpInput.onchange = () => {
            const targetPage = Math.max(1, Math.min(totalPages, parseInt(jumpInput.value)));
            if (targetPage && targetPage !== currentPage) {
                fetchProducts(targetPage);
            }
        };
    
        paginationContainer.append(firstButton, prevButton, pageInfo, nextButton, lastButton, jumpInput);
    }

    fetchProducts(1);

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

    // Update the confirm size button click handler
    confirmSizeButton.onclick = () => {
        if (!selectedProduct.selectedSize) {
            showToast("Please select a size");
            return;
        }

        const quantity = parseInt(document.getElementById('quantity')?.value || 1);

        addToCart(
            selectedProduct.id,
            selectedProduct.selectedSize,
            quantity,
            selectedProduct.name,
            selectedProduct.image,
            selectedProduct.price
        );

        showToast("Item added to cart successfully!");
        sizeModal.style.display = "none";
        window.updateCartCount(); // Update cart count
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