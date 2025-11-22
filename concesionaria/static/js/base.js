/**
 * Base JavaScript for AutoVentas Concesionaria
 * Contains common functionality used across the application
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // =========================================================================
    // Back to Top Button Functionality
    // =========================================================================
    
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Show/Hide back to top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });
        
        // Smooth scroll to top when button is clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // =========================================================================
    // Active Navigation Link Highlighting
    // =========================================================================
    
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link-custom, .nav-link-admin');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            link.style.backgroundColor = 'rgba(0, 123, 255, 0.2)';
            link.style.color = '#007bff';
        }
    });
    
    // =========================================================================
    // Smooth Scrolling for Internal Links
    // =========================================================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // =========================================================================
    // Alert Auto Dismiss
    // =========================================================================
    
    // Auto dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert:not(.alert-persistent)');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
    
    // =========================================================================
    // Form Validation Enhancement
    // =========================================================================
    
    // Add Bootstrap validation classes to forms
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
    
    // =========================================================================
    // Tooltips and Popovers Initialization
    // =========================================================================
    
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // =========================================================================
    // Loading States
    // =========================================================================
    
    // Add loading state to buttons with loading-btn class
    const loadingButtons = document.querySelectorAll('.loading-btn');
    loadingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Cargando...';
            this.disabled = true;
            
            // Re-enable after 3 seconds (adjust as needed)
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 3000);
        });
    });
    
});

// =========================================================================
// Utility Functions
// =========================================================================

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast (success, error, warning, info)
 */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toast = new bootstrap.Toast(document.getElementById(toastId));
    toast.show();
    
    // Remove toast element after it's hidden
    document.getElementById(toastId).addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

/**
 * Create toast container if it doesn't exist
 */
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '1055';
    document.body.appendChild(container);
    return container;
}

/**
 * Confirm dialog with custom styling
 * @param {string} message - The confirmation message
 * @param {Function} callback - Function to call if confirmed
 */
function confirmDialog(message, callback) {
    if (confirm(message)) {
        callback();
    }
}