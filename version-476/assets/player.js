(function () {
    function attachStream(video, streamUrl) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            return Promise.resolve();
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                maxBufferLength: 30,
                backBufferLength: 30
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            return new Promise(function (resolve) {
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    resolve();
                });
                window.setTimeout(resolve, 1600);
            });
        }
        video.src = streamUrl;
        return Promise.resolve();
    }

    window.initMoviePlayer = function (videoId, overlayId, buttonId, streamUrl) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var button = document.getElementById(buttonId);
        var loaded = false;

        if (!video || !overlay || !button || !streamUrl) {
            return;
        }

        function play() {
            overlay.classList.add("is-hidden");
            var ready = loaded ? Promise.resolve() : attachStream(video, streamUrl);
            loaded = true;
            ready.then(function () {
                var request = video.play();
                if (request && typeof request.catch === "function") {
                    request.catch(function () {});
                }
            });
        }

        overlay.addEventListener("click", play);
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            play();
        });
        video.addEventListener("click", function () {
            if (!loaded) {
                play();
            }
        });
    };
})();
