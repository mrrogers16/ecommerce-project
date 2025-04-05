document.addEventListener("DOMContentLoaded", function () {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeModal");
    const token = localStorage.getItem("token");
    const modalElement = document.getElementById('welcomeModal');

    // Check if modal should be shown
    if (!modalElement || token || hasSeenWelcome) {
        console.log("Skipping welcome modal: already seen or token exists.");
        return;
    }

    const welcomeModal = new bootstrap.Modal(modalElement, {
        backdrop: true,
        keyboard: true
    });

    welcomeModal.show();
    localStorage.setItem("hasSeenWelcomeModal", "true");

    // Function to remove backdrop
    function removeBackdrop() {
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    }

    // Handle guest login
    document.getElementById('continueAsGuest').addEventListener('click', function () {
        welcomeModal.hide();
        removeBackdrop();  // Remove backdrop explicitly
    });

    // Auth buttons
    document.getElementById('loginButton').addEventListener('click', function () {
        window.location.href = 'login.html';
        removeBackdrop();  // Ensure backdrop is removed if we navigate
    });

    document.getElementById('signupButton').addEventListener('click', function () {
        window.location.href = 'signup.html';
        removeBackdrop();  // Ensure backdrop is removed if we navigate
    });

    // Handle clicking outside the modal to close
    modalElement.addEventListener('hidden.bs.modal', () => {
        removeBackdrop();
        welcomeModal.dispose();  // Clean up the modal instance
    });

    // Handle admin page transition to ensure backdrop is removed
    window.addEventListener('beforeunload', () => {
        removeBackdrop(); // Clean up backdrop when leaving the page
    });
});
