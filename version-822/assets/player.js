(function () {
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var stages = Array.prototype.slice.call(document.querySelectorAll('.js-player'));
        stages.forEach(function (stage) {
            var video = stage.querySelector('video');
            var overlay = stage.querySelector('.player-overlay');
            var src = stage.getAttribute('data-stream');
            var attached = false;
            var hls = null;

            function attach() {
                if (!video || !src || attached) {
                    return;
                }
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = src;
                    attached = true;
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(src);
                    hls.attachMedia(video);
                    attached = true;
                    return;
                }
                video.src = src;
                attached = true;
            }

            function play() {
                attach();
                if (overlay) {
                    overlay.classList.add('is-hidden');
                }
                var promise = video.play();
                if (promise && typeof promise.catch === 'function') {
                    promise.catch(function () {});
                }
            }

            if (overlay) {
                overlay.addEventListener('click', play);
            }
            stage.addEventListener('click', function (event) {
                if (event.target === stage) {
                    play();
                }
            });
            video.addEventListener('play', function () {
                if (overlay) {
                    overlay.classList.add('is-hidden');
                }
            });
            video.addEventListener('loadedmetadata', function () {
                video.controls = true;
            });
            window.addEventListener('beforeunload', function () {
                if (hls && typeof hls.destroy === 'function') {
                    hls.destroy();
                }
            });
        });
    });
})();
