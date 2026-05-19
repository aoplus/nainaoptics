/* PIIXELL by Naina Optics — blog.js
   Blog page: filtering, search, pagination, article modal */

(function () {
  'use strict';

  /* Read articles injected by Eleventy */
  var dataEl = document.getElementById('articlesData');
  if (!dataEl) return;
  var articles = JSON.parse(dataEl.textContent || '[]');

  var ARTICLES_PER_PAGE = 6;
  var currentPage       = 1;
  var currentFilter     = 'all';
  var currentSearch     = '';

  /* ── DOM refs ─────────────────────────────────────────── */
  var grid         = document.getElementById('blogGrid');
  var paginationEl = document.getElementById('blogPagination');
  var noResultsEl  = document.getElementById('blogNoResults');
  var searchInput  = document.getElementById('blogSearch');

  if (!grid) return;

  var allCards = Array.from(grid.querySelectorAll('.article-card'));

  /* ── FILTERING LOGIC ──────────────────────────────────── */
  function getFiltered() {
    return allCards.filter(function (card) {
      var cat     = card.getAttribute('data-category') || '';
      var title   = card.getAttribute('data-title') || '';
      var excerpt = card.getAttribute('data-excerpt') || '';
      var matchesCat    = currentFilter === 'all' || cat === currentFilter;
      var matchesSearch = !currentSearch ||
                          title.includes(currentSearch) ||
                          excerpt.includes(currentSearch);
      return matchesCat && matchesSearch;
    });
  }

  /* ── RENDER PAGE ──────────────────────────────────────── */
  function render() {
    var filtered   = getFiltered();
    var total      = filtered.length;
    var totalPages = Math.ceil(total / ARTICLES_PER_PAGE);
    if (currentPage > totalPages) currentPage = 1;

    var start = (currentPage - 1) * ARTICLES_PER_PAGE;
    var end   = start + ARTICLES_PER_PAGE;

    allCards.forEach(function (c) { c.classList.add('hidden'); });
    filtered.slice(start, end).forEach(function (c) { c.classList.remove('hidden'); });

    if (noResultsEl) noResultsEl.style.display = total === 0 ? 'block' : 'none';
    renderPagination(totalPages);
  }

  /* ── PAGINATION ───────────────────────────────────────── */
  function renderPagination(totalPages) {
    if (!paginationEl) return;
    paginationEl.textContent = '';
    if (totalPages <= 1) return;

    function makeBtn(label, targetPage, disabled, active) {
      var btn = document.createElement('button');
      btn.className = 'page-btn' + (active ? ' active' : '');
      btn.textContent = label;
      btn.disabled = !!disabled;
      btn.setAttribute('aria-label', 'Go to page ' + label);
      if (!disabled && !active) {
        btn.addEventListener('click', function () {
          currentPage = targetPage;
          render();
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
      return btn;
    }

    paginationEl.appendChild(makeBtn('←', currentPage - 1, currentPage === 1, false));
    for (var i = 1; i <= totalPages; i++) {
      paginationEl.appendChild(makeBtn(String(i), i, false, i === currentPage));
    }
    paginationEl.appendChild(makeBtn('→', currentPage + 1, currentPage === totalPages, false));
  }

  /* ── CATEGORY FILTER ──────────────────────────────────── */
  var filterBtns = document.querySelectorAll('.filter-btn[data-blog-filter]');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      currentFilter = btn.getAttribute('data-blog-filter');
      currentPage   = 1;
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      render();
    });
  });

  /* ── SEARCH ───────────────────────────────────────────── */
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      currentSearch = searchInput.value.toLowerCase().trim();
      currentPage   = 1;
      render();
    });
  }

  /* ── ARTICLE MODAL ────────────────────────────────────── */
  var articleModal      = document.getElementById('articleModal');
  var closeModalBtn     = document.getElementById('closeArticleModal');
  var modalTitleEl      = document.getElementById('articleModalTitle');
  var modalCategoryEl   = document.getElementById('articleModalCategory');
  var modalMetaEl       = document.getElementById('articleModalMeta');
  var modalContentEl    = document.getElementById('articleModalContent');

  function openArticle(id) {
    var article = articles.find(function (a) { return String(a.id) === String(id); });
    if (!article || !articleModal) return;

    /* Category badge — built with DOM methods */
    if (modalCategoryEl) {
      modalCategoryEl.textContent = '';
      var badge = document.createElement('span');
      badge.className = 'badge badge--' + article.category;
      badge.textContent = article.categoryLabel;
      modalCategoryEl.appendChild(badge);
    }

    if (modalTitleEl) modalTitleEl.textContent = article.title;

    /* Meta row — built with DOM methods */
    if (modalMetaEl) {
      modalMetaEl.textContent = '';
      var dateStr = new Date(article.date).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      [
        '✍️ ' + article.author,
        '📅 ' + dateStr,
        '⏱ ' + article.readTime + ' min read'
      ].forEach(function (text) {
        var span = document.createElement('span');
        span.textContent = text;
        modalMetaEl.appendChild(span);
      });
    }

    /* Article content: this is static HTML authored in articles.json,
       not user-generated input. It is safe to set as innerHTML here. */
    if (modalContentEl) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(article.content || '<p>Content coming soon.</p>', 'text/html');
      modalContentEl.textContent = '';
      var nodes = doc.body.childNodes;
      for (var i = 0; i < nodes.length; i++) {
        modalContentEl.appendChild(document.importNode(nodes[i], true));
      }
    }

    articleModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    articleModal.scrollTop = 0;

    if (typeof gtag === 'function') {
      gtag('event', 'article_open', { article_title: article.title });
    }
  }

  function closeArticle() {
    if (!articleModal) return;
    articleModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.open-article-btn');
    if (btn) openArticle(btn.getAttribute('data-id'));
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeArticle);

  if (articleModal) {
    articleModal.addEventListener('click', function (e) {
      if (e.target === articleModal) closeArticle();
    });
  }

  /* ── INITIAL RENDER ───────────────────────────────────── */
  render();

})();
