(function () {
  window.initMoviePlayer = function (source) {
    var root = document.querySelector('[data-player-root]');
    if (!root) {
      return;
    }

    var video = root.querySelector('video');
    var overlay = root.querySelector('.play-overlay');
    var isReady = false;
    var hls = null;

    function attach() {
      if (isReady || !video || !source) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }

      isReady = true;
    }

    function play() {
      attach();
      root.classList.add('is-playing');
      video.controls = true;
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          root.classList.remove('is-playing');
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        root.classList.add('is-playing');
      });
      video.addEventListener('ended', function () {
        root.classList.remove('is-playing');
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls && hls.destroy) {
        hls.destroy();
      }
    });
  };
})();
