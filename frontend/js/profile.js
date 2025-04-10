// This file is kept for backward compatibility
// All functionality has been moved to profile-api.js

// The profile.js file now just imports and uses the functionality from profile-api.js
// No need to duplicate code here

// Import the API functions from profile-api.js
// This file handles the UI interactions and uses the API functions to communicate with the backend

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load user profile data if logged in, otherwise show guest mode
    if (isLoggedIn()) {
        getUserProfile();
    } else {
        // Show guest mode UI
        document.getElementById('user-name').textContent = 'Guest User';
        document.getElementById('user-email').textContent = 'Please log in to access your profile';
        
        // Disable profile features for guests
        const profileUpload = document.getElementById('profile-upload');
        if (profileUpload) {
            profileUpload.disabled = true;
            profileUpload.parentElement.innerHTML = '<p class="text-muted">Please log in to update your profile picture</p>';
        }
        
        // Disable password change for guests
        const passwordForm = document.getElementById('change-password-form');
        if (passwordForm) {
            passwordForm.innerHTML = '<p class="text-muted">Please log in to change your password</p>';
        }
        
        // Show login prompt in wishlist
        const wishlistContainer = document.getElementById('wishlist');
        if (wishlistContainer) {
            wishlistContainer.innerHTML = '<p class="text-muted">Please log in to view your wishlist</p>';
        }
        
        // Show login prompt in orders
        const ordersContainer = document.getElementById('orders');
        if (ordersContainer) {
            ordersContainer.innerHTML = '<p class="text-muted">Please log in to view your orders</p>';
        }
    }
    
    // Set up profile picture upload
    const profileUpload = document.getElementById('profile-upload');
    if (profileUpload && !profileUpload.disabled) {
        profileUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                uploadProfilePicture(file);
            }
        });
    }
    
    // Set up password change form
    const passwordForm = document.getElementById('change-password-form');
    if (passwordForm && passwordForm.tagName === 'FORM') {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (newPassword !== confirmPassword) {
                showToast('New passwords do not match!', 'error');
                return;
            }
            
            updatePassword(currentPassword, newPassword).then(success => {
                if (success) {
                    passwordForm.reset();
                }
            });
        });
    }
    
    // Set up wishlist functionality
    setupWishlistButtons();
});

// Set up event listeners for wishlist buttons
function setupWishlistButtons() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            addToCart(productId);
        });
    });
    
    // Remove from wishlist buttons
    document.querySelectorAll('.remove-from-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            removeFromWishlist(productId);
        });
    });
}

// Add a product to the user's cart
async function addToCart(productId) {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId,
                quantity: 1
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to add to cart');
        }
        
        showToast('Added to cart', 'success');
        updateCartCount();
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Failed to add to cart', 'error');
        return false;
    }
}

// Update the cart count in the header
async function updateCartCount() {
    if (!isLoggedIn()) return;
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }
        
        const cartData = await response.json();
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cartData.items.reduce((total, item) => total + item.quantity, 0);
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Profile picture upload handling
document.getElementById('profile-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-picture').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

// Password change form handling
document.getElementById('change-password-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }

    // Here you would typically make an API call to update the password
    alert('Password updated successfully!');
    this.reset();
}); 