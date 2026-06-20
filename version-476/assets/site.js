(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
            return;
        }
        callback();
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-button]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function initBackTop() {
        var button = document.querySelector("[data-back-top]");
        if (!button) {
            return;
        }
        function update() {
            if (window.scrollY > 480) {
                button.classList.add("is-visible");
            } else {
                button.classList.remove("is-visible");
            }
        }
        window.addEventListener("scroll", update, { passive: true });
        button.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        update();
    }

    function initHero() {
        var carousel = document.querySelector("[data-hero-carousel]");
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
        if (slides.length <= 1) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
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
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });

        carousel.addEventListener("mouseenter", stop);
        carousel.addEventListener("mouseleave", start);
        start();
    }

    function textOf(card) {
        return [
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-year"),
            card.getAttribute("data-tags")
        ].join(" ").toLowerCase();
    }

    function filterCards(value, scope) {
        var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
        var empty = document.querySelector("[data-empty-state]");
        var tokens = value.toLowerCase().trim().split(/\s+/).filter(Boolean);
        var visible = 0;

        cards.forEach(function (card) {
            var haystack = textOf(card);
            var matched = tokens.every(function (token) {
                return haystack.indexOf(token) !== -1;
            });
            if (matched) {
                card.style.display = "";
                visible += 1;
            } else {
                card.style.display = "none";
            }
        });

        if (empty) {
            empty.classList.toggle("is-visible", visible === 0);
        }
    }

    function initLocalFilter() {
        var input = document.querySelector("[data-filter-input]");
        var grid = document.querySelector(".movie-grid");
        if (!input || !grid) {
            return;
        }
        input.addEventListener("input", function () {
            filterCards(input.value, grid);
        });
    }

    function initSearchPage() {
        var grid = document.querySelector("[data-search-results]");
        var input = document.querySelector("[data-search-box]");
        if (!grid || !input) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        input.value = query;
        filterCards(query, grid);
        input.addEventListener("input", function () {
            filterCards(input.value, grid);
        });
    }

    ready(function () {
        initMenu();
        initBackTop();
        initHero();
        initLocalFilter();
        initSearchPage();
    });
})();
