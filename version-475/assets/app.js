(function () {
    function toggleMenu() {
        var header = document.querySelector('.site-header');
        var button = document.querySelector('.menu-toggle');
        if (!header || !button) {
            return;
        }
        button.addEventListener('click', function () {
            var isOpen = header.classList.toggle('is-open');
            button.setAttribute('aria-expanded', String(isOpen));
        });
    }

    function setupHero() {
        var hero = document.querySelector('.hero-slider');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        if (slides.length <= 1) {
            return;
        }
        var current = 0;
        var timer = null;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }
        function start() {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                stop();
                show(index);
                start();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function setupFilter() {
        var panel = document.querySelector('[data-filter-panel]');
        if (!panel) {
            return;
        }
        var input = panel.querySelector('[data-filter-input]');
        var year = panel.querySelector('[data-filter-year]');
        var region = panel.querySelector('[data-filter-region]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
        var empty = document.querySelector('[data-filter-empty]');
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q');
        if (input && initialQuery) {
            input.value = initialQuery;
        }
        function applyFilter() {
            var query = normalize(input && input.value);
            var yearValue = normalize(year && year.value);
            var regionValue = normalize(region && region.value);
            var visible = 0;
            cards.forEach(function (card) {
                var text = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-category')
                ].join(' '));
                var matchQuery = !query || text.indexOf(query) !== -1;
                var matchYear = !yearValue || normalize(card.getAttribute('data-year')) === yearValue;
                var cardRegion = normalize(card.getAttribute('data-region'));
                var matchRegion = !regionValue || cardRegion.indexOf(regionValue) !== -1;
                var matched = matchQuery && matchYear && matchRegion;
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
            input.addEventListener('input', applyFilter);
        }
        if (year) {
            year.addEventListener('change', applyFilter);
        }
        if (region) {
            region.addEventListener('change', applyFilter);
        }
        panel.addEventListener('submit', function (event) {
            event.preventDefault();
            applyFilter();
        });
        applyFilter();
    }

    function enhanceSearchForms() {
        var forms = Array.prototype.slice.call(document.querySelectorAll('.site-search-form'));
        forms.forEach(function (form) {
            form.addEventListener('submit', function (event) {
                var input = form.querySelector('input[name="q"]');
                if (!input || input.value.trim()) {
                    return;
                }
                event.preventDefault();
                input.focus();
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        toggleMenu();
        setupHero();
        setupFilter();
        enhanceSearchForms();
    });
})();
