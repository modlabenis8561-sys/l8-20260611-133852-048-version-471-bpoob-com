import { H as Hls } from './hls-vendor-dru42stk.js';

function setupPlayer(player) {
    var video = player.querySelector('video');
    var source = player.getAttribute('data-src');
    var overlay = player.querySelector('[data-player-overlay]');
    var buttons = Array.prototype.slice.call(player.querySelectorAll('[data-play-button]'));
    var hls = null;

    if (!video || !source) {
        return;
    }

    function attachSource() {
        if (video.getAttribute('data-ready') === '1') {
            return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }
        video.setAttribute('data-ready', '1');
    }

    function startPlayback() {
        attachSource();
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
        video.setAttribute('controls', 'controls');
        var playAttempt = video.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
            playAttempt.catch(function () {
                video.setAttribute('controls', 'controls');
            });
        }
    }

    buttons.forEach(function (button) {
        button.addEventListener('click', startPlayback);
    });
    if (overlay) {
        overlay.addEventListener('click', startPlayback);
    }
    video.addEventListener('click', function () {
        if (video.paused) {
            startPlayback();
        }
    });
    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
});
