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
    // We are using the localStorage cart only for display on the actual checkout page.
    // The real checkout logic is based on the server side cart table.
    placeOrderButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (!validateForms()) {
            alert('Please fill in all required fields');
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to place an order.');
            return;
        }

        // If you have a discount code input, replace null
        const orderData = {
            discount_code: null
        };

        fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Order Created', data);

                alert('Order placed successfully! Thank you for your purchase.');
                localStorage.removeItem('cart');
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Error placing order: ', error);
                alert('There was an issue placing your order. Please try again.');
            });
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