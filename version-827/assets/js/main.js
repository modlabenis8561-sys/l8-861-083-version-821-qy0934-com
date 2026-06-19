(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function setupHero() {
    document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
      var prev = carousel.querySelector('[data-hero-prev]');
      var next = carousel.querySelector('[data-hero-next]');
      var index = 0;
      var timer = null;
      if (!slides.length) {
        return;
      }
      function show(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === index);
        });
      }
      function start() {
        stop();
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }
      function stop() {
        if (timer) {
          window.clearInterval(timer);
        }
      }
      if (prev) {
        prev.addEventListener('click', function () {
          show(index - 1);
          start();
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          show(index + 1);
          start();
        });
      }
      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
          show(dotIndex);
          start();
        });
      });
      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', start);
      show(0);
      start();
    });
  }

  function setupFilters() {
    document.querySelectorAll('[data-card-filter]').forEach(function (bar) {
      var root = bar.parentElement;
      var cards = Array.prototype.slice.call(root.querySelectorAll('.movie-card, .rank-row'));
      var queryInput = bar.querySelector('[data-filter-query]');
      var yearInput = bar.querySelector('[data-filter-year]');
      var regionInput = bar.querySelector('[data-filter-region]');
      var categorySelect = bar.querySelector('[data-filter-category]');
      var empty = root.querySelector('[data-empty-state]');
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get('q');
      if (initialQuery && queryInput) {
        queryInput.value = initialQuery;
      }
      function apply() {
        var query = normalize(queryInput && queryInput.value);
        var year = normalize(yearInput && yearInput.value);
        var region = normalize(regionInput && regionInput.value);
        var category = normalize(categorySelect && categorySelect.value);
        var visible = 0;
        cards.forEach(function (card) {
          var search = normalize(card.getAttribute('data-search'));
          var cardYear = normalize(card.getAttribute('data-year'));
          var cardRegion = normalize(card.getAttribute('data-region'));
          var cardCategory = normalize(card.querySelector('.badge-category') ? card.querySelector('.badge-category').textContent : card.getAttribute('data-tags'));
          var matched = true;
          if (query && search.indexOf(query) === -1) {
            matched = false;
          }
          if (year && cardYear.indexOf(year) === -1) {
            matched = false;
          }
          if (region && cardRegion.indexOf(region) === -1) {
            matched = false;
          }
          if (category && cardCategory.indexOf(category) === -1) {
            matched = false;
          }
          card.hidden = !matched;
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }
      [queryInput, yearInput, regionInput, categorySelect].forEach(function (input) {
        if (input) {
          input.addEventListener('input', apply);
          input.addEventListener('change', apply);
        }
      });
      apply();
    });
  }

  function setupDetailPlay() {
    document.querySelectorAll('[data-detail-play]').forEach(function (button) {
      button.addEventListener('click', function () {
        var player = document.querySelector('.video-player');
        var overlay = player && player.querySelector('.player-overlay');
        if (overlay) {
          overlay.click();
          player.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupDetailPlay();
  });
})();
