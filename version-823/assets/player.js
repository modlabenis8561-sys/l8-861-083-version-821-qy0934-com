(function () {
  var card = document.querySelector('[data-stream-url]');

  if (!card) {
    return;
  }

  var video = card.querySelector('video');
  var overlay = card.querySelector('.play-overlay');
  var streamUrl = card.getAttribute('data-stream-url') || '';
  var ready = false;
  var hlsPlayer = null;

  var attachStream = function () {
    if (!video || !streamUrl || ready) {
      return Promise.resolve();
    }

    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return Promise.resolve();
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsPlayer = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hlsPlayer.loadSource(streamUrl);
      hlsPlayer.attachMedia(video);

      return new Promise(function (resolve) {
        hlsPlayer.on(window.Hls.Events.MANIFEST_PARSED, function () {
          resolve();
        });

        setTimeout(resolve, 1800);
      });
    }

    video.src = streamUrl;
    return Promise.resolve();
  };

  var startPlayback = function () {
    attachStream().then(function () {
      card.classList.add('is-playing');
      video.controls = true;
      var playResult = video.play();

      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {
          card.classList.remove('is-playing');
        });
      }
    });
  };

  if (overlay) {
    overlay.addEventListener('click', startPlayback);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener('play', function () {
      card.classList.add('is-playing');
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hlsPlayer && typeof hlsPlayer.destroy === 'function') {
      hlsPlayer.destroy();
    }
  });
})();
