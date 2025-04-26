document.addEventListener('DOMContentLoaded', () => {
    // Get cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.querySelector('.order-items');
    const subtotalElement = document.querySelector('.subtotal');
    const shippingElement = document.querySelector('.shipping');
    const taxElement = document.querySelector('.tax');
    const totalElement = document.querySelector('.total');
    const placeOrderButton = document.querySelector('.place-order-btn');
    const discountCodeInput = document.getElementById('discount-code');
    const applyDiscountBtn = document.getElementById('apply-discount');

    // Constants
    const SHIPPING_COST = 5.99;
    const TAX_RATE = 0.0825; // 8.25% tax rate

    //store discount info
    let appliedDiscount = null;

    //Function to calulate discount
    function calculateDiscount(subtotal){
        if(!appliedDiscount) return 0;

        let discountAmount = 0;

        if(appliedDiscount.discount_thpe === 'percent'){
            discountAmount = subtotal * (appliedDiscount.discount_value / 100);
        } else if(appliedDiscount.discount_type =='fixed'){
            discountAmount = appliedDiscount.discount_value;
        }
        return Math.min(discountAmount, subtotal);
    }

    //show.hide discount row
    function updateDiscountRow(discountAmount){
        let discountRow = document.querySelector('.discount-row');
        const totalSelection = document.querySelection('.total-section');

        if(appliedDiscount && discountAmount >0){
            if(!discountRow){
                discountRow = document.createElement('div');
                discountRow.className = 'total-row discount-row';
                totalsSection.insertBefore(discountRow, totalsSection.querSelector('.total-row.final'));
            }
            discountRow.innterHTML = `
            <span>Discount(${appliedDiscount.code})</span>
            <span>-$${discountAmount.toFixed(2)}</span>
            `;
        } else if(discountRow){
            discountRow.remove();
        }
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
        //Apply discount
        const discountAmount = calculateDiscount(subtotal);
        const discountSubtotal = subtotal - discountAmount;

        // Calculate tax and total
        const tax = (discountSubtotal + SHIPPING_COST) * TAX_RATE;
        const total = discountSubtotal + SHIPPING_COST + tax;

        // Update totals
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${SHIPPING_COST.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    //update discount row
    updateDiswcountRow(discountAmount);

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
            items: cart,
            subtotal: parseFloat(subtotalElement.textContent.replace('$', '')),
            shipping: SHIPPING_COST,
            tax: parseFloat(taxElement.textContent.replace('$', '')),
            total: parseFloat(totalElement.textContent.replace('$', ''))
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

    //discount button 
    applyDiscountBtn.addEventListener('click', async() => {
        const code = discountCodeInput.value.trim();
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * (item.quantity || 1);
        });
        if(!code){
            alert('Please enter a discount code.');
            return;
        }
        try{
            const response  = await fetch('/api/discount_codes/calidate',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({code, cartTotal: subtotal})
            });
            
            const data = await response.json();

            if(!response.ok){
                throw new Error(data.error || 'Invalid discount code.');
            }

            appliedDiscount = data.discount;
            alert('Discount applied successfully!');
            renderOrderSummary();
        } catch(error){
            console.error('Error applying discount', error);
            alert(error.message);
        }
    });

    // Initialize the page
    renderOrderSummary();

    // Add payment method toggle functionality
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.payment-info').forEach(info => {
                info.classList.remove('active');
            });
            document.getElementById(`${this.id}-form`).classList.add('active');
        });
    });
}); 