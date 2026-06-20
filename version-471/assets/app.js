const select = (selector, root = document) => root.querySelector(selector);
const selectAll = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function setupMenu() {
    const button = select('.menu-toggle');
    const menu = select('.mobile-nav');
    if (!button || !menu) {
        return;
    }

    button.addEventListener('click', () => {
        const open = menu.classList.toggle('is-open');
        button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
}

function setupHero() {
    const hero = select('[data-hero]');
    if (!hero) {
        return;
    }

    const slides = selectAll('.hero-slide', hero);
    const dots = selectAll('.hero-dot', hero);
    const prev = select('.hero-prev', hero);
    const next = select('.hero-next', hero);
    let index = 0;
    let timer = null;

    const show = (target) => {
        if (!slides.length) {
            return;
        }
        index = (target + slides.length) % slides.length;
        slides.forEach((slide, itemIndex) => {
            slide.classList.toggle('is-active', itemIndex === index);
        });
        dots.forEach((dot, itemIndex) => {
            dot.classList.toggle('is-active', itemIndex === index);
        });
    };

    const restart = () => {
        if (timer) {
            window.clearInterval(timer);
        }
        timer = window.setInterval(() => show(index + 1), 5200);
    };

    dots.forEach((dot, itemIndex) => {
        dot.addEventListener('click', () => {
            show(itemIndex);
            restart();
        });
    });

    if (prev) {
        prev.addEventListener('click', () => {
            show(index - 1);
            restart();
        });
    }

    if (next) {
        next.addEventListener('click', () => {
            show(index + 1);
            restart();
        });
    }

    show(0);
    restart();
}

function setupCardFilters() {
    const controls = selectAll('[data-filter-value]');
    if (!controls.length) {
        return;
    }

    const cards = selectAll('[data-category]');
    controls.forEach((control) => {
        control.addEventListener('click', () => {
            const value = control.dataset.filterValue || 'all';
            controls.forEach((item) => item.classList.toggle('is-active', item === control));
            cards.forEach((card) => {
                const matched = value === 'all' || card.dataset.category === value || card.dataset.type === value || card.dataset.region === value;
                card.classList.toggle('hidden-card', !matched);
            });
        });
    });
}

function setupSearchPage() {
    const form = select('[data-search-form]');
    const results = select('[data-search-results]');
    const note = select('[data-search-note]');
    if (!form || !results || !window.SearchMovies) {
        return;
    }

    const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
    const keyword = select('[name="keyword"]', form);
    const region = select('[name="region"]', form);
    const type = select('[name="type"]', form);
    const year = select('[name="year"]', form);
    const data = window.SearchMovies;

    const render = () => {
        const key = (keyword.value || '').trim().toLowerCase();
        const regionValue = region.value;
        const typeValue = type.value;
        const yearValue = year.value;

        const matched = data.filter((movie) => {
            const text = `${movie.title} ${movie.region} ${movie.type} ${movie.year} ${movie.tags} ${movie.oneLine}`.toLowerCase();
            return (!key || text.includes(key)) &&
                (!regionValue || movie.region === regionValue) &&
                (!typeValue || movie.type === typeValue) &&
                (!yearValue || String(movie.year) === yearValue);
        });

        const visible = matched.slice(0, 96);
        results.innerHTML = visible.map((movie) => {
            const title = escapeHtml(movie.title);
            const oneLine = escapeHtml(movie.oneLine);
            const regionText = escapeHtml(movie.region);
            const typeText = escapeHtml(movie.type);
            const yearText = escapeHtml(movie.year);
            const url = escapeHtml(movie.url);
            const cover = escapeHtml(movie.cover);
            return `
                <article class="movie-card">
                    <a href="${url}" class="poster">
                        <img src="${cover}" alt="${title}">
                        <span class="poster-badge">${yearText}</span>
                    </a>
                    <div class="movie-card-body">
                        <a href="${url}" class="movie-title">${title}</a>
                        <p class="movie-line">${oneLine}</p>
                        <div class="movie-meta">
                            <span>${regionText}</span>
                            <span>${typeText}</span>
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        if (note) {
            note.textContent = matched.length ? `找到 ${matched.length} 部相关影片` : '没有找到相关影片';
        }
    };

    form.addEventListener('input', render);
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        render();
    });
    render();
}

document.addEventListener('DOMContentLoaded', () => {
    setupMenu();
    setupHero();
    setupCardFilters();
    setupSearchPage();
});
