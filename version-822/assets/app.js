(function () {
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var toggle = document.querySelector('[data-nav-toggle]');
        var mobileNav = document.querySelector('[data-mobile-nav]');
        if (toggle && mobileNav) {
            toggle.addEventListener('click', function () {
                mobileNav.classList.toggle('is-open');
            });
        }

        var hero = document.querySelector('[data-hero]');
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
            var active = 0;
            var timer = null;
            var show = function (index) {
                if (!slides.length) {
                    return;
                }
                active = (index + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle('is-active', i === active);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('is-active', i === active);
                });
            };
            var start = function () {
                window.clearInterval(timer);
                timer = window.setInterval(function () {
                    show(active + 1);
                }, 5200);
            };
            dots.forEach(function (dot) {
                dot.addEventListener('click', function () {
                    show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
                    start();
                });
            });
            start();
        }

        var input = document.querySelector('[data-filter-input]');
        var select = document.querySelector('[data-filter-category]');
        var list = document.querySelector('[data-filter-list]');
        var empty = document.querySelector('[data-filter-empty]');
        if (input && list) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get('q');
            if (q) {
                input.value = q;
            }
            var items = Array.prototype.slice.call(list.querySelectorAll('.filter-item'));
            var normalize = function (value) {
                return String(value || '').toLowerCase().replace(/\s+/g, '');
            };
            var apply = function () {
                var keyword = normalize(input.value);
                var category = select ? select.value : '';
                var visible = 0;
                items.forEach(function (item) {
                    var haystack = normalize([
                        item.getAttribute('data-title'),
                        item.getAttribute('data-region'),
                        item.getAttribute('data-year'),
                        item.getAttribute('data-keywords')
                    ].join(' '));
                    var itemCategory = item.getAttribute('data-category') || '';
                    var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                    var matchedCategory = !category || itemCategory === category;
                    var matched = matchedKeyword && matchedCategory;
                    item.hidden = !matched;
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.hidden = visible !== 0;
                }
            };
            input.addEventListener('input', apply);
            if (select) {
                select.addEventListener('change', apply);
            }
            apply();
        }
    });
})();
