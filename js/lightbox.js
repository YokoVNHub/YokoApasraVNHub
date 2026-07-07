document.addEventListener("DOMContentLoaded", () => {

    const lightbox = document.getElementById("lightbox");

    if (!lightbox) return;

    const image = document.getElementById("lightbox-image");
    const caption = document.getElementById("lightbox-caption");
    const counter = document.getElementById("lightbox-counter");
    const download = document.getElementById("lightbox-download");

    const closeBtn = document.querySelector(".lightbox-close");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");

    let images = [];
    let currentIndex = 0;

    /* ==========================================
       SHOW IMAGE
    ========================================== */

    function showImage(index) {

        currentIndex = index;

        const current = images[currentIndex];

        image.src = current.src;
        image.alt = current.alt;

        if (caption) {

            caption.textContent = current.alt;

        }

        if (counter) {

            counter.textContent =
                `${currentIndex + 1} / ${images.length}`;

        }

        if (download) {

            download.href = current.src;

            const parts = current.src.split("/");

            const folder = parts[parts.length - 2];

            const file = parts[parts.length - 1];

            download.download = `yoko-${folder}-${file}`;

        }

        if (images.length <= 1) {

            prevBtn.style.display = "none";
            nextBtn.style.display = "none";

        } else {

            prevBtn.style.display = "flex";
            nextBtn.style.display = "flex";

        }

    }

    /* ==========================================
       OPEN
    ========================================== */

    function open(index) {

        showImage(index);

        lightbox.classList.add("show");

        document.body.style.overflow = "hidden";

    }

    /* ==========================================
       CLOSE
    ========================================== */

    function close() {

        lightbox.classList.remove("show");

        document.body.style.overflow = "";

    }

    /* ==========================================
       PREVIOUS
    ========================================== */

    function previous() {

        currentIndex =
            (currentIndex - 1 + images.length) % images.length;

        showImage(currentIndex);

    }

    /* ==========================================
       NEXT
    ========================================== */

    function next() {

        currentIndex =
            (currentIndex + 1) % images.length;

        showImage(currentIndex);

    }

    /* ==========================================
       OPEN LIGHTBOX
    ========================================== */

    document.addEventListener("click", (event) => {

        const target =
            event.target.closest(".lightbox-trigger");

        if (!target) return;

        event.preventDefault();

        images = Array.from(
            document.querySelectorAll(".lightbox-trigger")
        );

        open(images.indexOf(target));

    });

    /* ==========================================
       BUTTON EVENTS
    ========================================== */

    closeBtn?.addEventListener("click", close);

    prevBtn?.addEventListener("click", previous);

    nextBtn?.addEventListener("click", next);

    /* ==========================================
       CLICK BACKGROUND
    ========================================== */

    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {

            close();

        }

    });

    /* ==========================================
       KEYBOARD
    ========================================== */

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

    /* ==========================================
       MOBILE SWIPE
    ========================================== */

    let startX = 0;

    lightbox.addEventListener("touchstart", (event) => {

        startX = event.touches[0].clientX;

    });

    lightbox.addEventListener("touchend", (event) => {

        const endX = event.changedTouches[0].clientX;

        const distance = endX - startX;

        if (Math.abs(distance) < 50) return;

        if (distance > 0) {

            previous();

        } else {

            next();

        }

    });

});
