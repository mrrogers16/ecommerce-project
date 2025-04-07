document.addEventListener('DOMContentLoaded', () => {
    // Get cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');
    const placeOrderButton = document.getElementById('place-order');

    // Constants
    const SHIPPING_COST = 10.00;

    // Render order items and calculate totals
    function renderOrderSummary() {
        let subtotal = 0;
        
        // Clear existing items
        orderItems.innerHTML = '';

        // Add each item to the order summary
        cart.forEach(item => {
            const itemTotal = item.price;
            subtotal += itemTotal;

            orderItems.innerHTML += `
                <div class="order-item">
                    <div class="d-flex align-items-center">
                        <div class="order-item-image">
                            <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
                        </div>
                        <div class="order-item-details">
                            <h6 class="mb-1">${item.name}</h6>
                            <p class="text-muted mb-1">Size: ${item.selectedSize}</p>
                            <p class="item-price mb-0">$${itemTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        // Update totals
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${SHIPPING_COST.toFixed(2)}`;
        totalElement.textContent = `$${(subtotal + SHIPPING_COST).toFixed(2)}`;
    }

    // Form validation
    function validateForms() {
        const shippingForm = document.getElementById('shipping-form');
        const paymentForm = document.getElementById('payment-form');
        
        return shippingForm.checkValidity() && paymentForm.checkValidity();
    }

    // Handle order placement
    placeOrderButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (!validateForms()) {
            alert('Please fill in all required fields');
            return;
        }

        // In a real application, you would:
        // 1. Send the order data to your backend
        // 2. Process the payment
        // 3. Create the order in your database
        // 4. Send confirmation email
        
        // For now, we'll just show a success message and clear the cart
        alert('Order placed successfully! Thank you for your purchase.');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });

    // Initialize the page
    renderOrderSummary();

    // Add input validation for payment fields
    const cardNumber = document.getElementById('cardNumber');
    const expiry = document.getElementById('expiry');
    const cvv = document.getElementById('cvv');

    cardNumber.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 16);
    });

    expiry.addEventListener('input', (e) => {
        e.target.value = e.target.value
            .replace(/\D/g, '')
            .substring(0, 4)
            .replace(/(\d{2})(\d)/, '$1/$2');
    });

    cvv.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
    });
}); 