(function () {
  function setupPlayer(shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play-button]');
    var stream = video ? video.getAttribute('data-stream') : '';
    var attached = false;
    var hls = null;

    if (!video || !stream) {
      return;
    }

    function attachStream(playAfterAttach) {
      if (attached) {
        if (playAfterAttach) {
          video.play().catch(function () {});
        }
        return;
      }

      attached = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (playAfterAttach) {
            video.play().catch(function () {});
          }
        });
      } else {
        video.src = stream;
        if (playAfterAttach) {
          video.play().catch(function () {});
        }
      }
    }

    function play() {
      attachStream(true);
    }

    function toggle() {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('click', toggle);

    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      shell.classList.remove('is-playing');
    });

    video.addEventListener('ended', function () {
      shell.classList.remove('is-playing');
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
})();
