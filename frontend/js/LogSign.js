document.addEventListener("DOMContentLoaded", function () {
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcomeModal");
    const token = localStorage.getItem("token");
    const modalElement = document.getElementById('welcomeModal');

    if (!modalElement || token || hasSeenWelcome) {
        console.log("Skipping welcome modal: already seen or token exists.");
        return;
    }

    const welcomeModal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: true
    });

    welcomeModal.show();
    sessionStorage.setItem("hasSeenWelcomeModal", "true");

    function removeBackdrop() {
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    }

    // Listen for the message to remove the backdrop
    window.addEventListener('message', (event) => {
        if (event.data === 'removeBackdrop') {
            removeBackdrop();
        }
    });

    // Manual close
    document.getElementById('continueAsGuest').addEventListener('click', function () {
        welcomeModal.hide();
    });

    // Auth buttons
    document.getElementById('loginButton').addEventListener('click', function () {
        removeBackdrop();
        window.location.href = 'login.html';
    });

    document.getElementById('signupButton').addEventListener('click', function () {
        removeBackdrop();
        window.location.href = 'signup.html';
    });

    // Ensure cleanup even if closed by clicking outside
    modalElement.addEventListener('hidden.bs.modal', () => {
        removeBackdrop();
        welcomeModal.dispose();  // This helps fully clean it up
    });
});
