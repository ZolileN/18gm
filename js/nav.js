/* ============================================================
   18 GANGSTER MUSEUM — nav.js
   Sticky nav, mobile drawer, dropdown accessibility
   ============================================================ */

'use strict';

const Nav = (() => {
  const nav        = document.getElementById('site-nav');
  const hamburger  = document.getElementById('nav-hamburger');
  const drawer     = document.getElementById('nav-drawer');
  const overlay    = document.getElementById('nav-overlay');

  // ── STICKY / TRANSPARENT ──────────────────────────────
  const handleScroll = () => {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
      nav.classList.remove('hero-top');
    } else {
      nav.classList.remove('scrolled');
      nav.classList.add('hero-top');
    }
  };

  // ── MOBILE DRAWER ─────────────────────────────────────
  const openDrawer = () => {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    document.body.style.overflow = '';
  };

  const toggleDrawer = () => {
    if (drawer.classList.contains('open')) closeDrawer();
    else openDrawer();
  };

  // ── DRAWER ACCORDION (sub-menus) ──────────────────────
  const initDrawerAccordion = () => {
    document.querySelectorAll('.drawer-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const targetId = toggle.dataset.target;
        const sub = document.getElementById(targetId);
        if (!sub) return;

        const isOpen = sub.classList.contains('open');
        // close all
        document.querySelectorAll('.drawer-sub').forEach(s => s.classList.remove('open'));
        document.querySelectorAll('.drawer-toggle .arrow').forEach(a => {
          a.style.transform = '';
        });
        // open clicked if it was closed
        if (!isOpen) {
          sub.classList.add('open');
          const arrow = toggle.querySelector('.arrow');
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        }
      });
    });
  };

  // ── KEYBOARD TRAP IN DRAWER ───────────────────────────
  const handleKeydown = (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) {
      closeDrawer();
      hamburger.focus();
    }
  };

  // ── INIT ──────────────────────────────────────────────
  const init = () => {
    if (!nav) return;

    // Initial state
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (hamburger && drawer) {
      hamburger.addEventListener('click', toggleDrawer);
      if (overlay) overlay.addEventListener('click', closeDrawer);
      document.addEventListener('keydown', handleKeydown);
      initDrawerAccordion();
    }

    // Close drawer on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeDrawer();
    });
  };

  return { init, closeDrawer };
})();

document.addEventListener('DOMContentLoaded', Nav.init);
