document.addEventListener("DOMContentLoaded", () => {
    console.log("Script.js (cart logic) loaded");


    // Shopping cart logic
    let cart = [];

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart")) {
            const productId = event.target.getAttribute("data-id");
            addToCart(productId);
        }
    });

    function addToCart(productId) {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to add items to your cart.');
            return;
        }


        // FRONTEND NOTE: I added this just to make sure that selectedSize gets passed along. 
        // #############  When the button gets fixed, make sure selectedSize is included. 
        // If you want to use the current 'alert' you can just leave this here and it will take in a size to be passed to the cart. 
        // You will need to just add the item to the cart instead of opening the product details page.
        // Also, quantity is hardcoded at 1 for now. We need to look into a quantity field 
        const selectedSize = prompt("Enter your size");

        if (!selectedSize) {
            alert("Please select your size.");
            return;
        }

        // Add to localStorage for UI/UX display
        let existingCart = JSON.parse(localStorage.getItem('cart')) || [];

        const productToAdd = {
            id: parseInt(productId),
            selectedSize: selectedSize,
            quantity: 1 // default for now
        };

        existingCart.push(productToAdd);
        localStorage.setItem('cart', JSON.stringify(existingCart));

        // Update backend cart in the db
        fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                shoe_id: productId,
                quantity: 1,
                selectedSize: selectedSize
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add item to cart in backend');
                }
                return response.json();
            })
            .then(data => {
                console.log('Backend cart updated: ', data);
                window.updateCartCount && window.updateCartCount();
                alert("Item added to cart!");
            })
            .catch(error => {
                console.error('Error adding item to backend cart: ', error);
                alert('There was a problem adding the item to your cart.');
            });
    }
});


