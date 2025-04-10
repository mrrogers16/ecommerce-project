// API endpoints
const API_BASE_URL = 'http://localhost:3000/api';
const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;
const SIGNUP_ENDPOINT = `${API_BASE_URL}/auth/signup`;

// Utility function to show toast messages
function showToast(message, type = 'success') {
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
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const profileLink = document.querySelector('.login-link');
    const logoutButton = document.getElementById('logout-button');

    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            try {
                const response = await fetch(LOGIN_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Store token
                    localStorage.setItem('token', data.token);
                    if (rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                    }
                    
                    showToast('Login successful!');
                    setTimeout(() => {
                        window.location.href = 'shop.html';
                    }, 1500);
                } else {
                    showToast(data.message || 'Login failed', 'danger');
                }
            } catch (error) {
                showToast('An error occurred during login', 'danger');
                console.error('Login error:', error);
            }
        });
    }

    // Signup form handler
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;

            // Validate password match
            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'danger');
                return;
            }

            // Validate terms acceptance
            if (!terms) {
                showToast('Please accept the Terms and Conditions', 'danger');
                return;
            }

            try {
                const response = await fetch(SIGNUP_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    showToast('Signup successful! Please login.');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                } else {
                    showToast(data.message || 'Signup failed', 'danger');
                }
            } catch (error) {
                showToast('An error occurred during signup', 'danger');
                console.error('Signup error:', error);
            }
        });
    }

    // Profile link handler
    if (profileLink) {
        profileLink.addEventListener('click', (event) => {
            event.preventDefault();
            const token = localStorage.getItem('token');
            window.location.href = token ? 'profile.html' : 'login.html';
        });
    }

    // Logout handler
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('rememberMe');
            showToast('Logged out successfully');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }

    // Check authentication status on page load
    const token = localStorage.getItem('token');
    if (token) {
        // Update UI for logged-in state
        const loginLinks = document.querySelectorAll('.login-link');
        loginLinks.forEach(link => {
            link.textContent = 'Profile';
            link.href = 'profile.html';
        });
    }
}); 