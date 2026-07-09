/*==================================================
    YokoApasraVNHub
    Lightbox V2
    CEO Fried Egg Edition 🍳
    Part 1 / 4
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*==================================
    =            Elements             =
    ==================================*/

    const dom = {

        lightbox: document.getElementById("lightbox"),

        image: document.getElementById("lightbox-image"),

        caption: document.getElementById("lightbox-caption"),

        counter: document.getElementById("lightbox-counter"),

        download: document.getElementById("lightbox-download"),

        close: document.querySelector(".lightbox-close"),

        prev: document.querySelector(".lightbox-prev"),

        next: document.querySelector(".lightbox-next"),

        gallery: document.getElementById("gallery")

    };

    if (!dom.lightbox || !dom.gallery) return;

    /*==================================
    =         Gallery Images          =
    ==================================*/

    let images = [];

    let currentIndex = 0;

    let isAnimating = false;

    function collectImages() {

        images = [

            ...document.querySelectorAll(".lightbox-trigger")

        ];

    }

    collectImages();

    /*==================================
    =         Lock Scroll             =
    ==================================*/

    function lockScroll() {

        document.body.classList.add("lightbox-open");

    }

    function unlockScroll() {

        document.body.classList.remove("lightbox-open");

    }

    /*==================================
    =          Open Lightbox          =
    ==================================*/

    function openLightbox(index) {

        if (isAnimating) return;

        currentIndex = index;

        dom.lightbox.classList.add("show");

        lockScroll();

        showImage(currentIndex);

    }

    /*==================================
    =         Close Lightbox          =
    ==================================*/

    function closeLightbox() {

        if (isAnimating) return;

        dom.lightbox.classList.remove("show");

        unlockScroll();

    }

    /*==================================
    =      Temporary Show Image       =
    ==================================*/

    function showImage(index) {

        const img = images[index];

        if (!img) return;

        dom.image.src = img.src;

        dom.image.alt = img.alt;

    }

    /*==================================
    =       Click Gallery Image       =
    ==================================*/

    function bindGallery() {

        images.forEach((img, index) => {

            img.addEventListener("click", () => {

                openLightbox(index);

            });

        });

    }

    bindGallery();

    /*==================================
    =        Close Button             =
    ==================================*/

    dom.close.addEventListener(

        "click",

        closeLightbox

    );

    /*==================================
    =      Click Overlay Close        =
    ==================================*/

    dom.lightbox.addEventListener("click", (e) => {

        if (e.target === dom.lightbox) {

            closeLightbox();

        }

    });

});

    /*==================================
    =          Show Image             =
    ==================================*/

    function showImage(index) {

        if (isAnimating) return;

        isAnimating = true;

        const img = images[index];

        if (!img) {

            isAnimating = false;

            return;

        }

        dom.image.classList.remove(
            "loaded",
            "fade-in"
        );

        dom.image.classList.add(
            "loading",
            "fade-out"
        );

        const src = img.dataset.full || img.src;

        const loader = new Image();

        loader.src = src;

        loader.onload = () => {

            dom.image.src = src;

            dom.image.alt = img.alt;

            dom.image.classList.remove(
                "loading",
                "fade-out"
            );

            dom.image.classList.add(
                "loaded",
                "fade-in"
            );

            updateCounter();

            updateCaption();

            updateDownload();

            preloadAround();

            setTimeout(() => {

                isAnimating = false;

            }, 250);

        };

    }


    /*==================================
    =        Counter Update           =
    ==================================*/

    function updateCounter() {

        dom.counter.textContent =
            `${currentIndex + 1} / ${images.length}`;

    }


    /*==================================
    =        Caption Update           =
    ==================================*/

    function updateCaption() {

        const img = images[currentIndex];

        if (!img) return;

        dom.caption.textContent =
            img.alt || "";

    }


    /*==================================
    =       Download Update           =
    ==================================*/

    function updateDownload() {

        const img = images[currentIndex];

        if (!img) return;

        const src = img.dataset.full || img.src;

        dom.download.href = src;

        const filename = src.split("/").pop();

        dom.download.download = filename;

    }


    /*==================================
    =        Image Preload            =
    ==================================*/

    function preload(index) {

        if (
            index < 0 ||
            index >= images.length
        ) return;

        const preloadImg = new Image();

        preloadImg.src =
            images[index].dataset.full ||
            images[index].src;

    }


    function preloadAround() {

        preload(currentIndex - 1);

        preload(currentIndex + 1);

    }

    /*==================================
    =          Previous Image         =
    ==================================*/

    function showPrev() {

        if (isAnimating) return;

        currentIndex--;

        if (currentIndex < 0) {

            currentIndex = images.length - 1;

        }

        showImage(currentIndex);

    }


    /*==================================
    =            Next Image           =
    ==================================*/

    function showNext() {

        if (isAnimating) return;

        currentIndex++;

        if (currentIndex >= images.length) {

            currentIndex = 0;

        }

        showImage(currentIndex);

    }


    /*==================================
    =          Button Events          =
    ==================================*/

    dom.prev.addEventListener(

        "click",

        (e) => {

            e.stopPropagation();

            showPrev();

        }

    );


    dom.next.addEventListener(

        "click",

        (e) => {

            e.stopPropagation();

            showNext();

        }

    );


    /*==================================
    =         Keyboard Events         =
    ==================================*/

    document.addEventListener(

        "keydown",

        (e) => {

            if (

                !dom.lightbox.classList.contains("show")

            ) return;


            switch (e.key) {

                case "ArrowLeft":

                    showPrev();

                    break;


                case "ArrowRight":

                    showNext();

                    break;


                case "Escape":

                    closeLightbox();

                    break;

            }

        }

    );


    /*==================================
    =            Touch Swipe          =
    ==================================*/

    let touchStartX = 0;

    let touchEndX = 0;


    dom.image.addEventListener(

        "touchstart",

        (e) => {

            touchStartX =

                e.changedTouches[0].clientX;

        },

        {

            passive:true

        }

    );


    dom.image.addEventListener(

        "touchend",

        (e) => {

            touchEndX =

                e.changedTouches[0].clientX;

            const distance =

                touchEndX - touchStartX;


            if (Math.abs(distance) < 60) return;


            if (distance > 0) {

                showPrev();

            }

            else {

                showNext();

            }

        },

        {

            passive:true

        }

    );


    /*==================================
    =        Mouse Wheel Zoom         =
    ==================================*/

    dom.image.addEventListener(

        "wheel",

        (e) => {

            e.preventDefault();

        },

        {

            passive:false

        }

    );


    /*==================================
    =       Window Resize Reset       =
    ==================================*/

    window.addEventListener(

        "resize",

        () => {

            if (

                !dom.lightbox.classList.contains("show")

            ) return;

            dom.image.classList.remove(

                "fade-in",

                "fade-out"

            );

        }

    /*==================================
    =       CEO Fried Egg Cursor      =
    ==================================*/

    if (window.matchMedia("(hover:hover)").matches) {

        const egg = document.createElement("div");

        egg.className = "lb-egg";

        document.body.appendChild(egg);

        let mouseX = window.innerWidth / 2;

        let mouseY = window.innerHeight / 2;

        let eggX = mouseX;

        let eggY = mouseY;

        document.addEventListener("mousemove", (e) => {

            mouseX = e.clientX;

            mouseY = e.clientY;

        });

        function animateEgg() {

            eggX += (mouseX - eggX) * .18;

            eggY += (mouseY - eggY) * .18;

            egg.style.left = eggX + "px";

            egg.style.top = eggY + "px";

            requestAnimationFrame(animateEgg);

        }

        animateEgg();


        /*==================================
        =         Hover States            =
        ==================================*/

        function bindHover(element, className) {

            if (!element) return;

            element.addEventListener("mouseenter", () => {

                egg.classList.add(className);

            });

            element.addEventListener("mouseleave", () => {

                egg.classList.remove(className);

            });

        }

        bindHover(dom.prev, "prev-hover");

        bindHover(dom.next, "next-hover");

        bindHover(dom.close, "close-hover");

        bindHover(dom.download, "download-hover");


        /*==================================
        =          Bubble Trail           =
        ==================================*/

        function createBubble() {

            const bubble = document.createElement("div");

            bubble.className = "lb-bubble";

            bubble.style.left = eggX + "px";

            bubble.style.top = eggY + "px";

            const size = 6 + Math.random() * 8;

            bubble.style.width = size + "px";

            bubble.style.height = size + "px";

            document.body.appendChild(bubble);

            const angle = Math.random() * Math.PI * 2;

            const distance = 18 + Math.random() * 28;

            const dx = Math.cos(angle) * distance;

            const dy = Math.sin(angle) * distance;

            bubble.animate(

                [

                    {

                        transform:
                            "translate(0,0) scale(.5)",

                        opacity:.9

                    },

                    {

                        transform:
                            `translate(${dx}px,${dy}px) scale(1.4)`,

                        opacity:0

                    }

                ],

                {

                    duration:700,

                    easing:"ease-out"

                }

            );

            setTimeout(() => {

                bubble.remove();

            },700);

        }


        let bubbleTimer = null;

        dom.download.addEventListener("mouseenter", () => {

            bubbleTimer = setInterval(createBubble, 90);

        });

        dom.download.addEventListener("mouseleave", () => {

            clearInterval(bubbleTimer);

        });


        /*==================================
        =         Cleanup                =
        ==================================*/

        window.addEventListener("beforeunload", () => {

            clearInterval(bubbleTimer);

            egg.remove();

        });

    }
       
    );
