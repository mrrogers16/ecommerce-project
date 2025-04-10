// Profile picture upload functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the profile picture upload input and button
    const profileUpload = document.getElementById('profile-upload');
    const updateButton = profileUpload.nextElementSibling; // The "Update Picture" button
    const profilePicture = document.querySelector('.profile-picture');
    
    // Add event listener to the file input
    if (profileUpload) {
        profileUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Check if file is an image
                if (!file.type.match('image.*')) {
                    showToast('Please select an image file', 'error');
                    return;
                }
                
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showToast('Image size should be less than 5MB', 'error');
                    return;
                }
                
                // Create a FileReader to read the image
                const reader = new FileReader();
                
                // Set up the reader's onload event
                reader.onload = function(e) {
                    // Update the profile picture with the selected image
                    profilePicture.src = e.target.result;
                    
                    // Show success message
                    showToast('Profile picture updated successfully', 'success');
                };
                
                // Read the file as a data URL
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Add event listener to the update button
    if (updateButton) {
        updateButton.addEventListener('click', function() {
            // Trigger the file input click
            profileUpload.click();
        });
    }
});

// Toast notification function
function showToast(message, type = 'info') {
    // Check if toast container exists, if not create it
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : 'success'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    // Set toast content
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Initialize Bootstrap toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000
    });
    
    // Show toast
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
} 