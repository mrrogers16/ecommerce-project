document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Fetching products from API...");

    const productList = document.getElementById("product-list");
    const sizeModal = document.getElementById("sizeModal"); // Ensure modal exists
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

    // Fetch products from the live API instead of using hardcoded data
    fetch("https://fly-feet.com/api/shoes") /*fetch("http://localhost:3000/api/shoes")*/  //This sends a request which is your backend API.
              // Convert response to JSON                                               //🔹 The backend returns a JSON response containing all the shoes from the database.
        .then(response => response.json())
        .then(shoes => {
            //This logs the shoe data in the console for debugging.
            console.log("✅ API Response:", shoes);

            if (!Array.isArray(shoes) || shoes.length === 0) {
                console.warn("⚠ No products found."); //Checks if shoes is an array Checks if there are no products (shoes.length === 0)
                productList.innerHTML = `<p class="text-center">No products available.</p>`;  //If empty, it shows a message instead of breaking the page
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
        return `
            <div class="col-md-4">
                <div class="card shadow-sm">
                    <img src="${product.image_url}" class="card-img-top" alt="${product.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text"><strong>Brand:</strong> ${product.brand}</p>
                        <p class="card-text"><strong>Price:</strong> $${product.price ? product.price.toFixed(2) : 'N/A'}</p>
                        <p class="card-text"><strong>Sizes:</strong> ${product.sizes ? product.sizes.join(", ") : "N/A"}</p>
                        <button class="btn btn-success add-to-cart" data-id="${product.id}" 
                            data-name="${product.name}" 
                            data-brand="${product.brand}" 
                            data-price="${product.price}" 
                            data-image="${product.image_url}" 
                            data-sizes='${JSON.stringify(product.sizes)}'>Add to Cart</button>
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
        if (!selectedProduct) return;
        sizeOptions.innerHTML = selectedProduct.sizes.map(size => `
            <button class="size-btn" data-size="${size}">${size}</button>
        `).join("");

        sizeModal.style.display = "flex"; // Show modal only when an item is added

        document.querySelectorAll(".size-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                selectedProduct.selectedSize = btn.getAttribute("data-size");
            });
        });
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
