(function () {
    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function setupMobileMenu() {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                restart();
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                restart();
            });
        });
        if (slides.length > 1) {
            restart();
        }
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
        panels.forEach(function (panel) {
            var scope = panel.parentElement || document;
            var list = scope.querySelector("[data-filter-list]") || document;
            var items = Array.prototype.slice.call(list.querySelectorAll(".movie-card-wrap"));
            var search = panel.querySelector("[data-filter-search]");
            var year = panel.querySelector("[data-filter-year]");
            var type = panel.querySelector("[data-filter-type]");
            var region = panel.querySelector("[data-filter-region]");
            var count = panel.querySelector("[data-filter-count]");

            function apply() {
                var q = normalize(search && search.value);
                var selectedYear = normalize(year && year.value);
                var selectedType = normalize(type && type.value);
                var selectedRegion = normalize(region && region.value);
                var visible = 0;

                items.forEach(function (item) {
                    var haystack = normalize([
                        item.getAttribute("data-title"),
                        item.getAttribute("data-region"),
                        item.getAttribute("data-type"),
                        item.getAttribute("data-year"),
                        item.getAttribute("data-tags")
                    ].join(" "));
                    var ok = true;
                    if (q && haystack.indexOf(q) === -1) {
                        ok = false;
                    }
                    if (selectedYear && normalize(item.getAttribute("data-year")) !== selectedYear) {
                        ok = false;
                    }
                    if (selectedType && normalize(item.getAttribute("data-type")).indexOf(selectedType) === -1) {
                        ok = false;
                    }
                    if (selectedRegion && normalize(item.getAttribute("data-region")).indexOf(selectedRegion) === -1) {
                        ok = false;
                    }
                    item.hidden = !ok;
                    if (ok) {
                        visible += 1;
                    }
                });
                if (count) {
                    count.textContent = visible + " 部";
                }
            }

            [search, year, type, region].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
            apply();
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        setupMobileMenu();
        setupHero();
        setupFilters();
    });
})();
