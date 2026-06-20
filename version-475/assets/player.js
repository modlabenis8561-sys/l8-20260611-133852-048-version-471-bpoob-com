var MoviePlayer = (function () {
    function mount(rootId, url) {
        var root = document.getElementById(rootId);
        if (!root) {
            return;
        }
        var video = root.querySelector('video');
        var mask = root.querySelector('.play-mask');
        var hls = null;
        if (!video || !url) {
            return;
        }
        function loadVideo() {
            if (video.getAttribute('data-ready') === '1') {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false,
                    backBufferLength: 90
                });
                hls.loadSource(url);
                hls.attachMedia(video);
            } else {
                video.src = url;
            }
            video.setAttribute('data-ready', '1');
        }
        function startVideo() {
            loadVideo();
            root.classList.add('is-playing');
            if (mask) {
                mask.hidden = true;
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    if (mask) {
                        mask.hidden = false;
                    }
                    root.classList.remove('is-playing');
                });
            }
        }
        if (mask) {
            mask.addEventListener('click', startVideo);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                startVideo();
            }
        });
        video.addEventListener('play', function () {
            root.classList.add('is-playing');
            if (mask) {
                mask.hidden = true;
            }
        });
        video.addEventListener('pause', function () {
            if (!video.ended && mask) {
                mask.hidden = false;
            }
        });
        window.addEventListener('pagehide', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }
    return {
        mount: mount
    };
})();
