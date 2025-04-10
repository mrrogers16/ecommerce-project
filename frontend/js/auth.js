document.addEventListener("DOMContentLoaded", () => {
    const profileLink = document.querySelector('.login-link');
    const logoutButton = document.getElementById('logout-button');

    // Update profileLink event listener
    if (profileLink) {
        profileLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default link behavior

            // Check if user is logged in
            if (isLoggedIn()) {
                // User is logged in, redirect to profile page after a short delay
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 200); // Adjust the delay time as needed
            } else {
                // User is not logged in, redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 200); // Adjust the delay time as needed
            }
        });
    }

    // Handle logout button functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior

            // Clear the token from localStorage
            localStorage.removeItem('token');

            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 200); // Adjust the delay time as needed
        });
    }
});

// Check if user is logged in
function isLoggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
}

// Automatically redirect to login page if not logged in
document.addEventListener('DOMContentLoaded', function() {
    if (!isLoggedIn()) {
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 200); // Adjust the delay time as needed
    }
});