// API endpoints
const API_BASE_URL = 'http://localhost:3000/api';
const LOGIN_ENDPOINT = `${API_BASE_URL}/customers/login`;
const SIGNUP_ENDPOINT = `${API_BASE_URL}/customers/signup`;

// Demo users for testing (matches customers.sql)
const DEMO_USERS = [
    { email: 'john@example.com', password: 'password123' },
    { email: 'test@robbymcbobbit.com', password: 'password123' }
];

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

// Add helper text for demo users
//function addDemoUserHelp() {
//    const loginForm = document.getElementById('loginForm');
//    if (loginForm) {
//        const helpText = document.createElement('div');
//       helpText.className = 'alert alert-info mt-3';
//        helpText.innerHTML = `
//            <h6>Demo Users Available:</h6>
//            <ul class="mb-0">
//                ${DEMO_USERS.map(user => `
//                    <li>Email: ${user.email}<br>Password: ${user.password}</li>
//                `).join('')}
//            </ul>
//           <p class="mb-0 mt-2"><small>You can also create a new account using the Sign Up page.</small></p>
//       `;
//       loginForm.appendChild(helpText);
//    }
//}

// Check if backend server is running
async function checkBackendServer() {
    try {
        const response = await fetch(`${API_BASE_URL}/test`, { 
            method: 'GET',
            mode: 'no-cors'
        });
        return true;
    } catch (error) {
        console.error('Backend server check failed:', error);
        return false;
    }
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const profileLink = document.querySelector('.login-link');
    const logoutButton = document.getElementById('logout-button');

    // Add demo user help text to login form
    addDemoUserHelp();

    // Check if backend is running
    const isBackendRunning = await checkBackendServer();
    if (!isBackendRunning) {
        console.warn('Backend server may not be running. Authentication features may not work.');
    }

    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            try {
                // For demo purposes, simulate successful login if backend is not available
                if (!isBackendRunning) {
                    showToast('Backend server not available. Using demo login.');
                    localStorage.setItem('token', 'demo-token');
                    localStorage.setItem('user', JSON.stringify({
                        name: 'Demo User',
                        email: email
                    }));
                    if (rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                    }
                    setTimeout(() => {
                        window.location.href = 'shop.html';
                    }, 1500);
                    return;
                }

                const response = await fetch(LOGIN_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Store token and user info
                    localStorage.setItem('token', data.token);
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                    if (rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                    }
                    
                    showToast('Login successful!');
                    setTimeout(() => {
                        window.location.href = 'shop.html';
                    }, 1500);
                } else {
                    showToast(data.error || 'Login failed', 'danger');
                }
            } catch (error) {
                console.error('Login error:', error);
                
                if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
                    showToast('Cannot connect to the server. Please check if the backend is running.', 'danger');
                } else {
                    showToast('An error occurred during login', 'danger');
                }
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

            // Split name into first_name and last_name
            const nameParts = name.split(' ');
            const first_name = nameParts[0];
            const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

            try {
                const response = await fetch(SIGNUP_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        first_name, 
                        last_name, 
                        email, 
                        password,
                        phone: '', // Optional fields
                        address: ''
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    showToast('Account created successfully! Please login.');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                } else {
                    showToast(data.error || 'Signup failed', 'danger');
                }
            } catch (error) {
                console.error('Signup error:', error);
                
                if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
                    showToast('Cannot connect to the server. Please check if the backend is running.', 'danger');
                } else {
                    showToast('An error occurred during signup', 'danger');
                }
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
            localStorage.removeItem('user');
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