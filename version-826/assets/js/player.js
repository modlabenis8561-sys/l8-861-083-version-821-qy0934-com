import { H as Hls } from './hls-vendor.js';

(function () {
    var players = document.querySelectorAll('[data-player]');

    players.forEach(function (player) {
        var video = player.querySelector('video');
        var button = player.querySelector('[data-play-button]');
        var message = player.querySelector('[data-player-message]');
        var source = video ? video.getAttribute('data-video-src') : '';
        var loaded = false;
        var hls = null;

        function showMessage(text) {
            if (!message) {
                return;
            }

            message.textContent = text;
            message.classList.add('show');
        }

        function loadSource() {
            if (loaded || !video || !source) {
                return;
            }

            loaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return;
            }

            if (Hls && Hls.isSupported()) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });

                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        showMessage('视频暂时无法播放，请稍后重试');
                    }
                });
                return;
            }

            showMessage('当前环境暂时无法播放该视频');
        }

        function playVideo() {
            loadSource();

            if (!video) {
                return;
            }

            var promise = video.play();

            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    showMessage('点击视频控件即可开始播放');
                });
            }
        }

        function toggleVideo() {
            if (!video) {
                return;
            }

            if (video.paused) {
                playVideo();
            } else {
                video.pause();
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }

        if (video) {
            video.addEventListener('play', function () {
                player.classList.add('playing');
            });

            video.addEventListener('pause', function () {
                player.classList.remove('playing');
            });

            video.addEventListener('click', function () {
                loadSource();
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
