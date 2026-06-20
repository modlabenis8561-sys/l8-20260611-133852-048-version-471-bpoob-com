(function () {
  const menuButton = document.querySelector('.mobile-menu-button');
  const mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      mobilePanel.hidden = expanded;
    });
  }

  const hero = document.querySelector('.js-hero');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    const previous = hero.querySelector('.hero-prev');
    const next = hero.querySelector('.hero-next');
    let current = 0;
    let timer = null;

    function showSlide(index) {
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
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (previous) {
      previous.addEventListener('click', function () {
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
    play();
  }

  const searchInput = document.querySelector('.js-search-input');
  const searchCards = Array.from(document.querySelectorAll('.search-card'));
  const searchTitle = document.querySelector('.js-search-title');
  const searchCount = document.querySelector('.js-search-count');

  if (searchInput && searchCards.length) {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';
    searchInput.value = initialQuery;

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applySearch() {
      const query = normalize(searchInput.value);
      let visible = 0;

      searchCards.forEach(function (card) {
        const text = normalize(card.getAttribute('data-search'));
        const matched = !query || text.indexOf(query) !== -1;
        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (searchTitle) {
        searchTitle.textContent = query ? '搜索结果' : '全部影片';
      }

      if (searchCount) {
        searchCount.textContent = query ? '已完成相关内容筛选' : '输入关键词后自动筛选结果';
      }
    }

    searchInput.addEventListener('input', applySearch);
    applySearch();
  }

  const hlsUrl = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
  let hlsLoader = null;

  function loadHls() {
    if (window.Hls) {
      return Promise.resolve();
    }

    if (hlsLoader) {
      return hlsLoader;
    }

    hlsLoader = new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      script.src = hlsUrl;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return hlsLoader;
  }

  async function startPlayer(frame) {
    const video = frame.querySelector('video');
    const stream = frame.getAttribute('data-stream');

    if (!video || !stream) {
      return;
    }

    try {
      if (video.dataset.ready !== '1') {
        await loadHls().catch(function () {});

        if (window.Hls && window.Hls.isSupported()) {
          const hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });

          hls.loadSource(stream);
          hls.attachMedia(video);
          video.dataset.ready = '1';
          video._hls = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
          video.dataset.ready = '1';
        } else {
          video.src = stream;
          video.dataset.ready = '1';
        }
      }

      frame.classList.add('is-playing');
      const playback = video.play();

      if (playback && typeof playback.catch === 'function') {
        playback.catch(function () {});
      }
    } catch (error) {
      frame.classList.remove('is-playing');
    }
  }

  document.querySelectorAll('.js-player').forEach(function (frame) {
    const button = frame.querySelector('.player-start');

    if (button) {
      button.addEventListener('click', function () {
        startPlayer(frame);
      });
    }
  });

  document.querySelectorAll('[data-play-target]').forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const selector = button.getAttribute('data-play-target');
      const frame = document.querySelector(selector);

      if (frame) {
        frame.scrollIntoView({ behavior: 'smooth', block: 'center' });
        startPlayer(frame);
      }
    });
  });
})();
