// Authentication utility functions
const API_BASE_URL = window.location.origin; // Use the current origin instead of hardcoding
const LOGIN_ENDPOINT = `${API_BASE_URL}/api/customers/login`;
const SIGNUP_ENDPOINT = `${API_BASE_URL}/api/customers/signup`;
// Check if user is logged in
function isLoggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
}

// Get the authentication token
function getToken() {
    return localStorage.getItem('token');
}

// Set the authentication token
function setToken(token) {
    localStorage.setItem('token', token);
}

// Remove the authentication token (logout)
function removeToken() {
    localStorage.removeItem('token');
}

// Get the current user's ID
function getUserId() {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user_id;
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
}

// Add token to fetch headers
function getAuthHeaders() {
    const token = getToken();
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// Handle login
async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await response.json();
        setToken(data.token);
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Handle logout
function logout() {
    removeToken();
    window.location.href = '/login.html';
}

// Check authentication and redirect if needed
function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

// export {
//     isLoggedIn,
//     getToken,
//     setToken,
//     removeToken,
//     getUserId,
//     getAuthHeaders,
//     login,
//     logout,
//     checkAuth
// };

document.addEventListener("DOMContentLoaded", () => {
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
            const rememberMe = document.getElementById('rememberMe')?.checked;

            const loginData = {
                email: email,
                password: password
            };

            console.log('Login endpoint:', LOGIN_ENDPOINT);
            console.log('Sending login data:', { email, timestamp: new Date().toISOString() });

            try {
                const response = await fetch(LOGIN_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                console.log('Login response:', response.status);

                if (response.ok) {
                    // Store token and user info
                    localStorage.setItem('token', data.token);
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                    }
                    if (rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                    }

                    // Check for admin role
                    try {
                        const payload = JSON.parse(atob(data.token.split('.')[1]));
                        const role = payload.role;

                        showToast('Login successful!');
                        setTimeout(() => {
                            // Redirect based on role
                            if (role === "admin") {
                                window.location.href = "/static_pages/admin.html";
                            } else {
                                window.location.href = 'shop.html';
                            }
                        }, 1500);
                    } catch (error) {
                        console.error('Error parsing token:', error);
                        // Default to shop page if token parsing fails
                        window.location.href = 'shop.html';
                    }
                } else {
                    console.error('Login failed:', data);
                    showToast(data.error || 'Login failed. Please check your email and password.', 'danger');
                }
            } catch (error) {
                console.error('Login error:', error);
                showToast('Unable to connect to the server. Please try again.', 'danger');
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

            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'danger');
                return;
            }

            if (!terms) {
                showToast('Please accept the Terms and Conditions', 'danger');
                return;
            }

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
                        phone: '',
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
                showToast('An error occurred during signup', 'danger');
            }
        });
    }

    if (profileLink) {
        profileLink.addEventListener('click', (event) => {
            event.preventDefault();
            const token = localStorage.getItem('token');
            window.location.href = token ? 'profile.html' : 'login.html';
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('rememberMe');
            window.location.href = 'login.html'; // Immediately redirect
        });
    }
});

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

    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
} 