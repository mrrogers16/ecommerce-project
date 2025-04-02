document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartContainer || !cartTotal) {
        console.error("❌ Error: Required elements not found on the cart page!");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    

    function renderCart() {
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
                        <p class="card-text"><strong>Brand:</strong> ${product.brand || 'N/A' }</p>
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

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-from-cart")) {
            const index = event.target.getAttribute("data-index");
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            updateCartCount(); //updates
        }
    });

    renderCart();
});
// updates the cart count
function updateCartCount() { //currently isnt working
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.length;
    document.getElementById('cart-count').textContent = cartCount;
}

// Handles clear cart button
const clearCartBtn = document.getElementById("clearCart");
if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
        localStorage.removeItem("cart");
        cart = [];
        renderCart();
        updateCartCount();
    });
}

// normalizes cart items to ensure consistency
function normalizeCartItems() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Ensure all cart items have consistent property names
    cart = cart.map(item => {
        return {
            id: item.id,
            name: item.name,
            brand: item.brand || "N/A",
            price: parseFloat(item.price),
            image: item.image || item.image_url, // Handles both formats
            selectedSize: item.selectedSize
        };
    });
    
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
}

// Calls when loading the cart page
document.addEventListener("DOMContentLoaded", () => {
    cart = normalizeCartItems();
    renderCart();
    updateCartCount();
});
// Call this function when the page loads or after adding/removing items from the cart
updateCartCount();