(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var navToggle = qs('[data-nav-toggle]');
  var mobileNav = qs('[data-mobile-nav]');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  qsa('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.style.opacity = '0';
    });
  });

  var hero = qs('[data-hero]');

  if (hero) {
    var slides = qsa('.hero-slide', hero);
    var dots = qsa('[data-hero-dot]', hero);
    var prev = qs('[data-hero-prev]', hero);
    var next = qs('[data-hero-next]', hero);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
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
        timer = null;
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

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  qsa('[data-filter-panel]').forEach(function (panel) {
    var input = qs('[data-search-input]', panel);
    var scope = panel.nextElementSibling || document;
    var cards = qsa('[data-card]', scope);
    var empty = qs('[data-empty-state]', scope) || qs('[data-empty-state]');
    var buttons = qsa('[data-filter]', panel);
    var activeFilter = 'all';

    if (!cards.length && panel.classList.contains('quick-search')) {
      scope = document;
      cards = qsa('[data-card]', scope);
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function apply() {
      var query = normalize(input ? input.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var content = normalize(card.getAttribute('data-search'));
        var type = card.getAttribute('data-type') || '';
        var typeMatch = activeFilter === 'all' || type.indexOf(activeFilter) !== -1;
        var queryMatch = !query || content.indexOf(query) !== -1;
        var show = typeMatch && queryMatch;
        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeFilter = button.getAttribute('data-filter') || 'all';
        buttons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        apply();
      });
    });

    if (buttons[0]) {
      buttons[0].classList.add('active');
    }

    if (input) {
      input.addEventListener('input', apply);
    }
  });

  var backTop = qs('[data-back-top]');

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
