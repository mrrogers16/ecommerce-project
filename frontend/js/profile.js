// This file is kept for backward compatibility
// All functionality has been moved to profile-api.js

// The profile.js file now just imports and uses the functionality from profile-api.js
// No need to duplicate code here

// Import the API functions from profile-api.js
// This file handles the UI interactions and uses the API functions to communicate with the backend

import { isLoggedIn, checkAuth } from './auth.js';
import {
    getUserProfile,
    uploadProfilePicture,
    updatePassword,
    addToWishlist,
    removeFromWishlist,
    displayUserData
} from './profile-api.js';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the token and check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Show loading state
    showLoadingState();

    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    
    // Update profile information if user data exists
    if (userData) {
        updateProfileDisplay(userData);
    } else {
        // If no user data in localStorage, fetch it from the server
        getUserProfile()
            .then(profileData => {
                updateProfileDisplay(profileData);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
                showError('Failed to load user profile');
            });
    }

    // Fetch user's orders
    fetchUserOrders(token);

    // Handle password change
    setupPasswordChange(token);

    // Set up profile picture upload
    setupProfilePictureUpload();

    // Set up wishlist functionality
    setupWishlistButtons();
});

// Update profile display with user data
function updateProfileDisplay(userData) {
    const nameElement = document.getElementById('user-name');
    const emailElement = document.getElementById('user-email');
    
    if (nameElement) {
        nameElement.textContent = `${userData.first_name} ${userData.last_name}`;
    }
    
    if (emailElement) {
        emailElement.textContent = userData.email;
    }

    // Update profile picture if available
    const profilePicture = document.getElementById('profile-picture');
    if (profilePicture && userData.profile_picture) {
        profilePicture.src = userData.profile_picture;
    }
}

// Fetch user orders
function fetchUserOrders(token) {
    const ordersContainer = document.getElementById('orders');
    if (!ordersContainer) return;

    ordersContainer.innerHTML = '<div class="loading">Loading orders...</div>';

    fetch('/api/customers/orders', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        return response.json();
    })
    .then(orders => {
        if (orders && orders.length > 0) {
            ordersContainer.innerHTML = '<h4>Recent Orders</h4>';
            
            orders.forEach(order => {
                const orderCard = document.createElement('div');
                orderCard.className = 'order-card';
                orderCard.innerHTML = `
                    <div class="d-flex justify-content-between">
                        <h5>Order #${order.id}</h5>
                        <span class="badge bg-${getOrderStatus(order.status)}">${order.status}</span>
                    </div>
                    <p>Order Date: ${new Date(order.created_at).toLocaleDateString()}</p>
                    <p>Total: $${order.total.toFixed(2)}</p>
                `;
                ordersContainer.appendChild(orderCard);
            });
        } else {
            ordersContainer.innerHTML = `
                <h4>Recent Orders</h4>
                <p>No orders found</p>
            `;
        }
    })
    .catch(error => {
        console.error('Error fetching orders:', error);
        ordersContainer.innerHTML = `
            <h4>Recent Orders</h4>
            <p class="text-danger">Error loading orders. Please try again later.</p>
        `;
    });
}

// Set up password change functionality
function setupPasswordChange(token) {
    const passwordForm = document.getElementById('change-password-form');
    if (!passwordForm) return;

    passwordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            showError('New passwords do not match!');
            return;
        }

        try {
            const response = await fetch('/api/customers/password', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update password');
            }

            showSuccess('Password updated successfully!');
            passwordForm.reset();
        } catch (error) {
            console.error('Error updating password:', error);
            showError('Failed to update password. Please try again.');
        }
    });
}

// Set up profile picture upload
function setupProfilePictureUpload() {
    const profileUpload = document.getElementById('profile-upload');
    if (!profileUpload || profileUpload.disabled) return;

    profileUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showError('File size too large. Please choose an image under 5MB.');
                return;
            }

            if (!file.type.startsWith('image/')) {
                showError('Please select an image file.');
                return;
            }

            uploadProfilePicture(file)
                .then(() => {
                    showSuccess('Profile picture updated successfully!');
                })
                .catch(error => {
                    console.error('Error uploading profile picture:', error);
                    showError('Failed to update profile picture. Please try again.');
                });
        }
    });
}

// Helper function to show loading state
function showLoadingState() {
    const elements = ['user-name', 'user-email', 'orders'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '<div class="loading">Loading...</div>';
        }
    });
}

// Helper function to show error message
function showError(message) {
    // You can replace this with your preferred notification system
    alert(message);
}

// Helper function to show success message
function showSuccess(message) {
    // You can replace this with your preferred notification system
    alert(message);
}

// Helper function for order status colors
function getOrderStatus(status) {
    switch (status?.toLowerCase()) {
        case 'delivered': return 'success';
        case 'in transit': return 'warning';
        case 'processing': return 'info';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
}

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

// Helper function to show toast messages
function showToast(message, type = 'info') {
    // Implementation depends on your toast library
    console.log(`${type}: ${message}`);
} 