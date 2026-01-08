/**
 * Main JavaScript for Cybersecurity Portfolio Website
 * Author: Andrew Jay Ingram
 * Description: Handles back-to-top button, mobile navigation, and form validation
 */

// ============================================
// Back to Top Button Functionality
// ============================================
(function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) return;

    // Show button when user scrolls down 300px
    window.addEventListener('scroll', function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ============================================
// Mobile Navigation Menu
// ============================================
(function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navigation = document.querySelector('.navigation');
    const navLinks = document.querySelectorAll('.navigation a');
    
    if (!menuToggle || !navigation) return;

    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
        const isOpen = navigation.classList.toggle('mobile-open');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking a navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navigation.classList.remove('mobile-open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) {
            navigation.classList.remove('mobile-open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navigation.classList.contains('mobile-open')) {
            navigation.classList.remove('mobile-open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
})();

// ============================================
// Form Validation and Submission
// ============================================
(function initFormValidation() {
    const form = document.querySelector('form');
    
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(event) {
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            event.preventDefault();
            
            // Show error message
            showMessage('Please fill in all required fields correctly.', 'error');
            
            // Focus first error field
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.focus();
            }
        } else {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
                submitButton.classList.add('loading');
            }
        }
    });

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove previous error
        field.classList.remove('error');
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Date validation
        if (field.type === 'date' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                isValid = false;
                errorMessage = 'Please select a future date';
            }
        }

        if (!isValid) {
            field.classList.add('error');
            const error = document.createElement('span');
            error.className = 'error-message';
            error.textContent = errorMessage;
            error.setAttribute('role', 'alert');
            field.parentElement.appendChild(error);
        }

        return isValid;
    }

    function showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.setAttribute('role', 'alert');

        // Insert before form
        form.parentElement.insertBefore(messageDiv, form);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
})();

// ============================================
// Enhanced Keyboard Navigation
// ============================================
(function initKeyboardNavigation() {
    // Add visible focus indicators
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
})();

// ============================================
// Smooth Scroll for Skip Links
// ============================================
(function initSkipLinks() {
    const skipLink = document.querySelector('.skip-to-content');
    
    if (!skipLink) return;

    skipLink.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            target.focus();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
})();

// ============================================
// Loading Optimization
// ============================================
(function initLoadingOptimizations() {
    // Add loading class to body when page loads
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Lazy load images if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
})();
