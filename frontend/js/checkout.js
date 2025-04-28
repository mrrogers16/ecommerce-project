document.addEventListener('DOMContentLoaded', async () => {
    /* ------------------------------------------------------------------ */
    /*  1.  Grab useful DOM nodes                                        */
    /* ------------------------------------------------------------------ */
    const orderItems        = document.querySelector('.order-items');
    const subtotalElement   = document.querySelector('.subtotal');
    const shippingElement   = document.querySelector('.shipping');
    const taxElement        = document.querySelector('.tax');
    const totalElement      = document.querySelector('.total');
    const placeOrderButton  = document.querySelector('.place-order-btn');
    const discountCodeInput = document.getElementById('discount-code');
    const applyDiscountBtn  = document.getElementById('apply-discount');
    const discountLine      = document.getElementById('discount-line');
    const discountAmountElement = document.getElementById('discount-amount');

    /* ------------------------------------------------------------------ */
    /*  2.  Constants & state                                             */
    /* ------------------------------------------------------------------ */
    const SHIPPING_COST = 5.99;
    const TAX_RATE      = 0.0825;          // 8.25 %
    let   cart          = [];              // server-side cart
    let   appliedDiscount = null;          // object from /discount_codes/validate
    let   discountAmount  = 0;             // number (calculated each render)

    /* ------------------------------------------------------------------ */
    /*  3.  Require a logged-in user & pull the real cart                 */
    /* ------------------------------------------------------------------ */
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to view your cart.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const res  = await fetch('/api/cart', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed to fetch cart');

        // normalise field names so the rest of the code can stay the same
        const data = await res.json();
        cart = (data.items || []).map(i => ({
            id:          i.shoe_id,
            name:        i.name,
            brand:       i.brand,
            price:       Number(i.price),
            quantity:    Number(i.quantity),
            image:       i.image_url || i.image,     // backend vs local field
            selectedSize:i.selected_size || i.selectedSize
        }));

        renderOrderSummary();
    } catch (err) {
        console.error(err);
        alert('Unable to load cart. Please try again later.');
        return;
    }

    /* ------------------------------------------------------------------ */
    /*  4.  Helpers                                                       */
    /* ------------------------------------------------------------------ */
    function renderOrderSummary () {
        /* --- 4 a.  clear / build list --------------------------------- */
        orderItems.innerHTML = '';

        if (cart.length === 0) {
            orderItems.innerHTML = `
                <div class="text-center py-4">
                    <p>Your cart is empty</p>
                    <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
                </div>`;
            subtotalElement.textContent = shippingElement.textContent =
            taxElement.textContent      = totalElement.textContent    = '$0.00';
            discountLine.style.display  = 'none';
            return;
        }

        let subtotal = 0;
        cart.forEach(item => {
            const lineTotal = item.price * (item.quantity || 1);
            subtotal       += lineTotal;

            orderItems.insertAdjacentHTML('beforeend', `
                <div class="order-item">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h4 class="item-name">${item.name}</h4>
                        <p class="item-price">$${lineTotal.toFixed(2)}</p>
                        <p class="text-muted">Size: ${item.selectedSize}</p>
                        ${item.quantity > 1 ? `<p class="text-muted">Quantity: ${item.quantity}</p>` : ''}
                    </div>
                </div>`);
        });

        /* --- 4 b.  discounts ------------------------------------------ */
        discountAmount = 0;
        if (appliedDiscount) {
            if (appliedDiscount.type === 'fixed') {
                discountAmount = appliedDiscount.discount_value;
            } else if (appliedDiscount.type === 'percent') {
                discountAmount = subtotal * (appliedDiscount.discount_value / 100);
            }
        }
        const discountedSubtotal = Math.max(0, subtotal - discountAmount);

        /* --- 4 c.  tax / total ---------------------------------------- */
        const tax   = (discountedSubtotal + SHIPPING_COST) * TAX_RATE;
        const total = discountedSubtotal + SHIPPING_COST + tax;

        /* --- 4 d.  update DOM ----------------------------------------- */
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${SHIPPING_COST.toFixed(2)}`;
        taxElement.textContent      = `$${tax.toFixed(2)}`;
        totalElement.textContent    = `$${total.toFixed(2)}`;

        if (appliedDiscount) {
            discountLine.style.display   = 'flex';
            discountAmountElement.textContent = `-$${discountAmount.toFixed(2)}`;
        } else {
            discountLine.style.display = 'none';
        }
    }

    /* ------------------------------------------------------------------ */
    /*  5.  Discount code handler                                         */
    /* ------------------------------------------------------------------ */
    applyDiscountBtn.addEventListener('click', () => {
        const code = discountCodeInput.value.trim();
        if (!code) { alert('Please enter a discount code.'); return; }

        const preDiscountTotal = cart.reduce((t,i) => t + i.price * (i.quantity||1), 0) + SHIPPING_COST;

        fetch('/api/discount_codes/validate', {
            method:'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({ code, cartTotal: preDiscountTotal })
        })
        .then(r => r.json())
        .then(data => {
            if (data.error) return alert(data.error);
            appliedDiscount = data.discount;
            alert('Discount code applied!');
            renderOrderSummary();
        })
        .catch(err => {
            console.error(err);
            alert('Unable to apply discount – please try again.');
        });
    });

    /* ------------------------------------------------------------------ */
    /*  6.  Place-order handler                                           */
    /* ------------------------------------------------------------------ */
    function formsAreValid () {
        const s = document.getElementById('shipping-form');
        const p = document.getElementById('payment-form');
        const payMethod = document.querySelector('input[name="payment"]:checked');
        if (!payMethod) { alert('Choose a payment method.'); return false; }
        return s.checkValidity() && p.checkValidity();
    }

    placeOrderButton.addEventListener('click', async e => {
        e.preventDefault();
        if (!formsAreValid()) return;

        const orderData = {
            shipping: {
                firstName:document.getElementById('firstName').value,
                lastName :document.getElementById('lastName').value,
                email    :document.getElementById('email').value,
                address  :document.getElementById('address').value,
                city     :document.getElementById('city').value,
                state    :document.getElementById('state').value,
                zip      :document.getElementById('zip').value
            },
            payment: {
                method    :document.querySelector('input[name="payment"]:checked').id,
                cardNumber:document.getElementById('cardNumber')?.value,
                expiry    :document.getElementById('expiry')?.value,
                cvv       :document.getElementById('cvv')?.value,
                cardName  :document.getElementById('cardName')?.value
            },
            // server already has the authoritative cart; no need to send items
            discount_code: appliedDiscount ? appliedDiscount.code : undefined
        };

        try {
            const res = await fetch('/api/orders', {
                method :'POST',
                headers:{
                    'Content-Type':'application/json',
                    Authorization :`Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });
            if (!res.ok) throw new Error('Order failed');
            const data = await res.json();

            alert(
                `Thank you!\n\nSubtotal: $${data.summary.subtotal.toFixed(2)}\n`+
                `Tax:      $${data.summary.tax.toFixed(2)}\n`+
                `Total:    $${data.summary.total.toFixed(2)}`
            );

            localStorage.removeItem('cart');  // wipe local cache
            window.location.href = 'index.html';
        } catch (err) {
            console.error(err);
            alert('There was a problem placing your order. Please try again.');
        }
    });

    /* ------------------------------------------------------------------ */
    /*  7.  Toggle credit-card / PayPal / Apple-Pay panes                 */
    /* ------------------------------------------------------------------ */
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.payment-info').forEach(p => p.classList.remove('active'));
            document.getElementById(`${radio.id}-form`).classList.add('active');
        });
    });
});
