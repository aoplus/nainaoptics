/* PIIXELL by Naina Optics — script.js
   Site-wide interactivity: nav, dark mode, product filter,
   FAQ accordion, contact form, enquiry modal, newsletter, GA4 */

(function () {
  'use strict';

  /* ── GA4 event helper ─────────────────────────────────── */
  function track(eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params || {});
    }
  }

  /* ── DARK MODE ────────────────────────────────────────── */
  var darkToggle = document.getElementById('darkToggle');
  if (darkToggle) {
    darkToggle.addEventListener('click', function () {
      var isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('darkMode', isDark ? 'true' : 'false');
      track('dark_mode_toggle', { mode: isDark ? 'dark' : 'light' });
    });
  }

  /* ── HAMBURGER MENU ───────────────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      var isOpen = document.body.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (document.body.classList.contains('nav-open') &&
          !e.target.closest('#navbar')) {
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on nav link click (mobile)
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── PRODUCT FILTER ───────────────────────────────────── */
  var filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        // Update active state
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        // Show/hide cards
        var cards = document.querySelectorAll('.product-card');
        var visible = 0;
        cards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.classList.remove('hidden');
            visible++;
          } else {
            card.classList.add('hidden');
          }
        });

        // Show empty state if needed
        var noMsg = document.getElementById('noProductsMsg');
        if (noMsg) noMsg.style.display = visible === 0 ? 'block' : 'none';

        track('product_filter', { filter_value: filter });
      });
    });
  }

  /* ── FAQ ACCORDION ────────────────────────────────────── */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(function (i) {
        i.classList.remove('open');
        var q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        track('faq_expand', { question: btn.querySelector('span') ? btn.querySelector('span').textContent.trim().slice(0, 80) : '' });
      }
    });
  });

  /* ── FAQ CATEGORY FILTER ──────────────────────────────── */
  var faqFilterBtns = document.querySelectorAll('.filter-btn[data-faq-filter]');
  if (faqFilterBtns.length) {
    faqFilterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-faq-filter');

        faqFilterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var groups = document.querySelectorAll('.faq-group');
        groups.forEach(function (group) {
          if (filter === 'all' || group.getAttribute('data-faq-group') === filter) {
            group.style.display = '';
          } else {
            group.style.display = 'none';
          }
        });

        // Clear search when switching category
        var searchInput = document.getElementById('faqSearch');
        if (searchInput) {
          searchInput.value = '';
          document.querySelectorAll('.faq-item').forEach(function (i) {
            i.classList.remove('hidden');
          });
        }
      });
    });
  }

  /* ── FAQ SEARCH ───────────────────────────────────────── */
  var faqSearch = document.getElementById('faqSearch');
  if (faqSearch) {
    faqSearch.addEventListener('input', function () {
      var query = faqSearch.value.toLowerCase().trim();
      var items = document.querySelectorAll('.faq-item');
      var visible = 0;

      // Reset category filter
      faqFilterBtns.forEach(function (b) { b.classList.remove('active'); });
      var allBtn = document.querySelector('[data-faq-filter="all"]');
      if (allBtn) allBtn.classList.add('active');
      document.querySelectorAll('.faq-group').forEach(function (g) {
        g.style.display = '';
      });

      items.forEach(function (item) {
        var q = (item.getAttribute('data-question') || '');
        var a = (item.getAttribute('data-answer') || '');
        if (!query || q.includes(query) || a.includes(query)) {
          item.classList.remove('hidden');
          visible++;
        } else {
          item.classList.add('hidden');
        }
      });

      var noResults = document.getElementById('faqNoResults');
      if (noResults) noResults.style.display = visible === 0 && query ? 'block' : 'none';
    });
  }

  /* ── ENQUIRY MODAL ────────────────────────────────────── */
  var enquiryModal = document.getElementById('enquiryModal');
  var closeEnquiry = document.getElementById('closeEnquiry');
  var enquiryForm  = document.getElementById('enquiryForm');

  function openEnquiryModal(productName, productPrice) {
    if (!enquiryModal) return;
    var productInput = document.getElementById('enqProduct');
    if (productInput) productInput.value = productName + (productPrice ? ' — ' + productPrice : '');
    enquiryModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    track('product_enquiry', { product_name: productName });
  }

  function closeEnquiryModal() {
    if (!enquiryModal) return;
    enquiryModal.classList.remove('open');
    document.body.style.overflow = '';
    if (enquiryForm) enquiryForm.reset();
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.enquire-btn');
    if (btn) {
      openEnquiryModal(
        btn.getAttribute('data-product') || '',
        btn.getAttribute('data-price') || ''
      );
    }
  });

  if (closeEnquiry) closeEnquiry.addEventListener('click', closeEnquiryModal);

  if (enquiryModal) {
    enquiryModal.addEventListener('click', function (e) {
      if (e.target === enquiryModal) closeEnquiryModal();
    });
  }

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name    = enquiryForm.elements['name'];
      var phone   = enquiryForm.elements['phone'];
      var product = enquiryForm.elements['product'];
      var message = enquiryForm.elements['message'];
      var valid   = true;

      [name, phone].forEach(function (field) {
        var group = field.closest('.form-group');
        if (!field.value.trim()) {
          group.classList.add('invalid');
          valid = false;
        } else {
          group.classList.remove('invalid');
        }
      });

      if (!valid) return;

      var text = 'Hello Naina Optics! I am interested in: ' + product.value +
                 '\nName: ' + name.value +
                 '\nPhone: ' + phone.value +
                 (message.value ? '\nMessage: ' + message.value : '');

      var waUrl = 'https://wa.me/917760542829?text=' + encodeURIComponent(text);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      track('enquiry_form_submit', { product_name: product.value });
      closeEnquiryModal();
    });
  }

  /* ── CONTACT FORM ─────────────────────────────────────── */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var fields  = ['ctName', 'ctPhone', 'ctSubject', 'ctMessage'];
      var emailEl = document.getElementById('ctEmail');
      var valid   = true;

      fields.forEach(function (id) {
        var el    = document.getElementById(id);
        var group = el ? el.closest('.form-group') : null;
        if (el && !el.value.trim()) {
          if (group) group.classList.add('invalid');
          valid = false;
        } else if (group) {
          group.classList.remove('invalid');
        }
      });

      if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
        emailEl.closest('.form-group').classList.add('invalid');
        valid = false;
      } else if (emailEl) {
        emailEl.closest('.form-group').classList.remove('invalid');
      }

      if (!valid) return;

      var name    = document.getElementById('ctName').value;
      var phone   = document.getElementById('ctPhone').value;
      var email   = emailEl ? emailEl.value : '';
      var subject = document.getElementById('ctSubject').value;
      var message = document.getElementById('ctMessage').value;

      var text = 'Hello Naina Optics!' +
                 '\nName: '    + name +
                 '\nPhone: '   + phone +
                 (email ? '\nEmail: ' + email : '') +
                 '\nSubject: ' + subject +
                 '\nMessage: ' + message;

      var waUrl = 'https://wa.me/917760542829?text=' + encodeURIComponent(text);
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      var success = document.getElementById('contactSuccess');
      if (success) success.style.display = 'block';

      track('contact_form_submit', { subject: subject });
    });
  }

  /* ── NEWSLETTER FORMS ─────────────────────────────────── */
  function initNewsletter(formId) {
    var form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.elements['email'];
      if (!email || !email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#e74c3c';
        return;
      }
      email.style.borderColor = '';

      /* TODO: Replace this with your Mailchimp fetch() call:
         fetch('https://your-mailchimp-endpoint.com/subscribe', {
           method: 'POST', body: JSON.stringify({ email: email.value }),
           headers: { 'Content-Type': 'application/json' }
         }); */

      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = '✅ Subscribed!';
        btn.disabled = true;
      }
      email.value = '';
      track('newsletter_signup', { form_id: formId });
    });
  }

  initNewsletter('newsletterForm');
  initNewsletter('blogNewsletterForm');

  /* ── GA4 CLICK TRACKING ───────────────────────────────── */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('a');
    if (!el) return;
    var href = el.getAttribute('href') || '';
    if (href.startsWith('tel:')) track('call_click', { phone: href.replace('tel:', '') });
    if (href.includes('wa.me'))  track('whatsapp_click', { location: document.title });
  });

  /* ── SCROLL FADE-IN ANIMATIONS ───────────────────────── */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show immediately
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── ESCAPE KEY TO CLOSE MODALS ───────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeEnquiryModal();
      var articleModal = document.getElementById('articleModal');
      if (articleModal) {
        articleModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

})();
