/* ============================================================
   18 TOWNSHIP TOURS — i18n.js
   Currency, Dates, and RTL Support
   ============================================================ */

window.I18n = (function() {
  const RATES_KEY = '18tt_rates';
  const RATES_TIMESTAMP_KEY = '18tt_rates_ts';
  const CURRENCY_KEY = '18tt_currency';
  
  let rates = null;
  let currentCurrency = localStorage.getItem(CURRENCY_KEY) || 'ZAR';
  
  // RTL Detection
  const RTL_LANGS = ['ar', 'he', 'fa', 'ur'];

  async function fetchRates() {
    const cached = localStorage.getItem(RATES_KEY);
    const ts = localStorage.getItem(RATES_TIMESTAMP_KEY);
    const now = Date.now();
    
    // Cache for 24 hours
    if (cached && ts && (now - parseInt(ts)) < 86400000) {
      rates = JSON.parse(cached);
      updatePrices();
      return;
    }
    
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/ZAR');
      const data = await res.json();
      if (data && data.rates) {
        rates = data.rates;
        localStorage.setItem(RATES_KEY, JSON.stringify(rates));
        localStorage.setItem(RATES_TIMESTAMP_KEY, now.toString());
        updatePrices();
      }
    } catch (e) {
      console.warn("Failed to fetch exchange rates. Falling back to ZAR.");
    }
  }

  function setCurrency(curr) {
    currentCurrency = curr;
    localStorage.setItem(CURRENCY_KEY, curr);
    updatePrices();
    
    // Dispatch custom event for dynamic scripts (like booking.js)
    window.dispatchEvent(new CustomEvent('currencyChanged', { detail: curr }));
  }

  function convertAndFormat(zarAmount) {
    if (!rates || currentCurrency === 'ZAR' || !rates[currentCurrency]) {
      return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(zarAmount);
    }
    const converted = zarAmount * rates[currentCurrency];
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currentCurrency, maximumFractionDigits: 0 }).format(converted);
  }

  function updatePrices() {
    document.querySelectorAll('.price[data-zar]').forEach(el => {
      const amount = parseFloat(el.getAttribute('data-zar'));
      if (!isNaN(amount)) {
        el.textContent = convertAndFormat(amount);
      }
    });
  }

  // DATE FORMATTING
  function formatDate(dateString) {
    if (!dateString) return '';
    try {
      // Use browser's locale to format the date natively
      return new Intl.DateTimeFormat(undefined, { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).format(new Date(dateString));
    } catch(e) {
      return dateString;
    }
  }

  // RTL OBSERVER
  function initRTLObserver() {
    const htmlEl = document.documentElement;
    
    // Google Translate modifies the lang attribute and adds classes
    const observer = new MutationObserver(() => {
      const currentLang = htmlEl.lang || 'en';
      // Some translators use class="translated-rtl" on the html or body
      const isRtlTranslated = htmlEl.classList.contains('translated-rtl') || document.body.classList.contains('translated-rtl');
      
      const shouldBeRtl = isRtlTranslated || RTL_LANGS.includes(currentLang.split('-')[0].toLowerCase());
      
      if (shouldBeRtl && htmlEl.getAttribute('dir') !== 'rtl') {
        htmlEl.setAttribute('dir', 'rtl');
        injectRtlCss();
      } else if (!shouldBeRtl && htmlEl.getAttribute('dir') === 'rtl') {
        htmlEl.removeAttribute('dir');
        htmlEl.setAttribute('dir', 'ltr');
        removeRtlCss();
      }
    });
    
    observer.observe(htmlEl, { attributes: true, attributeFilter: ['lang', 'class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  function injectRtlCss() {
    if (!document.getElementById('rtl-stylesheet')) {
      const link = document.createElement('link');
      link.id = 'rtl-stylesheet';
      link.rel = 'stylesheet';
      // Determine correct path relative to current page
      const depth = window.location.pathname.split('/').length - 2;
      const prefix = depth > 0 ? '../'.repeat(depth) : '';
      link.href = prefix + 'css/rtl.css';
      document.head.appendChild(link);
    }
  }

  function removeRtlCss() {
    const link = document.getElementById('rtl-stylesheet');
    if (link) link.remove();
  }

  // Inject currency selector into the nav
  function injectCurrencySelector() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.style.marginLeft = 'auto'; // push to right on desktop
    
    const select = document.createElement('select');
    select.className = 'currency-selector';
    select.style.cssText = 'background:transparent; border:1px solid rgba(255,255,255,0.3); color:#fff; padding:4px 8px; border-radius:4px; font-size:0.8rem; cursor:pointer; outline:none; font-family:var(--font-heading);';
    
    const currencies = ['ZAR', 'USD', 'EUR', 'GBP', 'CNY', 'RUB', 'JPY'];
    currencies.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      opt.style.color = '#000';
      if (c === currentCurrency) opt.selected = true;
      select.appendChild(opt);
    });
    
    select.addEventListener('change', (e) => setCurrency(e.target.value));
    li.appendChild(select);
    navMenu.appendChild(li);
  }

  // Language Selector Injection
  function injectLanguageSelector() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    const li = document.createElement('li');
    li.className = 'nav-item';
    li.style.cssText = 'display:flex; align-items:center; gap:8px; margin-left:1rem;';

    const select = document.createElement('select');
    select.className = 'language-selector';
    select.style.cssText = 'background:transparent; border:1px solid rgba(255,255,255,0.3); color:#fff; padding:4px 8px; border-radius:4px; font-size:0.8rem; cursor:pointer; outline:none; font-family:var(--font-heading);';

    const langs = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' },
      { code: 'fr', name: 'Français' },
      { code: 'de', name: 'Deutsch' },
      { code: 'it', name: 'Italiano' },
      { code: 'pt', name: 'Português' },
      { code: 'zh-CN', name: '中文' },
      { code: 'ja', name: '日本語' },
      { code: 'ru', name: 'Русский' },
      { code: 'ar', name: 'العربية' },
      { code: 'he', name: 'עברית' }
    ];

    langs.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.code;
      opt.textContent = l.name;
      opt.style.color = '#000';
      
      const cookieValue = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
      if (cookieValue) {
        const currentLang = cookieValue.split('/')[2];
        if (l.code === currentLang) opt.selected = true;
      } else if (l.code === 'en') {
        opt.selected = true;
      }
      select.appendChild(opt);
    });

    select.addEventListener('change', (e) => {
      const lang = e.target.value;
      if (lang === 'en') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=' + window.location.hostname + '; path=/;';
      } else {
        document.cookie = `googtrans=/en/${lang}; path=/`;
        document.cookie = `googtrans=/en/${lang}; domain=${window.location.hostname}; path=/`;
      }
      location.reload();
    });

    li.appendChild(select);
    navMenu.appendChild(li);
  }

  // Google Translate Integration (Hidden)
  function initTranslator() {
    const container = document.createElement('div');
    container.id = 'google_translate_element';
    container.style.display = 'none'; // Hide the ugly widget
    document.body.appendChild(container);
    
    // Check URL for language (e.g. /es/ or ?lang=es)
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    const pathSegments = window.location.pathname.split('/');
    const langInPath = pathSegments.find(seg => ['fr','de','es','it','nl','pt','zh-CN','ja','ko','ar','he','ru'].includes(seg.toLowerCase()));

    const targetLang = langParam || langInPath;
    if (targetLang) {
      document.cookie = `googtrans=/en/${targetLang}; path=/`;
      document.cookie = `googtrans=/en/${targetLang}; domain=${window.location.hostname}; path=/`;
    }

    window.googleTranslateElementInit = function() {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    };

    const script = document.createElement('script');
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }

  // Init
  window.addEventListener('DOMContentLoaded', () => {
    fetchRates();
    initRTLObserver();
    injectCurrencySelector();
    injectLanguageSelector();
    initTranslator();
  });

  return {
    convertAndFormat,
    formatDate,
    setCurrency,
    getCurrency: () => currentCurrency
  };
})();
