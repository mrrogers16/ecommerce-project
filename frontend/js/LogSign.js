document.addEventListener("DOMContentLoaded", function () {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeModal");
    const token = localStorage.getItem("token");
    const modalElement = document.getElementById('welcomeModal');

    // Skip modal if not needed
    if (!modalElement || token || hasSeenWelcome) {
        console.log("Skipping welcome modal: already seen or token exists.");
        return;
    }

    const welcomeModal = new bootstrap.Modal(modalElement);
    welcomeModal.show();
    localStorage.setItem("hasSeenWelcomeModal", "true");

    // Remove Bootstrap backdrop helper
    // Fix for all locked links - The modal was going away but the invisible??? backdrop was not. 
    function removeBackdrop() {
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';  // fix sticky scroll
    }

    // Manual close
    document.getElementById('continueAsGuest').addEventListener('click', function () {
        welcomeModal.hide();
        removeBackdrop();
    });

    // Let Bootstrap remove backdrop when modal is fully hidden
    modalElement.addEventListener('hidden.bs.modal', removeBackdrop);

    // Auth buttons
    document.getElementById('loginButton').addEventListener('click', function () {
        window.location.href = 'login.html';
    });

    document.getElementById('signupButton').addEventListener('click', function () {
        window.location.href = 'signup.html';
    });
});
