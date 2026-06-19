(function () {
    var mobileButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (mobileButton && mobileNav) {
        mobileButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
        var track = slider.querySelector('[data-hero-track]');
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var prev = slider.querySelector('[data-hero-prev]');
        var next = slider.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function go(nextIndex) {
            if (!track || slides.length === 0) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;
            track.style.transform = 'translateX(-' + (index * 100) + '%)';

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            if (slides.length <= 1) {
                return;
            }

            stop();
            timer = window.setInterval(function () {
                go(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                go(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                go(index + 1);
                start();
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                go(dotIndex);
                start();
            });
        });

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        go(0);
        start();
    });

    document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
        var searchInput = panel.querySelector('[data-search-input]');
        var typeFilter = panel.querySelector('[data-type-filter]');
        var regionFilter = panel.querySelector('[data-region-filter]');
        var resultText = panel.querySelector('[data-filter-result]');
        var list = document.querySelector('[data-filter-list]');
        var cards = list ? Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]')) : [];
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (searchInput && query) {
            searchInput.value = query;
        }

        function includesValue(source, target) {
            return !target || source.indexOf(target) !== -1;
        }

        function applyFilter() {
            var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
            var type = typeFilter ? typeFilter.value : '';
            var region = regionFilter ? regionFilter.value : '';
            var visibleCount = 0;

            cards.forEach(function (card) {
                var title = (card.dataset.title || '').toLowerCase();
                var cardRegion = card.dataset.region || '';
                var cardType = card.dataset.type || '';
                var genre = (card.dataset.genre || '').toLowerCase();
                var tags = (card.dataset.tags || '').toLowerCase();
                var haystack = [title, cardRegion.toLowerCase(), cardType.toLowerCase(), genre, tags].join(' ');
                var visible = includesValue(haystack, keyword) && includesValue(cardType, type) && includesValue(cardRegion, region);

                card.classList.toggle('is-hidden', !visible);

                if (visible) {
                    visibleCount += 1;
                }
            });

            if (resultText) {
                resultText.textContent = '当前显示 ' + visibleCount + ' 部影片';
            }
        }

        [searchInput, typeFilter, regionFilter].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        applyFilter();
    });

    document.querySelectorAll('[data-player]').forEach(function (player) {
        var video = player.querySelector('video');
        var button = player.querySelector('[data-play-button]');
        var source = player.dataset.src;
        var hlsInstance = null;
        var isLoaded = false;

        function loadSource() {
            if (!video || !source || isLoaded) {
                return Promise.resolve();
            }

            isLoaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                return Promise.resolve();
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                return new Promise(function (resolve) {
                    hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, resolve);
                    window.setTimeout(resolve, 1600);
                });
            }

            video.src = source;
            return Promise.resolve();
        }

        function playVideo() {
            loadSource().then(function () {
                var playResult = video.play();

                if (playResult && typeof playResult.catch === 'function') {
                    playResult.catch(function () {});
                }
            });

            if (button) {
                button.classList.add('is-hidden');
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    playVideo();
                }
            });

            video.addEventListener('play', function () {
                if (button) {
                    button.classList.add('is-hidden');
                }
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
})();
