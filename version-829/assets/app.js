(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.mobile-toggle');

  if (header && toggle) {
    toggle.addEventListener('click', function () {
      header.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[type="search"]');
      var prefix = form.getAttribute('data-prefix') || './';
      var keyword = input ? input.value.trim() : '';
      var url = prefix + 'search.html';
      if (keyword) {
        url += '?q=' + encodeURIComponent(keyword);
      }
      window.location.href = url;
    });
  });

  document.querySelectorAll('.hero-carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.hero-track');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var prev = carousel.querySelector('.hero-control.prev');
    var next = carousel.querySelector('.hero-control.next');
    var current = 0;
    var timer = null;

    function render(index) {
      if (!track || slides.length === 0) {
        return;
      }
      current = (index + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      if (slides.length <= 1) {
        return;
      }
      stop();
      timer = setInterval(function () {
        render(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        render(index);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        render(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        render(current + 1);
        start();
      });
    }

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    render(0);
    start();
  });

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var keywordInput = scope.querySelector('[data-filter-keyword]');
    var yearSelect = scope.querySelector('[data-filter-year]');
    var typeSelect = scope.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
    var empty = scope.querySelector('[data-empty]');

    function apply() {
      var keyword = normalize(keywordInput ? keywordInput.value : '');
      var year = yearSelect ? yearSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type')
        ].join(' '));
        var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchesYear = !year || card.getAttribute('data-year') === year;
        var matchesType = !type || card.getAttribute('data-category') === type || card.getAttribute('data-type') === type;
        var show = matchesKeyword && matchesYear && matchesType;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }

    [keywordInput, yearSelect, typeSelect].forEach(function (item) {
      if (item) {
        item.addEventListener('input', apply);
        item.addEventListener('change', apply);
      }
    });

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && keywordInput) {
      keywordInput.value = q;
    }
    apply();
  });
})();
