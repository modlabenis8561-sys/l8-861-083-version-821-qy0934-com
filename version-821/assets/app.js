(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5600);
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));

  panels.forEach(function (panel) {
    var scope = panel.getAttribute('data-scope') || 'body';
    var container = scope === 'body' ? document : document.querySelector(scope);
    var cards = container ? Array.prototype.slice.call(container.querySelectorAll('.movie-card')) : [];
    var input = panel.querySelector('[data-filter="keyword"]');
    var genre = panel.querySelector('[data-filter="genre"]');
    var year = panel.querySelector('[data-filter="year"]');
    var type = panel.querySelector('[data-filter="type"]');
    var noResult = document.querySelector(panel.getAttribute('data-empty') || '.no-result');

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilters() {
      var keywordValue = normalize(input && input.value);
      var genreValue = normalize(genre && genre.value);
      var yearValue = normalize(year && year.value);
      var typeValue = normalize(type && type.value);
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-search'));
        var cardGenre = normalize(card.getAttribute('data-genre'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var cardType = normalize(card.getAttribute('data-type'));
        var matched = true;

        if (keywordValue && text.indexOf(keywordValue) === -1) {
          matched = false;
        }
        if (genreValue && cardGenre.indexOf(genreValue) === -1) {
          matched = false;
        }
        if (yearValue && cardYear !== yearValue) {
          matched = false;
        }
        if (typeValue && cardType !== typeValue) {
          matched = false;
        }

        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (noResult) {
        noResult.classList.toggle('is-visible', visible === 0);
      }
    }

    [input, genre, year, type].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });
  });

  var players = Array.prototype.slice.call(document.querySelectorAll('.video-wrap'));

  players.forEach(function (wrap) {
    var video = wrap.querySelector('video');
    var overlay = wrap.querySelector('.play-overlay');
    var stream = wrap.getAttribute('data-stream');
    var loaded = false;

    function prepareVideo() {
      if (!video || !stream || loaded) {
        return;
      }

      loaded = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        video._hlsInstance = hls;
      } else {
        video.src = stream;
      }
    }

    function startVideo() {
      prepareVideo();

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      if (video) {
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }
    }

    if (overlay) {
      overlay.addEventListener('click', startVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!loaded) {
          startVideo();
        }
      });
      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });
    }
  });
})();
