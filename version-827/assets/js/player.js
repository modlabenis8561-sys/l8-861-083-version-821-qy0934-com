(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  var loadingHls = false;
  var hlsCallbacks = [];

  function loadHls(callback) {
    if (window.Hls) {
      callback(true);
      return;
    }
    hlsCallbacks.push(callback);
    if (loadingHls) {
      return;
    }
    loadingHls = true;
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js';
    script.onload = function () {
      var ok = !!window.Hls;
      hlsCallbacks.splice(0).forEach(function (fn) {
        fn(ok);
      });
    };
    script.onerror = function () {
      hlsCallbacks.splice(0).forEach(function (fn) {
        fn(false);
      });
    };
    document.head.appendChild(script);
  }

  function setupPlayer(player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    var message = player.querySelector('.player-message');
    var source = player.getAttribute('data-video-url');
    var started = false;
    var initialized = false;
    var hlsInstance = null;

    function setMessage(text) {
      if (message) {
        message.textContent = text || '';
      }
    }

    function initialize(done) {
      if (initialized) {
        done();
        return;
      }
      initialized = true;
      if (!source) {
        setMessage('播放暂不可用，请稍后再试');
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        done();
        return;
      }
      loadHls(function (ok) {
        if (ok && window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
            if (data && data.fatal) {
              setMessage('播放暂不可用，请稍后再试');
            }
          });
          done();
        } else {
          setMessage('播放暂不可用，请稍后再试');
        }
      });
    }

    function play() {
      initialize(function () {
        var result = video.play();
        if (result && result.catch) {
          result.catch(function () {
            setMessage('点击画面即可继续播放');
          });
        }
      });
    }

    function toggle() {
      if (!started || video.paused) {
        play();
      } else {
        video.pause();
      }
    }

    if (overlay) {
      overlay.addEventListener('click', play);
    }
    video.addEventListener('click', toggle);
    video.addEventListener('play', function () {
      started = true;
      player.classList.add('is-playing');
      setMessage('');
    });
    video.addEventListener('pause', function () {
      player.classList.remove('is-playing');
    });
    video.addEventListener('ended', function () {
      player.classList.remove('is-playing');
    });
    video.addEventListener('error', function () {
      setMessage('播放暂不可用，请稍后再试');
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  ready(function () {
    document.querySelectorAll('.video-player').forEach(setupPlayer);
  });
})();
