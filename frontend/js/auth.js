document.addEventListener("DOMContentLoaded", () => {
    const profileLink = document.querySelector('.login-link');

    if (profileLink) {
        profileLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default link behavior

            const token = localStorage.getItem('token');

            if (token) {
                // User is logged in, redirect to profile page
                window.location.href = 'profile.html';
            } else {
                // User is not logged in, redirect to login page
                window.location.href = 'login.html';
            }
        });
    }
}); 