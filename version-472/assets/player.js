(function () {
    function initMoviePlayer(options) {
        var video = document.querySelector(options.videoSelector);
        var overlay = document.querySelector(options.overlaySelector);
        var hls = null;
        var attached = false;

        if (!video || !options.source) {
            return;
        }

        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = options.source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(options.source);
                hls.attachMedia(video);
            } else {
                video.src = options.source;
            }
        }

        function hideOverlay() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        }

        function showOverlay() {
            if (overlay && video.paused && video.currentTime === 0) {
                overlay.classList.remove("is-hidden");
            }
        }

        function start() {
            attach();
            hideOverlay();
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    showOverlay();
                });
            }
        }

        if (overlay) {
            overlay.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            } else {
                video.pause();
            }
        });
        video.addEventListener("play", hideOverlay);
        video.addEventListener("ended", showOverlay);
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
})();
