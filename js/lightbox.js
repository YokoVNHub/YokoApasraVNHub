document.addEventListener("DOMContentLoaded", () => {

    const lightbox = document.getElementById("lightbox");

    if (!lightbox) return;

    const image = document.getElementById("lightbox-image");
    const caption = document.getElementById("lightbox-caption");

    const closeBtn = document.querySelector(".lightbox-close");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");
    const counter = document.getElementById("lightbox-counter");

    let images = [];
    let currentIndex = 0;

    function updateCounter() {

        if (!counter) return;

        counter.textContent =
            `${currentIndex + 1} / ${images.length}`;

    }

    function updateNavigation() {

        if (!prevBtn || !nextBtn) return;

        if (images.length <= 1) {

            prevBtn.style.display = "none";
            nextBtn.style.display = "none";

            return;

        }

        prevBtn.style.display = "flex";
        nextBtn.style.display = "flex";

    }

    function showImage(index) {

        currentIndex = index;

        image.src = images[index].src;
        image.alt = images[index].alt;

        if (caption) {

            caption.textContent = images[index].alt;

        }

        updateCounter();

        updateNavigation();

    }

    function open(index) {

        showImage(index);

        lightbox.classList.add("show");

        document.body.style.overflow = "hidden";

    }

    function close() {

        lightbox.classList.remove("show");

        document.body.style.overflow = "";

    }

    function previous() {

        currentIndex =
            (currentIndex - 1 + images.length) % images.length;

        showImage(currentIndex);

    }

    function next() {

        currentIndex =
            (currentIndex + 1) % images.length;

        showImage(currentIndex);

    }

    document.addEventListener("click", (event) => {

        const target =
            event.target.closest(".lightbox-trigger");

        if (!target) return;

        event.preventDefault();

        images = Array.from(
            document.querySelectorAll(".lightbox-trigger")
        );

        const index = images.indexOf(target);

        open(index);

    });

    if (closeBtn) {

        closeBtn.addEventListener("click", close);

    }

    if (prevBtn) {

        prevBtn.addEventListener("click", previous);

    }

    if (nextBtn) {

        nextBtn.addEventListener("click", next);

    }

    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {

            close();

        }

    });

    document.addEventListener("keydown", (event) => {

        if (!lightbox.classList.contains("show")) return;

        switch (event.key) {

            case "Escape":

                close();

                break;

            case "ArrowLeft":

                if (images.length > 1) {

                    previous();

                }

                break;

            case "ArrowRight":

                if (images.length > 1) {

                    next();

                }

                break;

        }

    });

});
