document.addEventListener('DOMContentLoaded', async () => {
    // Get cart items from localStorage

    let cart = [];
    const orderItems = document.querySelector('.order-items');
    const subtotalElement = document.querySelector('.subtotal');
    const shippingElement = document.querySelector('.shipping');
    const taxElement = document.querySelector('.tax');
    const totalElement = document.querySelector('.total');
    const placeOrderButton = document.querySelector('.place-order-btn');
    const discountCodeInput = document.getElementById('discount-code');
    const applyDiscountBtn = document.getElementById('apply-discount');

    const discountLine = document.getElementById('discount-line');
    const discountAmountElement = document.getElementById('discount-amount');

    // Constants
    const SHIPPING_COST = 5.99;
    const TAX_RATE = 0.0825; // 8.25% tax rate

     // Store discount info
     let appliedDiscount = null;
     let discountAmount = 0;

    // New code: Fetch the real cart from backend
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to view your cart.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const res = await fetch('/api/cart', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch cart from server.');
        }

        const data = await res.json();
        cart = data.items || [];

        console.log('Cart loaded from server:', cart);

        renderOrderSummary(); // Only render AFTER cart is loaded
    }
    catch (error) {
        console.error('Error fetching cart:', error);
        alert('Unable to load cart. Please try again later.');
    }

    // Render order items and calculate totals
    function renderOrderSummary() {
        let subtotal = 0;

        // Clear existing items
        orderItems.innerHTML = '';

        if (cart.length === 0) {
            orderItems.innerHTML = `
                <div class="text-center py-4">
                    <p>Your cart is empty</p>
                    <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            return;
        }

        // Add each item to the order summary
        cart.forEach(item => {
            const itemTotal = item.price * (item.quantity || 1);
            subtotal += itemTotal;

            orderItems.innerHTML += `
                <div class="order-item">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h4 class="item-name">${item.name}</h4>
                        <p class="item-price">$${itemTotal.toFixed(2)}</p>
                        <p class="text-muted">Size: ${item.selectedSize}</p>
                        ${item.quantity > 1 ? `<p class="text-muted">Quantity: ${item.quantity}</p>` : ''}
                    </div>
                </div>
            `;
        });

        // Apply discount if any
    discountAmount = 0;
    if (appliedDiscount) {
        if (appliedDiscount.type === 'fixed') {
            discountAmount = appliedDiscount.discount_value;
        } else if (appliedDiscount.type === 'percent') {
            discountAmount = subtotal * (appliedDiscount.discount_value / 100);
        }
    }
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

        // Calculate tax and total
        const tax = (discountedSubtotal + SHIPPING_COST) * TAX_RATE;
        const total = discountedSubtotal + SHIPPING_COST + tax;

        // Update totals
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${SHIPPING_COST.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Show or hide discount line
        if (appliedDiscount) {
            discountLine.style.display = 'flex';
            discountAmountElement.textContent = `-$${discountAmount.toFixed(2)}`;
        } else {
            discountLine.style.display = 'none';
        }
    }

    applyDiscountBtn.addEventListener('click', () => {
        const code = discountCodeInput.value.trim();

        if (!code) {
            alert('Please enter a discount code.');
            return;
        }

        // Calculate cart total before discount
        const cartTotal = cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0) + SHIPPING_COST;

        // Send request to backend to validate discount code
        fetch('/api/discount_codes/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code, cartTotal })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error); // Show error if discount code is invalid
                } else {
                    appliedDiscount = data.discount; // Store discount data
                    alert('Discount code applied successfully!');
                    renderOrderSummary(); // Re-render order summary with discount applied
                }
            })
            .catch(error => {
                console.error('Error applying discount code:', error);
                alert('There was an issue applying the discount code. Please try again.');
            });
    });

    // Form validation
    function validateForms() {
        const shippingForm = document.getElementById('shipping-form');
        const paymentForm = document.getElementById('payment-form');
        const selectedPayment = document.querySelector('input[name="payment"]:checked');

        if (!selectedPayment) {
            alert('Please select a payment method');
            return false;
        }

        return shippingForm.checkValidity() && paymentForm.checkValidity();
    }

    // Handle order placement
    placeOrderButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (!validateForms()) {
            alert('Please fill in all required fields');
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to place an order.');
            window.location.href = 'login.html';
            return;
        }

        // Get form data
        const orderData = {
            shipping: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value
            },
            payment: {
                method: document.querySelector('input[name="payment"]:checked').id,
                cardNumber: document.getElementById('cardNumber')?.value,
                expiry: document.getElementById('expiry')?.value,
                cvv: document.getElementById('cvv')?.value,
                cardName: document.getElementById('cardName')?.value
            },
        };

        // Send order to backend
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
                console.log('Order Created', data.order);
                console.table(data.summary);
                alert(
                    `Thank you for  your purchase!\n\n` +
                    `Subtotal: $${data.summary.subtotal.toFixed(2)}\n` +
                    `Tax:      $${data.summary.tax.toFixed(2)}\n` +
                    `Total:    $${data.summary.total.toFixed(2)}`
                );

                localStorage.removeItem('cart');
                window.location.href = 'index.html';
            })
            .catch(err => {
                console.error('Order error:', err);
                alert('There was an issue placing your order. Please try again.');
            });
    });

    // Add payment method toggle functionality
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function () {
            document.querySelectorAll('.payment-info').forEach(info => {
                info.classList.remove('active');
            });
            document.getElementById(`${this.id}-form`).classList.add('active');
        });
    });
}); 
