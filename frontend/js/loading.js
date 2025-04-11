// Loading Animation Script
window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    if (!loader) return;

    setTimeout(() => {
        loader.classList.add("loader--hidden");
    }, 1250);

    loader.addEventListener("transitionend", () => {
        if (loader && loader.parentNode === document.body) {
            document.body.removeChild(loader);
        }
    });
}); 