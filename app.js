// Compact FAQ accordion (preserves search, keyboard, deep-linking, analytics, previews)
class FAQAccordion {
  constructor() {
    this.items = Array.from(document.querySelectorAll('.faq-item'));
    this.activeItem = null;
    this.searchInput = document.getElementById('faq-search');
    this.noResults = document.getElementById('faq-no-results');
    this.init();
  }

  init() {
    this.items.forEach((item, i) => {
      const btn = item.querySelector('.question');
      const ans = item.querySelector('.answer');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', `faq-answer-${i}`);
      btn.dataset.index = i;
      ans.id = `faq-answer-${i}`;
      btn.dataset.searchText = (btn.textContent || '').toLowerCase();

      btn.addEventListener('click', () => this.toggleItem(item));
      btn.addEventListener('keydown', (e) => this.handleKeydown(e, item));
      btn.addEventListener('mouseenter', () => this.showPreview(item));
      btn.addEventListener('mouseleave', () => this.hidePreview(item));
    });

    if (this.searchInput) this.setupSearch();
    this.restoreFromHash();
    window.addEventListener('hashchange', () => this.restoreFromHash());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeItem) {
        this.closeItem(this.activeItem);
        this.activeItem.querySelector('.question').focus();
      }
    });
    this.setupAnalytics();
  }

  setupSearch() {
    let t;
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(t);
      t = setTimeout(() => this.filterFAQs((e.target.value || '').toLowerCase()), 300);
    });
  }

  filterFAQs(q) {
    let visibleCount = 0;
    this.items.forEach((item, i) => {
      const btn = item.querySelector('.question');
      const aText = (item.querySelector('.answer-content')?.textContent || '').toLowerCase();
      const qText = (btn.dataset.searchText || btn.textContent || '').toLowerCase();
      const match = !q || qText.includes(q) || aText.includes(q);
      if (match) {
        item.style.display = '';
        item.classList.add('highlight');
        visibleCount++;
        if (q && !item.classList.contains('open')) setTimeout(() => this.openItem(item), 100);
      } else {
        item.style.display = 'none';
        item.classList.remove('highlight');
        if (item.classList.contains('open')) this.closeItem(item);
      }
    });
    if (this.noResults) this.noResults.hidden = visibleCount > 0;
    if (q) this.trackSearch(q, visibleCount);
  }

  handleKeydown(e, item) {
    const visible = this.items.filter(i => i.style.display !== 'none');
    const idx = visible.indexOf(item);
    switch (e.key) {
      case 'Enter': case ' ': e.preventDefault(); this.toggleItem(item); break;
      case 'ArrowDown': e.preventDefault(); visible[(idx + 1) % visible.length]?.querySelector('.question').focus(); break;
      case 'ArrowUp': e.preventDefault(); visible[(idx - 1 + visible.length) % visible.length]?.querySelector('.question').focus(); break;
      case 'Home': e.preventDefault(); visible[0]?.querySelector('.question').focus(); break;
      case 'End': e.preventDefault(); visible[visible.length - 1]?.querySelector('.question').focus(); break;
    }
  }

  toggleItem(item) { item.classList.contains('open') ? this.closeItem(item) : this.openItem(item); }

  openItem(item) {
    if (this.activeItem && this.activeItem !== item) this.closeItem(this.activeItem);
    const btn = item.querySelector('.question');
    const ans = item.querySelector('.answer');
    const idx = this.items.indexOf(item);
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    history.pushState(null, '', `#faq-${idx + 1}`);
    const h = ans.scrollHeight;
    ans.style.maxHeight = h + 'px';
    this.activeItem = item;
    void ans.offsetHeight;
    ans.addEventListener('transitionend', function cb() { if (item.classList.contains('open')) ans.style.maxHeight = 'none'; ans.removeEventListener('transitionend', cb); }, { once: true });
    this.trackFAQOpen(idx);
  }

  closeItem(item) {
    const btn = item.querySelector('.question');
    const ans = item.querySelector('.answer');
    item.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    ans.style.maxHeight = null;
    if (this.activeItem === item) { this.activeItem = null; history.pushState(null, '', window.location.pathname); }
  }

  showPreview(item) { const ans = item.querySelector('.answer'); if (!item.classList.contains('open') && (ans.textContent || '').length) item.style.borderLeftColor = 'rgba(17,17,17,0.3)'; }
  hidePreview(item) { if (!item.classList.contains('open')) item.style.borderLeftColor = 'transparent'; }

  restoreFromHash() {
    const h = window.location.hash.replace('#', '');
    this.items.forEach(i => this.closeItem(i));
    if (h && h.startsWith('faq-')) {
      const idx = parseInt(h.split('-')[1], 10) - 1;
      if (!isNaN(idx) && this.items[idx]) setTimeout(() => this.openItem(this.items[idx]), 0);
    }
  }

  setupAnalytics() {
    if (!window.faqAnalytics) window.faqAnalytics = { openCounts: {}, searchQueries: {}, totalOpens: 0, totalSearches: 0, sessionStartTime: Date.now(), currentPage: (/faqs?\.html$/i).test(window.location.pathname) ? 'faq' : 'index' };
  }

  trackFAQOpen(idx) { if (window.faqAnalytics) { window.faqAnalytics.openCounts[idx] = (window.faqAnalytics.openCounts[idx] || 0) + 1; window.faqAnalytics.totalOpens++; } }
  trackSearch(q, count) { if (window.faqAnalytics) { window.faqAnalytics.searchQueries[q] = (window.faqAnalytics.searchQueries[q] || 0) + 1; window.faqAnalytics.totalSearches++; } }
}

document.addEventListener('DOMContentLoaded', () => {
  const accordion = new FAQAccordion();
  const faqSection = document.querySelector('.faq-section');

  document.querySelectorAll('.faq-item .question').forEach(btn => btn.addEventListener('click', () => setTimeout(() => faqSection?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)));

  document.querySelectorAll('.faq-link[href^="mailto:"]').forEach(link => link.addEventListener('click', (e) => {
    if (!window.getSelection().toString()) {
      const email = (link.getAttribute('href') || '').replace('mailto:', '');
      navigator.clipboard?.writeText(email).then(() => { const orig = link.textContent; link.textContent = 'Copied!'; setTimeout(() => link.textContent = orig, 2000); }).catch(() => {});
    }
  }));

  const search = document.getElementById('faq-search');
  if (search) search.addEventListener('keydown', (e) => { if (e.key === 'Escape') { search.value = ''; search.blur(); accordion.filterFAQs(''); } });
});
