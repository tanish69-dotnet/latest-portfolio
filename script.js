/* ─── script.js ─── */

'use strict';

/* ═══════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════ */
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

(function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
    requestAnimationFrame(animateCursor);
})();

// Expand cursor on hoverable elements
document.querySelectorAll('a, button, .skill-tag, .project-card, .social-btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
});

/* ═══════════════════════════════════════
   PARTICLE CANVAS
═══════════════════════════════════════ */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 70;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
        this.r = Math.random() * 1.8 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -(Math.random() * 0.4 + 0.15);
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fade = (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1);
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity += this.fade;
        if (this.opacity <= 0.05 || this.opacity >= 0.65) this.fade *= -1;
        if (this.y < -10) this.reset(false);
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = '#00d4ff';
        ctx.fill();
        ctx.restore();
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.save();
                ctx.globalAlpha = (1 - dist / 120) * 0.12;
                ctx.strokeStyle = '#00d4ff';
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.restore();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* ═══════════════════════════════════════
   NAVBAR – SCROLL SHRINK + ACTIVE LINK
═══════════════════════════════════════ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    // Scrolled class
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 200) {
            current = sec.id;
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}, { passive: true });

/* ═══════════════════════════════════════
   HAMBURGER MOBILE MENU
═══════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

/* ═══════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ═══════════════════════════════════════
   TYPEWRITER EFFECT (Hero Subtitle)
═══════════════════════════════════════ */
const typewriterEl = document.getElementById('typewriter');
const phrases = [
    'Web Developer & Designer',
    'React Enthusiast',
    'UI/UX Craftsman',
    'Open to Opportunities',
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeWrite() {
    const current = phrases[phraseIdx];
    if (deleting) {
        charIdx--;
    } else {
        charIdx++;
    }
    typewriterEl.textContent = current.slice(0, charIdx);

    let delay = deleting ? 50 : 90;
    if (!deleting && charIdx === current.length) {
        delay = 2000;
        deleting = true;
    } else if (deleting && charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        delay = 400;
    }
    setTimeout(typeWrite, delay);
}
typeWrite();

/* ═══════════════════════════════════════
   SCROLL REVEAL (Intersection Observer)
═══════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, Number(delay));
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════
   ANIMATED STAT COUNTERS
═══════════════════════════════════════ */
const statNums = document.querySelectorAll('.stat-num[data-count]');

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const dur = 1200;
        const step = dur / target;
        let current = 0;
        const timer = setInterval(() => {
            current++;
            el.textContent = current;
            if (current >= target) clearInterval(timer);
        }, step);
        counterObserver.unobserve(el);
    });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

/* ═══════════════════════════════════════
   CONTACT FORM (Formspree)
═══════════════════════════════════════ */
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const btn = this.querySelector('.submit-btn');
        const span = btn.querySelector('span');
        const orig = span.textContent;
        span.textContent = 'Sending…';
        btn.disabled = true;

        try {
            const res = await fetch(this.action, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(this),
            });
            if (res.ok) {
                span.textContent = '✓ Message Sent!';
                btn.style.background = 'linear-gradient(135deg,#00ff64,#00c850)';
                form.reset();
                setTimeout(() => {
                    span.textContent = orig;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3500);
            } else {
                throw new Error();
            }
        } catch {
            span.textContent = orig;
            btn.disabled = false;
            alert('Failed to send. Please try again or email directly.');
        }
    });
}
