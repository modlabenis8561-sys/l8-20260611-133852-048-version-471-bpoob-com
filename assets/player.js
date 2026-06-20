import { H as Hls } from './hls-vendor.js';

export function mountPlayer(videoId, buttonId, streamUrl) {
    const video = document.getElementById(videoId);
    const button = document.getElementById(buttonId);
    const layer = button ? button.closest('.play-layer') : null;
    let attached = false;

    if (!video || !button || !streamUrl) {
        return;
    }

    const attach = () => {
        if (attached) {
            return;
        }
        attached = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
            return;
        }

        if (Hls && Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            video.hls = hls;
            return;
        }

        video.src = streamUrl;
    };

    const start = () => {
        attach();
        if (layer) {
            layer.classList.add('is-hidden');
        }
        const promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(() => {
                if (layer) {
                    layer.classList.remove('is-hidden');
                }
            });
        }
    };

    button.addEventListener('click', start);
    video.addEventListener('play', () => {
        if (layer) {
            layer.classList.add('is-hidden');
        }
    });
    video.addEventListener('click', () => {
        if (video.paused) {
            start();
        }
    });
}
