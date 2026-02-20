// Smooth scroll for navigation links
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

// Form submission with Formspree
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        // Submit form to Formspree
        fetch(this.action, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: new FormData(this)
        })
        .then(response => {
            if (response.ok) {
                console.log('SUCCESS!');
                submitBtn.innerText = '✓ Message Sent!';
                submitBtn.style.backgroundColor = '#00ff41';
                submitBtn.style.color = '#000';
                form.reset();
                setTimeout(() => {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                }, 3000);
                submitBtn.disabled = false;
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.log('FAILED...', error);
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
            alert('Failed to send message. Please try again.');
        });
    });
}

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe project cards and info items
document.querySelectorAll('.project-card, .info-item, .skill-tag').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Active navigation link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = 'var(--primary-color)';
        } else {
            link.style.color = 'var(--text-primary)';
        }
    });
});

// Mobile menu toggle (if you want to add a hamburger menu later)
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Close mobile menu if it exists
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    });
});
