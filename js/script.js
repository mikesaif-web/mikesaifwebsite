/**
 * Modern Website JavaScript
 * Handles form submissions, smooth scrolling, and interactions
 */

// ========================================
// Smooth Scrolling for Navigation Links
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for nav height

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// eBook Download Form Handler
// ========================================

const ebookForm = document.getElementById('ebookForm');
const thankYouPage = document.getElementById('thankYouPage');
const downloadLink = document.getElementById('downloadLink');
const closeThankYou = document.getElementById('closeThankYou');

// Initialize Formspree captcha when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.formspree !== 'undefined' && ebookForm) {
        window.formspree.init({
            formId: 'xqawaayb',
            captcha: {
                sitekey: 'auto', // Formspree will auto-generate
                element: '#ebook-captcha'
            }
        });
    }
});

if (ebookForm) {
    ebookForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);

        // Store data in localStorage (optional - for tracking)
        localStorage.setItem('ebookRequest', JSON.stringify({
            email: formData.get('email'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            phone: formData.get('phone') || 'Not provided',
            timestamp: new Date().toISOString()
        }));

        try {
            // Submit to Formspree
            const response = await fetch(this.action, {
                method: this.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show thank you page on success
                showThankYouPage();

                // Reset form
                ebookForm.reset();
            } else {
                // Handle error
                const data = await response.json();
                alert('Oops! There was a problem submitting your form. Please try again.');
                console.error('Formspree error:', data);
            }
        } catch (error) {
            alert('Oops! There was a problem submitting your form. Please try again.');
            console.error('Form submission error:', error);
        }
    });
}

// ========================================
// Contact Form Popup Handlers
// ========================================

const openContactFormBtn = document.getElementById('openContactForm');
const contactFormPopup = document.getElementById('contactFormPopup');
const closeContactPopupBtn = document.getElementById('closeContactPopup');
const contactForm = document.getElementById('contactForm');

// Open contact form popup
if (openContactFormBtn) {
    openContactFormBtn.addEventListener('click', function() {
        showContactFormPopup();
    });
}

// Close popup button
if (closeContactPopupBtn) {
    closeContactPopupBtn.addEventListener('click', function() {
        hideContactFormPopup();
    });
}

// Close on background click
if (contactFormPopup) {
    contactFormPopup.addEventListener('click', function(e) {
        if (e.target === contactFormPopup) {
            hideContactFormPopup();
        }
    });
}

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);

        // Store data in localStorage (optional)
        const contactHistory = JSON.parse(localStorage.getItem('contactHistory') || '[]');
        contactHistory.push({
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contactHistory', JSON.stringify(contactHistory));

        try {
            // Submit to Formspree
            const response = await fetch(this.action, {
                method: this.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show success message in popup
                showSuccessMessageInPopup(contactForm, 'Thank you! Your message has been sent. I\'ll respond shortly.');

                // Reset form
                contactForm.reset();

                // Close popup after 3 seconds
                setTimeout(() => {
                    hideContactFormPopup();
                }, 3000);
            } else {
                // Handle error
                const data = await response.json();
                showSuccessMessageInPopup(contactForm, 'Oops! There was a problem sending your message. Please try again.');
                console.error('Formspree error:', data);
            }
        } catch (error) {
            showSuccessMessageInPopup(contactForm, 'Oops! There was a problem sending your message. Please try again.');
            console.error('Form submission error:', error);
        }
    });
}

// ========================================
// Popup Helper Functions
// ========================================

function showContactFormPopup() {
    contactFormPopup.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function hideContactFormPopup() {
    contactFormPopup.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling

    // Remove any success messages
    const successMsg = contactFormPopup.querySelector('.success-message');
    if (successMsg) {
        successMsg.remove();
    }
}

// ========================================
// Thank You Page Functions
// ========================================

function showThankYouPage() {
    thankYouPage.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Set the download link
    downloadLink.href = 'AIForSmallBusinesseBook.pdf';
    downloadLink.download = 'AIForSmallBusinesseBook.pdf';
}

function hideThankYouPage() {
    thankYouPage.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}

// Download button click handler
if (downloadLink) {
    downloadLink.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Download button clicked');

        // Create a fetch request to download the PDF
        const pdfUrl = 'AIForSmallBusinesseBook.pdf';

        fetch(pdfUrl)
            .then(response => response.blob())
            .then(blob => {
                // Create a temporary URL for the blob
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'AIForSmallBusinesseBook.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                console.log('Download triggered successfully');
            })
            .catch(error => {
                console.error('Download failed:', error);
                // Fallback to direct link
                window.open(pdfUrl, '_blank');
            });
    });
}

// Close thank you page
if (closeThankYou) {
    closeThankYou.addEventListener('click', hideThankYouPage);
}

// Close on background click
if (thankYouPage) {
    thankYouPage.addEventListener('click', function(e) {
        if (e.target === thankYouPage) {
            hideThankYouPage();
        }
    });
}

// Close popups on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (!thankYouPage.classList.contains('hidden')) {
            hideThankYouPage();
        }
        if (!contactFormPopup.classList.contains('hidden')) {
            hideContactFormPopup();
        }
    }
});

// ========================================
// Success Message Display Functions
// ========================================

function showSuccessMessage(formElement, message) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        margin-top: 1rem;
        text-align: center;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // Insert message after form
    formElement.parentNode.insertBefore(successDiv, formElement.nextSibling);

    // Remove message after 5 seconds
    setTimeout(() => {
        successDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => successDiv.remove(), 300);
    }, 5000);
}

function showSuccessMessageInPopup(formElement, message) {
    // Remove existing success message if any
    const existingMsg = formElement.parentNode.querySelector('.success-message');
    if (existingMsg) {
        existingMsg.remove();
    }

    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        margin-top: 1.5rem;
        text-align: center;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
    `;

    // Insert message after form
    formElement.parentNode.insertBefore(successDiv, formElement.nextSibling);
}

// ========================================
// Scroll Animation Observers
// ========================================

// Observe elements and add animation classes when they enter viewport
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply to feature cards and testimonials
document.addEventListener('DOMContentLoaded', function() {
    // Set initial state for animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card');

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        el.style.transitionDelay = `${index * 0.1}s`;

        observer.observe(el);
    });

    // Initialize validation
    addValidationFeedback();
});

// ========================================
// Form Validation Enhancement
// ========================================

// Add real-time validation feedback
function addValidationFeedback() {
    const inputs = document.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#10b981';
            }
        });

        input.addEventListener('focus', function() {
            this.style.borderColor = '#2563eb';
        });
    });

    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailPattern.test(this.value)) {
                this.style.borderColor = '#ef4444';
                showValidationError(this, 'Please enter a valid email address');
            } else if (this.value) {
                this.style.borderColor = '#10b981';
                removeValidationError(this);
            }
        });
    });
}

function showValidationError(input, message) {
    removeValidationError(input);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        margin-bottom: 0.5rem;
    `;

    input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

function removeValidationError(input) {
    const existingError = input.nextElementSibling;
    if (existingError && existingError.classList.contains('validation-error')) {
        existingError.remove();
    }
}

// ========================================
// Navbar Scroll Effect (Optional Enhancement)
// ========================================

let lastScrollTop = 0;
const nav = document.querySelector('.hero-nav');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        nav.style.backdropFilter = 'blur(10px)';
    } else {
        nav.style.background = 'transparent';
        nav.style.boxShadow = 'none';
        nav.style.backdropFilter = 'none';
    }

    lastScrollTop = scrollTop;
});

// ========================================
// Utility: Send Data to Server (Template)
// ========================================

/**
 * Template function for sending form data to your backend
 * You'll need to implement this based on your backend setup
 */
async function sendToServer(data, endpoint) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Success:', result);
        return result;

    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// ========================================
// Console Welcome Message
// ========================================

console.log('%c👋 Welcome to Mike Saif\'s AI for Small Business Site!',
    'color: #2563eb; font-size: 16px; font-weight: bold;');
console.log('%cBuilt with modern HTML, CSS, and JavaScript',
    'color: #6b7280; font-size: 12px;');
