document.addEventListener("DOMContentLoaded", function () {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeModal");
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
    localStorage.setItem("hasSeenWelcomeModal", "true");

    function removeBackdrop() {
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    }



    // Manual close
    document.getElementById('continueAsGuest').addEventListener('click', function () {
        welcomeModal.hide();
    });

    // Auth buttons
    document.getElementById('loginButton').addEventListener('click', function () {
        window.location.href = 'login.html';
    });

    document.getElementById('signupButton').addEventListener('click', function () {
        window.location.href = 'signup.html';
    });

    // Ensure cleanup even if closed by clicking outside
    modalElement.addEventListener('hidden.bs.modal', () => {
        removeBackdrop();
        welcomeModal.dispose();  // This helps fully clean it up
    });
});
