/* ============================================================
   18 TOWNSHIP TOURS — main.js
   Init, scroll reveal, shared utilities
   ============================================================ */

'use strict';

// ── SCROLL REVEAL ──────────────────────────────────────────
const initReveal = () => {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
};

// ── COUNTER ANIMATION ──────────────────────────────────────
const animateCounter = (el, target, duration = 1800) => {
  const isFloat = target.toString().includes('.');
  let start = null;

  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = eased * target;
    el.textContent = isFloat
      ? current.toFixed(1)
      : Math.floor(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
  };

  requestAnimationFrame(step);
};

const initCounters = () => {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.counter);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
};

// ── ACTIVE NAV LINK ────────────────────────────────────────
const initActiveNav = () => {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link, .drawer-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (
      (href === 'index.html' || href === '/') && (path === '/' || path.endsWith('index.html'))
    ) {
      link.classList.add('active');
    } else if (href !== 'index.html' && href !== '/' && path.includes(href.replace('.html', ''))) {
      link.classList.add('active');
    }
  });
};

// ── SMOOTH ANCHOR SCROLL ───────────────────────────────────
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
};

// ── CONTACT FORM SUBMISSION ────────────────────────────────
const initContactForm = () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // FormSubmit.co integration — change email below or swap for your API
    const formData = new FormData(form);
    try {
      const res = await fetch('https://formsubmit.co/ajax/info@18gm.co.za', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });
      if (res.ok) {
        form.innerHTML = `
          <div class="form-success">
            <p class="text-red" style="font-family:var(--font-heading);font-size:1.1rem;letter-spacing:.06em;text-transform:uppercase;">✓ Message Sent!</p>
            <p style="margin-top:.5rem;font-size:.9rem;color:var(--mid-grey)">We'll get back to you within 24 hours.</p>
          </div>`;
      } else throw new Error('Server error');
    } catch {
      btn.textContent = 'Failed — Try Again';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = original; }, 3000);
    }
  });
};

// ── WHATSAPP BUTTON ──────────────────────────────────────────
const initWhatsAppButton = () => {
  const btn = document.createElement('a');
  btn.href = "https://wa.me/27637580185?text=Hi%2018%20Township%20Tours,%20I'd%20like%20to%20make%20a%20booking.";
  btn.target = "_blank";
  btn.rel = "noopener";
  btn.className = "whatsapp-float";
  btn.setAttribute('aria-label', 'Chat on WhatsApp');
  btn.innerHTML = `
    <svg viewBox="0 0 32 32" width="32" height="32" fill="white">
      <path d="M16.05 1.5C8.04 1.5 1.5 8.04 1.5 16.05c0 3.18 1.03 6.13 2.78 8.52l-2.07 7.57 7.74-2.03c2.32 1.63 5.15 2.58 8.1 2.58 8.01 0 14.55-6.54 14.55-14.55C32.6 8.04 26.06 1.5 16.05 1.5zM24.7 22.06c-.34.95-1.95 1.83-2.73 1.95-.74.12-1.74.28-5.32-1.2-4.32-1.78-7.14-6.22-7.36-6.51-.21-.29-1.75-2.33-1.75-4.44 0-2.11 1.09-3.15 1.48-3.56.39-.4 1.25-.66 1.76-.66.17 0 .34 0 .48.02.4.04.81.16 1.09.83.35.83 1.18 2.87 1.28 3.08.11.21.18.46.04.75-.14.29-.21.46-.42.71-.21.25-.44.54-.62.73-.21.23-.43.48-.19.89.24.41 1.07 1.77 2.31 2.88 1.6 1.44 2.92 1.89 3.32 2.08.4.19.64.16.88-.11.24-.27 1.02-1.2 1.3-1.61.27-.41.54-.34.91-.21.36.12 2.31 1.09 2.7 1.29.39.19.65.29.75.46.09.16.09.95-.25 1.9z"/>
    </svg>
  `;
  document.body.appendChild(btn);
};

// ── INITIALISE ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
  initActiveNav();
  initSmoothScroll();
  initContactForm();
  initWhatsAppButton();
});
