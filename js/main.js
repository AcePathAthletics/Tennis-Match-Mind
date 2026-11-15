/* ═══════════════════════════════════════════════════════════════
   MatchMind — Landing page interactions
   Vanilla JS, no dependencies.
   ─ Progressive enhancement: scroll-reveal styles only activate
     once this file adds the `js` class to <html>.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Enable JS-dependent styling (scroll-reveal hiding, etc.)
  document.documentElement.classList.add('js');

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Sticky header state ─────────────────────────────────────── */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile navigation ───────────────────────────────────────── */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  function setMenu(open) {
    navToggle.setAttribute('aria-expanded', String(open));
    navMenu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  }

  navToggle.addEventListener('click', function () {
    setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
  });

  // Close the drawer when a link inside it is activated
  navMenu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      setMenu(false);
      navToggle.focus();
    }
  });

  /* ── Scroll-reveal (IntersectionObserver) ────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Old browsers / reduced motion: show everything immediately
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Animated counters in the stats strip ────────────────────── */
  var counters = document.querySelectorAll('.count');

  function animateCount(el) {
    var target = parseInt(el.dataset.target, 10);
    if (prefersReducedMotion || !window.requestAnimationFrame) {
      el.textContent = target.toLocaleString('en-US');
      return;
    }
    var duration = 1600;
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // Ease-out cubic for a satisfying settle
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ── FAQ accordion ───────────────────────────────────────────── */
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var answer = item.querySelector('.faq-a');

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close any other open item (one at a time keeps it tidy)
      faqItems.forEach(function (other) {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-a').style.maxHeight = '0';
        }
      });

      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = isOpen ? '0' : answer.scrollHeight + 'px';
    });
  });

  // Keep open answers sized correctly on resize
  window.addEventListener('resize', function () {
    document.querySelectorAll('.faq-item.open .faq-a').forEach(function (a) {
      a.style.maxHeight = a.scrollHeight + 'px';
    });
  });

  /* ── Early-access form (client-side only) ────────────────────── */
  var form = document.getElementById('ctaForm');
  var emailInput = document.getElementById('ctaEmail');
  var note = document.getElementById('ctaNote');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = emailInput.value.trim();

    if (!EMAIL_RE.test(value)) {
      note.textContent = 'Please enter a valid email address.';
      note.className = 'cta-note error';
      emailInput.focus();
      return;
    }

    // No backend on the static site — acknowledge and reset.
    note.textContent = "You're on the list! We'll serve you an invite soon. 🎾";
    note.className = 'cta-note success';
    form.reset();
  });

  /* ── Pricing: monthly / annual billing toggle ────────────────── */
  var billingButtons = document.querySelectorAll('.billing-btn');
  var priceSwitchEls = document.querySelectorAll('.price-num[data-monthly], .price-per[data-monthly], .price-note[data-monthly]');

  billingButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mode = btn.dataset.billing; // 'monthly' | 'annual'
      billingButtons.forEach(function (b) {
        var isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-pressed', String(isActive));
      });
      priceSwitchEls.forEach(function (el) {
        if (el.dataset[mode]) el.textContent = el.dataset[mode];
      });
      // Struck-through regular price: keep the screen-reader prefix, swap the amount.
      document.querySelectorAll('.price-was[data-monthly]').forEach(function (el) {
        if (el.dataset[mode] && el.lastChild) el.lastChild.textContent = el.dataset[mode];
      });
    });
  });

  /* ── Legal modal (Terms / Privacy) ───────────────────────────── */
  var LEGAL_CONTENT = {
    terms: {
      title: 'Terms of Service',
      body: 'MatchMind is provided as-is for personal match journaling and training reflection. ' +
        'AI-generated coaching content is informational, not professional instruction — always ' +
        'consult a qualified coach or physician for training and health decisions. You retain ' +
        'ownership of everything you log; do not misuse the service or attempt to access data ' +
        'that is not yours. Full terms ship with the production application.'
    },
    privacy: {
      title: 'Privacy Policy',
      body: 'Your journal belongs to you. Match entries, opponent notes, and coaching memories ' +
        'are stored privately per account, protected with row-level security, and never sold or ' +
        'shared with third parties. You can export your complete data as JSON or permanently ' +
        'delete your account and all associated data at any time. The full policy ships with ' +
        'the production application.'
    }
  };

  var modal = null;
  var lastFocused = null;

  function openModal(kind) {
    var content = LEGAL_CONTENT[kind];
    if (!content) return;
    lastFocused = document.activeElement;

    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.innerHTML =
        '<div class="modal-box">' +
        '  <h3 id="modalTitle"></h3>' +
        '  <p id="modalBody"></p>' +
        '  <button type="button" class="btn btn-outline modal-close">Close</button>' +
        '</div>';
      document.body.appendChild(modal);

      modal.addEventListener('click', function (e) {
        if (e.target === modal || e.target.closest('.modal-close')) closeModal();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
      });
    }

    modal.setAttribute('aria-labelledby', 'modalTitle');
    modal.querySelector('#modalTitle').textContent = content.title;
    modal.querySelector('#modalBody').textContent = content.body;

    requestAnimationFrame(function () { modal.classList.add('open'); });
    modal.querySelector('.modal-close').focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-legal]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      openModal(link.dataset.legal);
    });
  });

  /* ── Footer year ─────────────────────────────────────────────── */
  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
