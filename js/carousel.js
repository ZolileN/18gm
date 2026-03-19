/* ============================================================
   18 GANGSTER MUSEUM — carousel.js
   Hero image carousel with dots & auto-play
   ============================================================ */

'use strict';

const HeroCarousel = (() => {

  const INTERVAL = 5500; // ms between slides
  let current = 0;
  let timer = null;
  let slides = [];
  let dots = [];

  const goTo = (index) => {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
  };

  const next = () => goTo(current + 1);

  const startTimer = () => {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  };

  const init = () => {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;

    slides = Array.from(carousel.querySelectorAll('.hero-slide'));
    dots   = Array.from(document.querySelectorAll('.hero-dot'));

    if (!slides.length) return;

    // Set first slide
    goTo(0);
    startTimer();

    // Dot clicks
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
        startTimer(); // reset timer on manual nav
      });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', startTimer);

    // Swipe support (touch)
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1);
        startTimer();
      }
    }, { passive: true });
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', HeroCarousel.init);
