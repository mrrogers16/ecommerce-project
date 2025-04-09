// API endpoints
const API_BASE_URL = 'http://localhost:5000/api';
const USER_ENDPOINT = `${API_BASE_URL}/users`;
const PROFILE_ENDPOINT = `${API_BASE_URL}/profile`;

// Check if user is logged in
function isLoggedIn() {
    const token = localStorage.getItem('authToken');
    return !!token;
}

// Redirect to login if not authenticated
function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Get user profile data
async function getUserProfile() {
    if (!checkAuth()) return;
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${PROFILE_ENDPOINT}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch profile data');
        }
        
        const userData = await response.json();
        displayUserData(userData);
        return userData;
    } catch (error) {
        console.error('Error fetching profile:', error);
        showToast('Failed to load profile data', 'error');
    }
}

// Display user data in the profile page
function displayUserData(userData) {
    document.getElementById('user-name').textContent = userData.name || 'User';
    document.getElementById('user-email').textContent = userData.email || '';
    
    if (userData.profilePicture) {
        document.getElementById('profile-picture').src = userData.profilePicture;
    }
    
    // Load orders if available
    if (userData.orders) {
        displayOrders(userData.orders);
    }
    
    // Load wishlist if available
    if (userData.wishlist) {
        displayWishlist(userData.wishlist);
    }
}

// Display user orders
function displayOrders(orders) {
    const ordersContainer = document.getElementById('orders');
    if (!ordersContainer) return;
    
    // Clear existing content except the heading
    const heading = ordersContainer.querySelector('h4');
    ordersContainer.innerHTML = '';
    if (heading) ordersContainer.appendChild(heading);
    
    if (orders.length === 0) {
        const noOrders = document.createElement('p');
        noOrders.textContent = 'You have no orders yet.';
        ordersContainer.appendChild(noOrders);
        return;
    }
    
    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        const statusClass = getStatusClass(order.status);
        
        orderCard.innerHTML = `
            <div class="d-flex justify-content-between">
                <h5>Order #${order.id}</h5>
                <span class="badge ${statusClass}">${order.status}</span>
            </div>
            <p>Order Date: ${formatDate(order.orderDate)}</p>
            <p>Total: $${order.total.toFixed(2)}</p>
        `;
        
        ordersContainer.appendChild(orderCard);
    });
}

// Display user wishlist
function displayWishlist(wishlist) {
    const wishlistContainer = document.getElementById('wishlist');
    if (!wishlistContainer) return;
    
    // Clear existing content except the heading
    const heading = wishlistContainer.querySelector('h4');
    wishlistContainer.innerHTML = '';
    if (heading) wishlistContainer.appendChild(heading);
    
    if (wishlist.length === 0) {
        const noItems = document.createElement('p');
        noItems.textContent = 'Your wishlist is empty.';
        wishlistContainer.appendChild(noItems);
        return;
    }
    
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
    
    // Add event listeners for wishlist buttons
    addWishlistEventListeners();
}

// Add event listeners for wishlist buttons
function addWishlistEventListeners() {
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

// Upload profile picture
async function uploadProfilePicture(file) {
    if (!checkAuth()) return;
    
    try {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('profilePicture', file);
        
        const response = await fetch(`${PROFILE_ENDPOINT}/picture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to upload profile picture');
        }
        
        const data = await response.json();
        document.getElementById('profile-picture').src = data.profilePictureUrl;
        showToast('Profile picture updated successfully', 'success');
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        showToast('Failed to update profile picture', 'error');
    }
}

// Update password
async function updatePassword(currentPassword, newPassword) {
    if (!checkAuth()) return;
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${PROFILE_ENDPOINT}/password`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update password');
        }
        
        showToast('Password updated successfully', 'success');
        return true;
    } catch (error) {
        console.error('Error updating password:', error);
        showToast(error.message || 'Failed to update password', 'error');
        return false;
    }
}

// Add product to wishlist
async function addToWishlist(productId) {
    if (!checkAuth()) return;
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${PROFILE_ENDPOINT}/wishlist`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to add to wishlist');
        }
        
        showToast('Added to wishlist', 'success');
        return true;
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        showToast('Failed to add to wishlist', 'error');
        return false;
    }
}

// Remove product from wishlist
async function removeFromWishlist(productId) {
    if (!checkAuth()) return;
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${PROFILE_ENDPOINT}/wishlist/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to remove from wishlist');
        }
        
        showToast('Removed from wishlist', 'success');
        // Refresh wishlist display
        getUserProfile();
        return true;
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        showToast('Failed to remove from wishlist', 'error');
        return false;
    }
}

// Helper function to get status class for order badges
function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'delivered':
            return 'bg-success';
        case 'processing':
            return 'bg-warning';
        case 'shipped':
            return 'bg-info';
        case 'cancelled':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

// Helper function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000
    });
    
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!checkAuth()) return;
    
    // Load user profile data
    getUserProfile();
    
    // Set up profile picture upload
    const profileUpload = document.getElementById('profile-upload');
    if (profileUpload) {
        profileUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                uploadProfilePicture(file);
            }
        });
    }
    
    // Set up password change form
    const passwordForm = document.getElementById('change-password-form');
    if (passwordForm) {
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
}); 