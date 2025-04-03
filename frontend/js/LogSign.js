document.addEventListener("DOMContentLoaded", function() {
    const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
    welcomeModal.show(); // Show the modal when the page loads

    // Close modal when 'Continue as Guest' is clicked
    document.getElementById('continueAsGuest').addEventListener('click', function() {
        welcomeModal.hide(); // Hide the modal
    });

    // Redirect to login or sign up pages when respective buttons are clicked
    document.getElementById('loginButton').addEventListener('click', function() {
        window.location.href = 'login.html'; // Redirect to login page
    });

    document.getElementById('signupButton').addEventListener('click', function() {
        window.location.href = 'signup.html'; // Redirect to signup page
    });
});
