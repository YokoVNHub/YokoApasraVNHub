/* ==========================================================
   LIGHTBOX.JS
   Yoko Apasra VNHub
   Luna Edition v4
   Message 1 / 4
========================================================== */

(function () {

    "use strict";

    /* ======================================================
       STATE
    ====================================================== */

    let gallery = [];

    let currentIndex = 0;

    let initialized = false;

    let touchStartX = 0;

    let touchEndX = 0;

    /* ======================================================
       ELEMENTS
    ====================================================== */

    let lightbox;

    let image;

    let caption;

    let counter;

    let download;

    let prevButton;

    let nextButton;

    let closeButton;

    /* ======================================================
       INITIALIZE
    ====================================================== */

    window.initializeLightbox = function () {

        if (initialized) {

            refreshGallery();

            return;

        }

        initialized = true;

        lightbox = document.getElementById("lightbox");

        image = document.getElementById("lightbox-image");

        caption = document.getElementById("lightbox-caption");

        counter = document.getElementById("lightbox-counter");

        download = document.getElementById("lightbox-download");

        prevButton = document.querySelector(".lightbox-prev");

        nextButton = document.querySelector(".lightbox-next");

        closeButton = document.querySelector(".lightbox-close");

        if (
            !lightbox ||
            !image ||
            !caption ||
            !counter ||
            !download
        ) {

            console.error("Lightbox elements not found.");

            return;

        }

        refreshGallery();

        bindEvents();

    };

    /* ======================================================
       REFRESH GALLERY
    ====================================================== */

    function refreshGallery() {

        gallery = [

            ...document.querySelectorAll(".lightbox-trigger")

        ];

        gallery.forEach((item, index) => {

            item.dataset.index = index;

            item.removeEventListener(

                "click",

                handleImageClick

            );

            item.addEventListener(

                "click",

                handleImageClick

            );

        });

    }

    /* ======================================================
       OPEN
    ====================================================== */

    function handleImageClick(event) {

        event.preventDefault();

        currentIndex = Number(

            event.currentTarget.dataset.index

        );

        open(currentIndex);

    }

    function open(index) {

        if (!gallery.length) return;

        currentIndex = index;

        show(currentIndex);

        lightbox.classList.add("show");

        document.body.classList.add(

            "lightbox-open"

        );

    }

    /* ======================================================
       SHOW IMAGE
    ====================================================== */

    function show(index) {

        const item = gallery[index];

        if (!item) return;

        const src = item.getAttribute("href");

        const img = item.querySelector("img");

        image.src = src;

        image.alt = img?.alt || "";

        caption.textContent =

            img?.alt || "";

        counter.textContent =

            `${index + 1} / ${gallery.length}`;

        download.href = src;

        const filename =

            item.dataset.filename ||

            src.split("/").pop();

        download.download = filename;

        preload(index);

    }

     /* ======================================================
       CLOSE
    ====================================================== */

    function close() {

        lightbox.classList.remove("show");

        document.body.classList.remove(

            "lightbox-open"

        );

    }

    /* ======================================================
       PREVIOUS
    ====================================================== */

    function previous() {

        if (!gallery.length) return;

        currentIndex--;

        if (currentIndex < 0) {

            currentIndex = gallery.length - 1;

        }

        show(currentIndex);

    }

    /* ======================================================
       NEXT
    ====================================================== */

    function next() {

        if (!gallery.length) return;

        currentIndex++;

        if (currentIndex >= gallery.length) {

            currentIndex = 0;

        }

        show(currentIndex);

    }

    /* ======================================================
       PRELOAD
    ====================================================== */

    function preload(index) {

        if (!gallery.length) return;

        const previousIndex =

            index === 0

                ? gallery.length - 1

                : index - 1;

        const nextIndex =

            index === gallery.length - 1

                ? 0

                : index + 1;

        [

            previousIndex,

            nextIndex

        ].forEach(i => {

            const href =

                gallery[i]?.getAttribute("href");

            if (!href) return;

            const preloadImage = new Image();

            preloadImage.src = href;

        });

    }

    /* ======================================================
       UPDATE DOWNLOAD
    ====================================================== */

    function updateDownload(index) {

        const item = gallery[index];

        if (!item) return;

        const href = item.getAttribute("href");

        download.href = href;

        download.download =

            item.dataset.filename ||

            href.split("/").pop();

    }

    /* ======================================================
       SHOW WRAPPER
    ====================================================== */

    function show(index) {

        const item = gallery[index];

        if (!item) return;

        const href = item.getAttribute("href");

        const thumbnail =

            item.querySelector("img");

        image.style.opacity = "0";

        requestAnimationFrame(() => {

            image.src = href;

            image.alt =

                thumbnail?.alt || "";

            image.onload = () => {

                image.style.opacity = "1";

            };

        });

        caption.textContent =

            thumbnail?.alt || "";

        counter.textContent =

            `${index + 1} / ${gallery.length}`;

        updateDownload(index);

        preload(index);

    }

    /* ======================================================
       BUTTON EVENTS
    ====================================================== */

    prevButton.addEventListener(

        "click",

        previous

    );

    nextButton.addEventListener(

        "click",

        next

    );

    closeButton.addEventListener(

        "click",

        close

    );

     /* ======================================================
       KEYBOARD
    ====================================================== */

    document.addEventListener("keydown", handleKeyboard);

    function handleKeyboard(event) {

        if (!lightbox.classList.contains("show")) {

            return;

        }

        switch (event.key) {

            case "Escape":

                close();

                break;

            case "ArrowLeft":

                previous();

                break;

            case "ArrowRight":

                next();

                break;

        }

    }

    /* ======================================================
       CLICK OUTSIDE TO CLOSE
    ====================================================== */

    lightbox.addEventListener("click", event => {

        if (event.target === lightbox) {

            close();

        }

    });

    /* ======================================================
       STOP PROPAGATION
    ====================================================== */

    image.addEventListener("click", event => {

        event.stopPropagation();

    });

    prevButton.addEventListener("click", event => {

        event.stopPropagation();

    });

    nextButton.addEventListener("click", event => {

        event.stopPropagation();

    });

    closeButton.addEventListener("click", event => {

        event.stopPropagation();

    });

    download.addEventListener("click", event => {

        event.stopPropagation();

    });

    /* ======================================================
       TOUCH EVENTS
    ====================================================== */

    image.addEventListener(

        "touchstart",

        handleTouchStart,

        {

            passive:true

        }

    );

    image.addEventListener(

        "touchmove",

        handleTouchMove,

        {

            passive:true

        }

    );

    image.addEventListener(

        "touchend",

        handleTouchEnd,

        {

            passive:true

        }

    );

    function handleTouchStart(event) {

        touchStartX =

            event.changedTouches[0].clientX;

    }

    function handleTouchMove(event) {

        touchEndX =

            event.changedTouches[0].clientX;

    }

    function handleTouchEnd() {

        const distance =

            touchStartX - touchEndX;

        if (Math.abs(distance) < 60) {

            return;

        }

        if (distance > 0) {

            next();

        }

        else {

            previous();

        }

    }

    /* ======================================================
       DOUBLE CLICK
    ====================================================== */

    image.addEventListener(

        "dblclick",

        event => {

            event.preventDefault();

        }

    );

    /* ======================================================
       CONTEXT MENU
    ====================================================== */

    image.addEventListener(

        "contextmenu",

        event => {

            event.preventDefault();

        }

    );

     /* ======================================================
       BIND EVENTS
    ====================================================== */

    function bindEvents() {

        /* Buttons */

        prevButton.addEventListener(

            "click",

            previous

        );

        nextButton.addEventListener(

            "click",

            next

        );

        closeButton.addEventListener(

            "click",

            close

        );

        /* Prevent closing when clicking controls */

        [

            image,

            prevButton,

            nextButton,

            closeButton,

            download

        ].forEach(element => {

            element.addEventListener(

                "click",

                event => {

                    event.stopPropagation();

                }

            );

        });

    }

    /* ======================================================
       IMAGE LOADED
    ====================================================== */

    image.addEventListener(

        "load",

        () => {

            image.classList.add(

                "loaded"

            );

        }

    );

    image.addEventListener(

        "error",

        () => {

            console.warn(

                "Unable to load image."

            );

        }

    );

    /* ======================================================
       WINDOW RESIZE
    ====================================================== */

    window.addEventListener(

        "resize",

        () => {

            if (

                !lightbox.classList.contains(

                    "show"

                )

            ) {

                return;

            }

            counter.textContent =

                `${currentIndex + 1} / ${gallery.length}`;

        }

    );

    /* ======================================================
       VISIBILITY CHANGE
    ====================================================== */

    document.addEventListener(

        "visibilitychange",

        () => {

            if (

                document.hidden

            ) {

                return;

            }

            preload(

                currentIndex

            );

        }

    );

    /* ======================================================
       PUBLIC API
    ====================================================== */

    window.refreshLightbox =

        refreshGallery;

    window.openLightbox =

        open;

    window.closeLightbox =

        close;

    window.nextLightbox =

        next;

    window.previousLightbox =

        previous;

})();

/* ==========================================================
   AUTO INITIALIZE
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        if (

            typeof initializeLightbox ===

            "function"

        ) {

            initializeLightbox();

        }

    }

);

/* ==========================================================
   END OF FILE
========================================================== */
