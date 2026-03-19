/* ============================================================
   18 GANGSTER MUSEUM — main.js
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

// ── INITIALISE ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initCounters();
  initActiveNav();
  initSmoothScroll();
  initContactForm();
});
