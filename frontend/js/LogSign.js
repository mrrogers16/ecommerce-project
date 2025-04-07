document.addEventListener("DOMContentLoaded", function () {
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcomeModal");
    const token = localStorage.getItem("token");
    const modalElement = document.getElementById('welcomeModal');

    if (!modalElement || token || hasSeenWelcome) {
        console.log("Skipping welcome modal: already seen or token exists.");
        return;
    }

    // Set modal styles to ensure it appears on top
    if (modalElement) {
        modalElement.style.zIndex = "9999";
        modalElement.style.position = "fixed";
        modalElement.classList.add('fade');  // Ensure fade animation is present
    }

    // Initialize the modal with specific options
    const welcomeModal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
    });

    // Show the modal if it's the first visit
    welcomeModal.show();
    sessionStorage.setItem("hasSeenWelcomeModal", "true");

    // Handle "Continue as Guest" button
    document.getElementById('continueAsGuest').addEventListener('click', function () {
        welcomeModal.hide();
        // Clean up backdrop
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        document.body.classList.remove('modal-open');
    });

    // Handle "Login" button to redirect
    document.getElementById('loginButton').addEventListener('click', function () {
        welcomeModal.hide();
        // Clean up backdrop before redirect
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        window.location.href = 'login.html';
    });

    // Handle "Sign Up" button to redirect
    document.getElementById('signupButton').addEventListener('click', function () {
        welcomeModal.hide();
        // Clean up backdrop before redirect
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
        window.location.href = 'signup.html';
    });
});