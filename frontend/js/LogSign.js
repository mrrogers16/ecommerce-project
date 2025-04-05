document.addEventListener("DOMContentLoaded", function () {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeModal");
    const token = localStorage.getItem("token");
    const modalElement = document.getElementById('welcomeModal');

    // Check if modal element exists and user needs to see it
    if (!modalElement || token || hasSeenWelcome) {
        console.log("Skipping welcome modal: already seen or token exists.");
        return;
    }

    const welcomeModal = new bootstrap.Modal(modalElement);
    welcomeModal.show(); // Show the modal

    // Mark as seen
    localStorage.setItem("hasSeenWelcomeModal", "true");

    // Close modal when 'Continue as Guest' is clicked
    document.getElementById('continueAsGuest').addEventListener('click', function () {
        welcomeModal.hide();
    });

    // Redirect to login or sign up pages when respective buttons are clicked
    document.getElementById('loginButton').addEventListener('click', function () {
        window.location.href = 'login.html';
    });

    document.getElementById('signupButton').addEventListener('click', function () {
        window.location.href = 'signup.html';
    });
});
