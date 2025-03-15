
/*  not sure if this is works lol */

document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const clearCartButton = document.getElementById("clearCart");

    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const sizeModal = document.getElementById("sizeModal");
    const sizeOptionsContainer = document.getElementById("sizeOptions");
    const confirmSizeButton = document.getElementById("confirmSize");
    const closeModal = document.querySelector(".close");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let selectedProduct = null;
    let selectedSize = null;

    // 🔹 Ensure modal is hidden when page loads
    if (sizeModal) {
        sizeModal.classList.add("hidden");
    }

    // 🔹 Open modal only when "Add to Cart" is clicked
    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            selectedProduct = {
                id: button.getAttribute("data-id"),
                name: button.getAttribute("data-name"),
                brand: button.getAttribute("data-brand"),
                price: parseFloat(button.getAttribute("data-price")),
                image: button.getAttribute("data-image"),
                sizes: [6, 7, 8, 9, 10] // Example sizes
            };

            showSizeSelection(selectedProduct);
        });
    });

    // 🔹 Show modal with available sizes
    function showSizeSelection(product) {
        sizeOptionsContainer.innerHTML = "";
        selectedSize = null;

        product.sizes.forEach(size => {
            const sizeBtn = document.createElement("button");
            sizeBtn.classList.add("size-btn");
            sizeBtn.textContent = size;
            sizeBtn.addEventListener("click", (event) => selectSize(size, event));
            sizeOptionsContainer.appendChild(sizeBtn);
        });

        sizeModal.classList.remove("hidden"); // Show modal
    }

    // 🔹 When user selects a size
    function selectSize(size, event) {
        selectedSize = size;

        document.querySelectorAll("#sizeModal .size-btn").forEach(btn => btn.classList.remove("active"));
        event.target.classList.add("active");

        confirmSizeButton.disabled = false;
    }

    // 🔹 Add selected product to cart
    function addToCart() {
        if (!selectedSize) {
            alert("Please select a size before adding to cart.");
            return;
        }

        selectedProduct.size = selectedSize;
        cart.push(selectedProduct);
        localStorage.setItem("cart", JSON.stringify(cart));
        sizeModal.classList.add("hidden"); // Hide modal after adding to cart
        alert(`${selectedProduct.name} (Size ${selectedSize}) added to cart!`);
    }

    // 🔹 Attach click event to Confirm button
    confirmSizeButton.addEventListener("click", addToCart);

    // 🔹 Close modal when clicking "X"
    closeModal.addEventListener("click", () => {
        sizeModal.classList.add("hidden");
    });

    // 🔹 Close modal when clicking outside
    window.addEventListener("click", (event) => {
        if (event.target === sizeModal) {
            sizeModal.classList.add("hidden");
        }
    });

    // 🔹 Ensure cart functionality works
    function renderCart() {
        cartContainer.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
            cartTotal.textContent = "0.00";
            return;
        }

        cart.forEach((product, index) => {
            total += product.price;

            const cartItem = document.createElement("div");
            cartItem.classList.add("col-md-4");
            cartItem.innerHTML = `
                <div class="card shadow-sm">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text"><strong>Brand:</strong> ${product.brand}</p>
                        <p class="card-text"><strong>Size:</strong> ${product.size}</p>
                        <p class="card-text"><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                        <button class="btn btn-danger remove-from-cart" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;
            cartContainer.appendChild(cartItem);
        });

        cartTotal.textContent = total.toFixed(2);
    }

    // 🔹 Remove Item from Cart
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-from-cart")) {
            const index = event.target.getAttribute("data-index");
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        }
    });

    // 🔹 Ensure Clear Cart works
    if (clearCartButton) {
        clearCartButton.addEventListener("click", () => {
            localStorage.removeItem("cart");
            cart = [];
            renderCart();
        });
    }

    renderCart(); // Initial render
});
