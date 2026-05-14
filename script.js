// ── Scroll Progress Bar ──────────────────────────────────────────
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    const bar = document.getElementById('scroll-progress');
    if (bar) bar.style.width = scrolled + '%';
});

// ── Scroll Reveal Animation ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Fire once only
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Trigger immediately for elements already visible on load
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);

    // ── Mobile Nav Hamburger ─────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            hamburger.setAttribute('aria-expanded',
                navLinks.classList.contains('open').toString());
        });
        // Close nav when a link is tapped
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }
});
