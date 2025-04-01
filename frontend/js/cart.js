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
                        <p class="card-text"><strong>Brand:</strong> ${product.brand}</p>
                        <p class="cart-text"><strong>Size:</strong> ${product.selectedSize}</p>
                        <p class="cart-text"><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                        <button class="btn btn-danger remove-from-cart" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;
            cartContainer.appendChild(cartItem);
        });

        cartTotal.textContent = total.toFixed(2);
    }

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-from-cart")) {
            const index = event.target.getAttribute("data-index");
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
            updateCartCount(); //updates cart count in navbar 
        }
    });

    renderCart();
});
// This function will update the cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.length;
    document.getElementById('cart-count').textContent = cartCount;
}

// Call this function when the page loads or after adding/removing items from the cart
updateCartCount();