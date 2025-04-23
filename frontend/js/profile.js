// This file handles UI interactions for the profile page

import { isLoggedIn, checkAuth } from './auth.js';

// Hardcoded user data
const HARDCODED_USER = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    profile_picture: '../assets/images/profile.jpg'
};

// Hardcoded orders data
const HARDCODED_ORDERS = [
    {
        id: '12345',
        status: 'Delivered',
        date: '2024-03-15',
        total: 199.99
    },
    {
        id: '12346',
        status: 'In Transit',
        date: '2024-03-10',
        total: 149.99
    }
];

// Hardcoded wishlist data
const HARDCODED_WISHLIST = [
    {
        id: 1,
        name: 'Running Shoes',
        price: 89.99,
        image: '../assets/images/profile.jpg'
    },
    {
        id: 2,
        name: 'Training Shoes',
        price: 79.99,
        image: '../assets/images/profile.jpg'
    }
];

// Initialize the profile page
function initializePage() {
    // Get the token and check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    console.log('Initializing profile page...');

    // Display hardcoded user data
    updateProfileDisplay(HARDCODED_USER);

    // Display hardcoded orders
    displayOrders(HARDCODED_ORDERS);

    // Display hardcoded wishlist
    displayWishlist(HARDCODED_WISHLIST);

    // Set up profile picture upload
    setupProfilePictureUpload();

    // Set up password change
    setupPasswordChange();
}

// Wait for both DOM content and full page load
window.addEventListener('load', () => {
    // Wait a bit longer than the loading animation
    setTimeout(initializePage, 1500);
});

// Update profile display with user data
function updateProfileDisplay(userData) {
    console.log('Updating profile display...');
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

// Display orders
function displayOrders(orders) {
    console.log('Displaying orders...');
    const ordersContainer = document.getElementById('orders-container');
    if (!ordersContainer) return;

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>No orders found</p>';
        return;
    }

    ordersContainer.innerHTML = '';
    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <div class="d-flex justify-content-between">
                <h5>Order #${order.id}</h5>
                <span class="badge bg-${getStatusClass(order.status)}">${order.status}</span>
            </div>
            <p>Order Date: ${new Date(order.date).toLocaleDateString()}</p>
            <p>Total: $${order.total.toFixed(2)}</p>
        `;
        ordersContainer.appendChild(orderCard);
    });
}

// Display wishlist
function displayWishlist(wishlist) {
    console.log('Displaying wishlist...');
    const wishlistContainer = document.getElementById('wishlist-container');
    if (!wishlistContainer) return;

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '<p>Your wishlist is empty</p>';
        return;
    }

    wishlistContainer.innerHTML = '';
    wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="flex-grow-1">
                <h5>${item.name}</h5>
                <p>$${item.price.toFixed(2)}</p>
                <button class="btn btn-primary btn-sm add-to-cart" data-id="${item.id}">Add to Cart</button>
                <button class="btn btn-outline-danger btn-sm remove-from-wishlist" data-id="${item.id}">Remove</button>
            </div>
        `;
        wishlistContainer.appendChild(wishlistItem);
    });

    // Set up wishlist buttons
    setupWishlistButtons();
}

// Set up profile picture upload
function setupProfilePictureUpload() {
    const profileUpload = document.getElementById('profile-upload');
    const updateButton = document.querySelector('.profile-upload .btn');
    
    if (!profileUpload || !updateButton) return;

    updateButton.addEventListener('click', function() {
        profileUpload.click();
    });

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

            showSuccess('Profile picture updated successfully!');
        }
    });
}

// Set up password change
function setupPasswordChange() {
    const form = document.getElementById('change-password-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        showSuccess('Password updated successfully!');
        form.reset();
    });
}

// Set up wishlist buttons
function setupWishlistButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            showSuccess('Added to cart successfully!');
        });
    });
    
    document.querySelectorAll('.remove-from-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.wishlist-item');
            if (item) {
                item.remove();
            }
            showSuccess('Removed from wishlist successfully!');
        });
    });
}

// Helper function to get status class for badges
function getStatusClass(status) {
    switch (status?.toLowerCase()) {
        case 'delivered': return 'success';
        case 'in transit': return 'warning';
        case 'processing': return 'info';
        case 'cancelled': return 'danger';
        default: return 'secondary';
    }
}

// Helper function to show error message
function showError(message) {
    showToast(message, 'error');
}

// Helper function to show success message
function showSuccess(message) {
    showToast(message, 'success');
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
} 