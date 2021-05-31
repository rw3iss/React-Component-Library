export function debounce(func, wait = 100) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}

export function throttle(func, wait = 100) {
    let timer = null;
    return function (...args) {
        if (timer === null) {
            timer = setTimeout(() => {
                func.apply(this, args);
                timer = null;
            }, wait);
        }
    };
}

export function isMobile() {
    return Math.min(window.screen.width, window.screen.height) < 768;
}

export function getDocumentWidth() {
    var body = document.body, documentElement = document.documentElement;
    return Math.max(
        body.scrollWidth, documentElement.scrollWidth,
        body.offsetWidth, documentElement.offsetWidth,
        body.clientWidth, documentElement.clientWidth
    );
};

export function getDocumentHeight() {
    var body = document.body, documentElement = document.documentElement;
    return Math.max(
        body.scrollHeight, documentElement.scrollHeight,
        body.offsetHeight, documentElement.offsetHeight,
        body.clientHeight, documentElement.clientHeight
    );
  };