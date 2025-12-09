// app.js — Enhanced FAQ accordion with search, analytics, and multi-page support

class FAQAccordion {
  constructor() {
    this.items = document.querySelectorAll('.faq-item');
    this.activeItem = null;
    this.searchInput = document.getElementById('faq-search');
    this.noResults = document.getElementById('faq-no-results');
    this.faqContainer = document.querySelector('.faq');
    this.init();
  }

  init() {
    // Setup each item with event listeners
    this.items.forEach((item, index) => {
      const btn = item.querySelector('.question');
      const ans = item.querySelector('.answer');

      // Initialize aria attributes
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', `faq-answer-${index}`);
      ans.id = `faq-answer-${index}`;
      btn.setAttribute('data-index', index);

      // Store original text for search filtering
      btn.setAttribute('data-search-text', btn.textContent.toLowerCase());

      // Click handler
      btn.addEventListener('click', (e) => this.toggleItem(item));

      // Keyboard support: Enter / Space / ArrowDown / ArrowUp / Home / End
      btn.addEventListener('keydown', (e) => this.handleKeydown(e, item));

      // Hover effect for preview
      btn.addEventListener('mouseenter', (e) => this.showPreview(item));
      btn.addEventListener('mouseleave', (e) => this.hidePreview(item));
    });

    // Setup search functionality if on FAQ page
    if (this.searchInput) {
      this.setupSearch();
    }

    // Restore state from URL hash
    this.restoreFromHash();

    // Listen for hash changes (back button support)
    window.addEventListener('hashchange', () => this.restoreFromHash());

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeItem) {
        this.closeItem(this.activeItem);
        this.activeItem.querySelector('.question').focus();
      }
    });

    // Add analytics tracking
    this.setupAnalytics();

    console.log('FAQ Accordion initialized successfully');
  }

  setupSearch() {
    this.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      this.filterFAQs(query);
    });

    // Debounce search for better performance
    let debounceTimer;
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = e.target.value.toLowerCase();
        this.filterFAQs(query);
      }, 300);
    });
  }

  filterFAQs(query) {
    let visibleCount = 0;
    const answerTexts = new Map();

    // Extract and cache answer text for each FAQ
    this.items.forEach((item, index) => {
      const answerContent = item.querySelector('.answer-content');
      if (answerContent && !answerTexts.has(index)) {
        answerTexts.set(index, answerContent.textContent.toLowerCase());
      }
    });

    this.items.forEach((item) => {
      const btn = item.querySelector('.question');
      const questionText = btn.getAttribute('data-search-text');
      const index = Array.from(this.items).indexOf(item);
      const answerText = answerTexts.get(index) || '';

      const matches = questionText.includes(query) || answerText.includes(query);

      if (query === '' || matches) {
        item.style.display = '';
        item.classList.add('highlight');
        visibleCount++;
        
        // Auto-expand matching items
        if (query && matches && !item.classList.contains('open')) {
          setTimeout(() => this.openItem(item), 100);
        }
      } else {
        item.style.display = 'none';
        item.classList.remove('highlight');
        if (item.classList.contains('open')) {
          this.closeItem(item);
        }
      }
    });

    // Show/hide no results message
    if (this.noResults) {
      this.noResults.hidden = visibleCount > 0;
    }

    // Log search event
    if (query) {
      this.trackSearch(query, visibleCount);
    }
  }

  handleKeydown(e, item) {
    const visibleItems = Array.from(this.items).filter(i => i.style.display !== 'none');
    const currentIndex = visibleItems.indexOf(item);
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.toggleItem(item);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % visibleItems.length;
      visibleItems[nextIndex].querySelector('.question').focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      visibleItems[prevIndex].querySelector('.question').focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      visibleItems[0].querySelector('.question').focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      visibleItems[visibleItems.length - 1].querySelector('.question').focus();
    }
  }

  toggleItem(item) {
    const isOpen = item.classList.contains('open');
    if (isOpen) {
      this.closeItem(item);
    } else {
      this.openItem(item);
    }
  }

  openItem(item) {
    // Close previous item
    if (this.activeItem && this.activeItem !== item) {
      this.closeItem(this.activeItem);
    }

    const btn = item.querySelector('.question');
    const ans = item.querySelector('.answer');
    const idx = Array.from(this.items).indexOf(item);

    // Add open class and update aria
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');

    // Update URL hash
    history.pushState(null, '', `#faq-${idx + 1}`);

    // Trigger animation by setting max-height
    const height = ans.scrollHeight;
    ans.style.maxHeight = height + 'px';

    // Store active item
    this.activeItem = item;

    // Trigger re-layout for smooth animation
    void ans.offsetHeight;

    // Remove maxHeight after transition completes
    ans.addEventListener('transitionend', function cleanup() {
      if (item.classList.contains('open')) {
        ans.style.maxHeight = 'none';
      }
      ans.removeEventListener('transitionend', cleanup);
    }, { once: true });

    // Log analytics
    this.trackFAQOpen(idx);
  }

  closeItem(item) {
    const btn = item.querySelector('.question');
    const ans = item.querySelector('.answer');

    item.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    ans.style.maxHeight = null;

    if (this.activeItem === item) {
      this.activeItem = null;
      history.pushState(null, '', window.location.pathname);
    }
  }

  showPreview(item) {
    const ans = item.querySelector('.answer');
    if (!item.classList.contains('open') && ans.textContent.length > 0) {
      item.style.borderLeftColor = 'rgba(17, 17, 17, 0.3)';
    }
  }

  hidePreview(item) {
    if (!item.classList.contains('open')) {
      item.style.borderLeftColor = 'transparent';
    }
  }

  restoreFromHash() {
    const hash = window.location.hash.replace('#', '');
    
    // Close all items first
    this.items.forEach(item => this.closeItem(item));

    if (hash && hash.startsWith('faq-')) {
      const idx = parseInt(hash.split('-')[1], 10) - 1;
      if (!isNaN(idx) && this.items[idx]) {
        setTimeout(() => this.openItem(this.items[idx]), 0);
      }
    }
  }

  setupAnalytics() {
    // Optional: Setup basic analytics tracking
    if (!window.faqAnalytics) {
      window.faqAnalytics = {
        openCounts: {},
        searchQueries: {},
        totalOpens: 0,
        totalSearches: 0,
        sessionStartTime: Date.now(),
        currentPage: this.detectPage()
      };
    }
  }

  detectPage() {
    const path = window.location.pathname;
    return path.includes('faqs.html') ? 'faq' : 'index';
  }

  trackFAQOpen(index) {
    if (window.faqAnalytics) {
      window.faqAnalytics.openCounts[index] = (window.faqAnalytics.openCounts[index] || 0) + 1;
      window.faqAnalytics.totalOpens++;
      console.log(`FAQ #${index + 1} opened. Total opens: ${window.faqAnalytics.totalOpens}`);
    }
  }

  trackSearch(query, results) {
    if (window.faqAnalytics) {
      window.faqAnalytics.searchQueries[query] = (window.faqAnalytics.searchQueries[query] || 0) + 1;
      window.faqAnalytics.totalSearches++;
      console.log(`Search: "${query}" found ${results} results`);
    }
  }
}

// Initialize FAQ accordion when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const accordion = new FAQAccordion();

  // Smooth scroll to FAQ section when opening items (FAQ page only)
  const faqSection = document.querySelector('.faq-section');
  document.querySelectorAll('.faq-item .question').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        faqSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    });
  });

  // Add click-to-copy for email links
  document.querySelectorAll('.faq-link[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.getSelection().toString() === '') {
        const email = link.href.replace('mailto:', '');
        navigator.clipboard.writeText(email).then(() => {
          const origText = link.textContent;
          link.textContent = 'Copied!';
          setTimeout(() => {
            link.textContent = origText;
          }, 2000);
        });
      }
    });
  });

  // Focus management for search input
  const searchInput = document.getElementById('faq-search');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchInput.blur();
        accordion.filterFAQs('');
      }
    });
  }

  console.log('Page loaded: ' + window.faqAnalytics?.currentPage || 'unknown');
});
