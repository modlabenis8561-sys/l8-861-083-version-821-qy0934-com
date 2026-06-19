(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    document.querySelectorAll('img').forEach(function (image) {
        image.addEventListener('error', function () {
            var card = image.closest('.movie-poster, .hero-poster, .detail-poster');
            if (card) {
                card.classList.add('image-missing');
            }
        });
    });

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function play() {
            stop();
            timer = window.setInterval(function () {
                showSlide(current + 1);
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
                showSlide(current - 1);
                play();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                play();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                play();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', play);
        showSlide(0);
        play();
    }

    var searchInput = document.querySelector('[data-search-input]');
    var cardList = document.querySelector('[data-card-list]');

    if (searchInput && cardList) {
        var cards = Array.prototype.slice.call(cardList.querySelectorAll('[data-card]'));
        var empty = document.createElement('div');
        empty.className = 'no-results';
        empty.textContent = '没有找到匹配的影片';

        searchInput.addEventListener('input', function () {
            var keyword = searchInput.value.trim().toLowerCase();
            var visible = 0;

            cards.forEach(function (card) {
                var text = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type')
                ].join(' ').toLowerCase();

                var match = !keyword || text.indexOf(keyword) !== -1;
                card.classList.toggle('hidden', !match);

                if (match) {
                    visible += 1;
                }
            });

            if (!visible && !empty.parentNode) {
                cardList.appendChild(empty);
            }

            if (visible && empty.parentNode) {
                empty.parentNode.removeChild(empty);
            }
        });
    }
})();
