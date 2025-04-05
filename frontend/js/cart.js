// Make cart and functions available globally
let cart = [];
let cartContainer;
let cartTotal;

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.length;
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

function renderCart() {
    if (!cartContainer || !cartTotal) return;
    
    cartContainer.innerHTML = "";
    let totalPrice = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center">
                <p>Your cart is empty! Start shopping now.</p>
                <a href="shop.html" class="btn btn-primary">Browse Shoes</a>
            </div>
        `;
        cartTotal.textContent = "0.00";
        return;
    }

    cart.forEach((product, index) => {
        totalPrice += product.price;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item", "col-md-4");
        cartItem.innerHTML = `
            <div class="card shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body text-center">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text"><strong>Brand:</strong> ${product.brand || 'N/A'}</p>
                    <p class="cart-text"><strong>Size:</strong> ${product.selectedSize}</p>
                    <p class="cart-text"><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                    <button class="btn btn-danger remove-from-cart" data-index="${index}">Remove</button>
                </div>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    cartTotal.textContent = totalPrice.toFixed(2);
}

// Normalize cart items to ensure consistency
function normalizeCartItems() {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Ensure all cart items have consistent property names
    cartItems = cartItems.map(item => {
        return {
            id: item.id,
            name: item.name,
            brand: item.brand || "N/A",
            price: parseFloat(item.price),
            image: item.image || item.image_url, // Handle both formats
            selectedSize: item.selectedSize
        };
    });
    
    localStorage.setItem("cart", JSON.stringify(cartItems));
    return cartItems;
}

// Single DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
    // Initialize cart and elements
    cartContainer = document.getElementById("cart-items");
    cartTotal = document.getElementById("cart-total");
    cart = normalizeCartItems();
    
    // Set up event listeners
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-from-cart")) {
            const index = parseInt(event.target.getAttribute("data-index"));
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            updateCartCount();
        }
    });
    
    // Handle clear cart button
    const clearCartBtn = document.getElementById("clearCart");
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
            localStorage.removeItem("cart");
            cart = [];
            renderCart();
            updateCartCount();
        });
    }
    
    // Render cart and update count
    renderCart();
    updateCartCount();
});

// Make updateCartCount available globally so it can be called from other scripts
window.updateCartCount = updateCartCount;