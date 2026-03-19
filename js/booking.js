/* ============================================================
   18 GANGSTER MUSEUM — booking.js
   3-step booking modal: tour select → details → review
   ============================================================ */

'use strict';

const Booking = (() => {

  // ── TOUR DATA ────────────────────────────────────────────
  const TOURS = [
    {
      id: 'walking',
      name: '3hr Township Walking Tour',
      meta: '3 Hours · 2–15 Guests · Khayelitsha',
      price: 450,
      priceLabel: 'R450 pp',
      duration: '3 Hours',
      description: 'Explore Khayelitsha on foot with a local guide and visit the 18 Gangster Museum.'
    },
    {
      id: 'cycling',
      name: 'Township Cycling Tour',
      meta: '4 Hours · Bicycle provided · All levels',
      price: 550,
      priceLabel: 'R550 pp',
      duration: '4 Hours',
      description: 'See Khayelitsha from two wheels with a guided cycling experience.'
    },
    {
      id: 'party',
      name: 'Party Tour',
      meta: '5 Hours · Evening · 18+ only',
      price: 600,
      priceLabel: 'R600 pp',
      duration: '5 Hours',
      description: 'Experience the vibrant nightlife and music culture of Khayelitsha.'
    },
    {
      id: 'big7',
      name: 'Khayelitsha Big 7',
      meta: 'Full Day · Signature experience · Lunch included',
      price: 850,
      priceLabel: 'R850 pp',
      duration: 'Full Day (8+ hrs)',
      description: 'The ultimate Khayelitsha experience — seven iconic stops in one immersive day.'
    },
    {
      id: 'research',
      name: 'Research Tour',
      meta: 'Flexible duration · Academic / NGO focus',
      price: null,
      priceLabel: 'Quote',
      duration: 'By arrangement',
      description: 'Custom deep-dive for researchers, journalists, and academic groups.'
    },
    {
      id: 'prison',
      name: 'Prison & Community Tour',
      meta: '3.5 Hours · Eye-opening · Local insights',
      price: 500,
      priceLabel: 'R500 pp',
      duration: '3.5 Hours',
      description: 'Visit correctional facilities and community outreach programs with ex-offender guides.'
    }
  ];

  // ── STATE ────────────────────────────────────────────────
  let state = {
    currentStep: 1,
    tour: null,
    guests: 2,
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
    payment: 'EFT Bank Transfer'
  };

  // ── ELEMENT REFS ─────────────────────────────────────────
  let backdrop, modal, stepBars, stepLabels;

  // ── OPEN / CLOSE ─────────────────────────────────────────
  const open = (tourId = null) => {
    backdrop = document.getElementById('booking-backdrop');
    if (!backdrop) return;
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    if (tourId) {
      const t = TOURS.find(t => t.id === tourId);
      if (t) {
        state.tour = t;
        selectTourUI(tourId);
        goToStep(2);
      }
    }

    // Trap focus
    backdrop.querySelector('.booking-close')?.focus();
  };

  const close = () => {
    if (!backdrop) backdrop = document.getElementById('booking-backdrop');
    if (!backdrop) return;
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  const reset = () => {
    state = { currentStep: 1, tour: null, guests: 2, date: '', time: '',
      firstName: '', lastName: '', email: '', phone: '', notes: '', payment: 'EFT Bank Transfer' };
    goToStep(1);
    document.querySelectorAll('.tour-option').forEach(o => o.classList.remove('is-selected'));
    const guestEl = document.getElementById('bk-guests');
    if (guestEl) guestEl.textContent = '2';
  };

  // ── STEP NAVIGATION ──────────────────────────────────────
  const goToStep = (n) => {
    state.currentStep = n;

    // Panels
    document.querySelectorAll('.booking-panel').forEach((p, i) => {
      p.classList.toggle('is-active', i + 1 === n);
    });

    // Step bars & labels
    document.querySelectorAll('.booking-step-bar').forEach((bar, i) => {
      bar.classList.toggle('is-active', i + 1 === n);
      bar.classList.toggle('is-done', i + 1 < n);
    });
    document.querySelectorAll('.booking-step-label').forEach((lbl, i) => {
      lbl.classList.toggle('is-active', i + 1 === n);
      lbl.classList.toggle('is-done', i + 1 < n);
    });

    // Header eyebrow & title
    const eyebrow = document.querySelector('.booking-header .eyebrow');
    const title   = document.querySelector('.booking-header-title');
    const stepData = [
      { eyebrow: 'Step 1 of 3', title: 'Choose Your Tour' },
      { eyebrow: 'Step 2 of 3', title: 'Date & Details' },
      { eyebrow: 'Step 3 of 3', title: 'Review & Confirm' },
      { eyebrow: 'Booking Complete', title: "You're Confirmed!" }
    ];
    const d = stepData[(n > 3 ? 3 : n) - 1] || stepData[0];
    if (eyebrow) eyebrow.textContent = d.eyebrow;
    if (title)   title.textContent   = d.title;

    if (n === 3) buildSummary();
    if (n === 4) showSuccess();

    // Scroll modal to top
    document.getElementById('booking-modal')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── TOUR SELECTION ────────────────────────────────────────
  const selectTourUI = (tourId) => {
    document.querySelectorAll('.tour-option').forEach(el => {
      el.classList.toggle('is-selected', el.dataset.tourId === tourId);
    });
  };

  const handleTourSelect = (tourId) => {
    state.tour = TOURS.find(t => t.id === tourId) || null;
    selectTourUI(tourId);
    // Enable next
    const nextBtn = document.getElementById('bk-next-1');
    if (nextBtn) {
      nextBtn.disabled = false;
      nextBtn.style.opacity = '1';
    }
  };

  // ── GUEST COUNTER ─────────────────────────────────────────
  const updateGuests = (delta) => {
    state.guests = Math.max(1, Math.min(30, state.guests + delta));
    const el = document.getElementById('bk-guests');
    if (el) el.textContent = state.guests;
  };

  // ── FORM VALIDATION ───────────────────────────────────────
  const showError = (fieldId, msg) => {
    const field = document.getElementById(fieldId);
    if (field) field.classList.add('is-error');
    const err = document.getElementById(fieldId + '-err');
    if (err) { err.textContent = msg; err.classList.add('visible'); }
  };

  const clearErrors = () => {
    document.querySelectorAll('.form-control.is-error').forEach(f => f.classList.remove('is-error'));
    document.querySelectorAll('.form-error.visible').forEach(e => { e.classList.remove('visible'); e.textContent = ''; });
  };

  const validateStep2 = () => {
    clearErrors();
    let valid = true;

    state.date      = document.getElementById('bk-date')?.value || '';
    state.time      = document.getElementById('bk-time')?.value || '';
    state.firstName = document.getElementById('bk-fname')?.value.trim() || '';
    state.lastName  = document.getElementById('bk-lname')?.value.trim() || '';
    state.email     = document.getElementById('bk-email')?.value.trim() || '';
    state.phone     = document.getElementById('bk-phone')?.value.trim() || '';
    state.notes     = document.getElementById('bk-notes')?.value.trim() || '';

    if (!state.date) { showError('bk-date', 'Please select a date.'); valid = false; }
    if (!state.time) { showError('bk-time', 'Please select a time.'); valid = false; }
    if (!state.firstName) { showError('bk-fname', 'Required.'); valid = false; }
    if (!state.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      showError('bk-email', 'Valid email required.'); valid = false;
    }
    if (!state.phone) { showError('bk-phone', 'Phone number required.'); valid = false; }

    return valid;
  };

  // ── SUMMARY BUILD ─────────────────────────────────────────
  const buildSummary = () => {
    const box = document.getElementById('bk-summary');
    if (!box || !state.tour) return;

    const total = state.tour.price
      ? `R${(state.tour.price * state.guests).toLocaleString()}`
      : 'Quote on request';

    box.innerHTML = `
      <h4>Booking Summary</h4>
      <div class="summary-row"><span class="summary-row-label">Tour</span><span class="summary-row-value">${state.tour.name}</span></div>
      <div class="summary-row"><span class="summary-row-label">Duration</span><span class="summary-row-value">${state.tour.duration}</span></div>
      <div class="summary-row"><span class="summary-row-label">Date</span><span class="summary-row-value">${formatDate(state.date)}</span></div>
      <div class="summary-row"><span class="summary-row-label">Time</span><span class="summary-row-value">${state.time}</span></div>
      <div class="summary-row"><span class="summary-row-label">Guests</span><span class="summary-row-value">${state.guests} person${state.guests > 1 ? 's' : ''}</span></div>
      <div class="summary-row"><span class="summary-row-label">Lead Guest</span><span class="summary-row-value">${state.firstName} ${state.lastName}</span></div>
      <div class="summary-row"><span class="summary-row-label">Email</span><span class="summary-row-value">${state.email}</span></div>
      <div class="summary-row summary-total"><span class="summary-row-label">Total</span><span class="summary-row-value">${total}</span></div>
    `;

    state.payment = document.getElementById('bk-payment')?.value || 'EFT Bank Transfer';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-ZA', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
  };

  // ── CONFIRM SUBMISSION ────────────────────────────────────
  const confirmBooking = async () => {
    const btn = document.getElementById('bk-confirm');
    if (btn) { btn.disabled = true; btn.textContent = 'Processing…'; }

    state.payment = document.getElementById('bk-payment')?.value || 'EFT Bank Transfer';

    // Generate reference
    const ref = 'GM-' + Date.now().toString(36).toUpperCase().slice(-6);

    // ── Replace this block with your actual API call ──
    // Example with FormSubmit.co:
    // await fetch('https://formsubmit.co/ajax/info@18gm.co.za', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    //   body: JSON.stringify({ ...state, ref })
    // });

    // Simulated async delay
    await new Promise(r => setTimeout(r, 900));

    document.getElementById('bk-ref').textContent = ref;
    goToStep(4);
  };

  // ── SUCCESS ───────────────────────────────────────────────
  const showSuccess = () => {
    document.querySelectorAll('.booking-step-bar').forEach(b => {
      b.classList.remove('is-active');
      b.classList.add('is-done');
    });
  };

  // ── BUILD DOM ─────────────────────────────────────────────
  const buildModal = () => {
    const existing = document.getElementById('booking-backdrop');
    if (existing) return; // already built

    const tourOptionsHTML = TOURS.map(t => `
      <button class="tour-option" data-tour-id="${t.id}" type="button" aria-label="Select ${t.name}">
        <div class="tour-option-info">
          <div class="tour-option-name">${t.name}</div>
          <div class="tour-option-meta">${t.meta}</div>
        </div>
        <div class="tour-option-price">${t.priceLabel}</div>
        <div class="tour-option-radio" aria-hidden="true"></div>
      </button>`).join('');

    // Min date = tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    const html = `
    <div class="booking-backdrop" id="booking-backdrop" role="dialog" aria-modal="true" aria-label="Book a Tour">
      <div class="booking-modal" id="booking-modal">
        <div class="booking-header">
          <div class="booking-header-text">
            <p class="eyebrow">Step 1 of 3</p>
            <p class="booking-header-title">Choose Your Tour</p>
          </div>
          <button class="booking-close" id="booking-close" aria-label="Close booking">✕</button>
        </div>

        <div class="booking-steps">
          <div class="booking-step-bar is-active"></div>
          <div class="booking-step-bar"></div>
          <div class="booking-step-bar"></div>
        </div>
        <div class="booking-step-labels">
          <span class="booking-step-label is-active">Tour</span>
          <span class="booking-step-label">Details</span>
          <span class="booking-step-label">Confirm</span>
        </div>

        <div class="booking-body">

          <!-- STEP 1 -->
          <div class="booking-panel is-active" id="bk-panel-1">
            <div class="tour-options">${tourOptionsHTML}</div>
            <div class="booking-nav">
              <button class="booking-back" disabled>← Back</button>
              <button class="btn btn-red" id="bk-next-1" disabled style="opacity:.4;cursor:not-allowed" type="button">Continue →</button>
            </div>
          </div>

          <!-- STEP 2 -->
          <div class="booking-panel" id="bk-panel-2">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="bk-date">Tour Date <span class="required">*</span></label>
                <input class="form-control" type="date" id="bk-date" min="${minDate}" required>
                <span class="form-error" id="bk-date-err"></span>
              </div>
              <div class="form-group">
                <label class="form-label" for="bk-time">Preferred Time <span class="required">*</span></label>
                <select class="form-control" id="bk-time" required>
                  <option value="">Select time</option>
                  <option>08:00</option><option>09:00</option><option>10:00</option>
                  <option>11:00</option><option>12:00</option><option>13:00</option>
                  <option>14:00</option><option>15:00</option>
                </select>
                <span class="form-error" id="bk-time-err"></span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Number of Guests</label>
              <div class="guest-counter">
                <button class="guest-btn" type="button" id="bk-minus" aria-label="Decrease guests">−</button>
                <span class="guest-number" id="bk-guests">2</span>
                <button class="guest-btn" type="button" id="bk-plus" aria-label="Increase guests">+</button>
                <span class="guest-note">persons (max 30)</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="bk-fname">First Name <span class="required">*</span></label>
                <input class="form-control" type="text" id="bk-fname" placeholder="Thabo" required>
                <span class="form-error" id="bk-fname-err"></span>
              </div>
              <div class="form-group">
                <label class="form-label" for="bk-lname">Last Name</label>
                <input class="form-control" type="text" id="bk-lname" placeholder="Dlamini">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="bk-email">Email Address <span class="required">*</span></label>
              <input class="form-control" type="email" id="bk-email" placeholder="you@example.com" required>
              <span class="form-error" id="bk-email-err"></span>
            </div>

            <div class="form-group">
              <label class="form-label" for="bk-phone">Phone Number <span class="required">*</span></label>
              <input class="form-control" type="tel" id="bk-phone" placeholder="+27 …" required>
              <span class="form-error" id="bk-phone-err"></span>
            </div>

            <div class="form-group">
              <label class="form-label" for="bk-notes">Special Requests (optional)</label>
              <textarea class="form-control" id="bk-notes" placeholder="Dietary requirements, accessibility needs, languages…"></textarea>
            </div>

            <div class="booking-nav">
              <button class="booking-back" type="button" id="bk-back-2">← Back</button>
              <button class="btn btn-red" type="button" id="bk-next-2">Review Booking →</button>
            </div>
          </div>

          <!-- STEP 3 -->
          <div class="booking-panel" id="bk-panel-3">
            <div class="booking-summary" id="bk-summary"></div>

            <div class="form-group">
              <label class="form-label" for="bk-payment">Payment Method</label>
              <select class="form-control" id="bk-payment">
                <option>EFT Bank Transfer</option>
                <option>Credit / Debit Card (on arrival)</option>
                <option>PayFast Online</option>
                <option>Cash on Arrival</option>
              </select>
            </div>

            <div class="payment-notice">
              💡 A <strong>50% deposit</strong> secures your booking. The balance is due on the day of the tour. Our team will send payment details after confirmation.
            </div>

            <div class="booking-nav">
              <button class="booking-back" type="button" id="bk-back-3">← Back</button>
              <button class="btn btn-red" type="button" id="bk-confirm">Confirm Booking ✓</button>
            </div>
          </div>

          <!-- STEP 4: SUCCESS -->
          <div class="booking-panel" id="bk-panel-4">
            <div class="booking-success">
              <div class="success-icon">✓</div>
              <h3>Booking Received!</h3>
              <p>
                Thank you! We'll send a confirmation email to <strong>${state.email || 'your inbox'}</strong> within 2 hours with payment details.
              </p>
              <p class="ref">Reference: <span id="bk-ref"></span></p>
              <p style="margin-top:.5rem;font-size:.8rem;">
                Urgent? Call us: <a href="tel:+27213612692" style="color:var(--red)">+27 21 361 2692</a>
              </p>
              <button class="btn btn-red" style="margin-top:1.5rem" id="bk-done" type="button">Done</button>
            </div>
          </div>

        </div>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
    bindEvents();
  };

  // ── EVENT BINDING ─────────────────────────────────────────
  const bindEvents = () => {
    // Close
    document.getElementById('booking-close').addEventListener('click', close);
    document.getElementById('booking-backdrop').addEventListener('click', (e) => {
      if (e.target.id === 'booking-backdrop') close();
    });
    document.getElementById('bk-done')?.addEventListener('click', () => { close(); reset(); });

    // Keyboard close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    // Tour selection
    document.querySelectorAll('.tour-option').forEach(el => {
      el.addEventListener('click', () => handleTourSelect(el.dataset.tourId));
    });

    // Next 1
    document.getElementById('bk-next-1').addEventListener('click', () => {
      if (state.tour) goToStep(2);
    });

    // Back/Next step 2
    document.getElementById('bk-back-2').addEventListener('click', () => goToStep(1));
    document.getElementById('bk-next-2').addEventListener('click', () => {
      if (validateStep2()) goToStep(3);
    });

    // Back step 3
    document.getElementById('bk-back-3').addEventListener('click', () => goToStep(2));
    document.getElementById('bk-confirm').addEventListener('click', confirmBooking);

    // Guest counter
    document.getElementById('bk-minus').addEventListener('click', () => updateGuests(-1));
    document.getElementById('bk-plus').addEventListener('click', () => updateGuests(1));
  };

  // ── PUBLIC API ────────────────────────────────────────────
  const init = () => {
    buildModal();

    // Wire all [data-book] triggers
    document.querySelectorAll('[data-book]').forEach(el => {
      el.addEventListener('click', () => open(el.dataset.book || null));
    });
  };

  return { init, open, close };

})();

document.addEventListener('DOMContentLoaded', Booking.init);

// Expose globally for inline onclick fallback
window.openBooking = (tourId) => Booking.open(tourId);
