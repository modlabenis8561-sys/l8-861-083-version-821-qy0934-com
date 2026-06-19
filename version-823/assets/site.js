(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    var showSlide = function (nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, current) {
        slide.classList.toggle('is-active', current === index);
      });

      dots.forEach(function (dot, current) {
        dot.classList.toggle('is-active', current === index);
      });
    };

    var startAuto = function () {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    };

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        startAuto();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        startAuto();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startAuto();
      });
    });

    startAuto();
  }

  var searchForms = Array.prototype.slice.call(document.querySelectorAll('[data-page-search]'));
  var cardList = document.querySelector('[data-card-list]');
  var cards = cardList ? Array.prototype.slice.call(cardList.children) : [];

  var applyFilter = function (value) {
    var query = String(value || '').trim().toLowerCase();

    cards.forEach(function (card) {
      var haystack = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
      var visible = !query || haystack.indexOf(query) !== -1;
      card.style.display = visible ? '' : 'none';
    });
  };

  searchForms.forEach(function (form) {
    var input = form.querySelector('input[type="search"]');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilter(input ? input.value : '');
    });

    if (input) {
      input.addEventListener('input', function () {
        applyFilter(input.value);
      });
    }
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-filter]')).forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.getAttribute('data-filter') || '';
      var input = document.querySelector('[data-page-search] input[type="search"]');

      if (input) {
        input.value = value;
      }

      applyFilter(value);
    });
  });

  if (cardList) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (initialQuery) {
      var pageInput = document.querySelector('[data-page-search] input[type="search"]');

      if (pageInput) {
        pageInput.value = initialQuery;
      }

      applyFilter(initialQuery);
    }
  }
})();
