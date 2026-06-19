(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

  panels.forEach(function (panel) {
    var input = panel.querySelector('[data-search-input]');
    var select = panel.querySelector('[data-category-select]');
    var scope = panel.closest('[data-filter-scope]') || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
    var empty = scope.querySelector('[data-empty-state]');

    function valueOf(card) {
      return [
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-year'),
        card.getAttribute('data-type'),
        card.textContent
      ].join(' ').toLowerCase();
    }

    function runFilter() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var selected = select ? select.value.trim() : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = valueOf(card);
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchCategory = !selected || text.indexOf(selected.toLowerCase()) !== -1;
        var matched = matchKeyword && matchCategory;

        card.style.display = matched ? '' : 'none';

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    if (input) {
      input.addEventListener('input', runFilter);
    }

    if (select) {
      select.addEventListener('change', runFilter);
    }
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (shell) {
    var video = shell.querySelector('video');
    var trigger = shell.querySelector('[data-play-trigger]');
    var stream = video ? video.getAttribute('data-stream') : '';
    var loaded = false;
    var hls = null;

    function attachStream() {
      if (!video || !stream || loaded) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }

      loaded = true;
    }

    function playVideo() {
      attachStream();
      shell.classList.add('is-playing');

      if (video) {
        video.controls = true;
        var playResult = video.play();

        if (playResult && typeof playResult.catch === 'function') {
          playResult.catch(function () {});
        }
      }
    }

    if (trigger) {
      trigger.addEventListener('click', playVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!loaded) {
          playVideo();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
}());
