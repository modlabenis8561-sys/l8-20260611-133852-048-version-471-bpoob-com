(function () {
    function selectAll(selector, parent) {
        return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function getQueryParam(name) {
        return new URLSearchParams(window.location.search).get(name) || '';
    }

    function setupMobileNav() {
        var toggle = document.querySelector('[data-nav-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function setupSiteSearch() {
        selectAll('[data-site-search]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = form.querySelector('input[name="q"]');
                var query = input ? input.value.trim() : '';
                if (query) {
                    window.location.href = './search.html?q=' + encodeURIComponent(query);
                } else {
                    window.location.href = './search.html';
                }
            });
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = selectAll('[data-hero-slide]', hero);
        var dots = selectAll('[data-hero-dot]', hero);
        var previous = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        if (previous) {
            previous.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                start();
            });
        });
        hero.addEventListener('mouseenter', function () {
            window.clearInterval(timer);
        });
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupLocalFilter() {
        var filterBox = document.querySelector('[data-filter-box]');
        var cards = selectAll('[data-movie-card]');
        if (!filterBox || !cards.length) {
            return;
        }
        var textInput = filterBox.querySelector('[data-local-filter]');
        var yearSelect = filterBox.querySelector('[data-year-filter]');
        var typeSelect = filterBox.querySelector('[data-type-filter]');
        var regionSelect = filterBox.querySelector('[data-region-filter]');
        var countBox = filterBox.querySelector('[data-filter-count]');
        var empty = document.querySelector('[data-empty-result]');

        function apply() {
            var keyword = normalize(textInput && textInput.value);
            var year = normalize(yearSelect && yearSelect.value);
            var type = normalize(typeSelect && typeSelect.value);
            var region = normalize(regionSelect && regionSelect.value);
            var visible = 0;
            cards.forEach(function (card) {
                var searchText = normalize(card.getAttribute('data-search'));
                var cardYear = normalize(card.getAttribute('data-year'));
                var cardType = normalize(card.getAttribute('data-type'));
                var cardRegion = normalize(card.getAttribute('data-region'));
                var matched = true;
                if (keyword && searchText.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (year && cardYear !== year) {
                    matched = false;
                }
                if (type && cardType !== type) {
                    matched = false;
                }
                if (region && cardRegion !== region) {
                    matched = false;
                }
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });
            if (countBox) {
                countBox.textContent = '当前显示 ' + visible + ' 部影片';
            }
            if (empty) {
                empty.style.display = visible ? 'none' : 'block';
            }
        }

        [textInput, yearSelect, typeSelect, regionSelect].forEach(function (control) {
            if (!control) {
                return;
            }
            control.addEventListener('input', apply);
            control.addEventListener('change', apply);
        });
        apply();
    }

    function setupSearchPage() {
        var searchPage = document.querySelector('[data-search-page]');
        if (!searchPage) {
            return;
        }
        var input = searchPage.querySelector('[data-search-input]');
        var cards = selectAll('[data-movie-card]', searchPage);
        var count = searchPage.querySelector('[data-search-count]');
        var empty = searchPage.querySelector('[data-empty-result]');
        var initial = getQueryParam('q');
        if (input) {
            input.value = initial;
        }

        function apply() {
            var keyword = normalize(input && input.value);
            var visible = 0;
            cards.forEach(function (card) {
                var searchText = normalize(card.getAttribute('data-search'));
                var matched = !keyword || searchText.indexOf(keyword) !== -1;
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });
            if (count) {
                count.textContent = keyword ? '搜索到 ' + visible + ' 部相关影片' : '共收录 ' + visible + ' 部影片';
            }
            if (empty) {
                empty.style.display = visible ? 'none' : 'block';
            }
        }

        if (input) {
            input.addEventListener('input', apply);
        }
        apply();
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMobileNav();
        setupSiteSearch();
        setupHero();
        setupLocalFilter();
        setupSearchPage();
    });
}());
