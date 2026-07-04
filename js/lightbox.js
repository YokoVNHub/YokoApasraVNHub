document.addEventListener("DOMContentLoaded", () => {

    const gallery = document.getElementById("gallery");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    if (!gallery || !lightbox || !lightboxImg) return;

    let images = [];
    let currentIndex = 0;

    function updateImages() {
        images = [...gallery.querySelectorAll(".gallery-img")];
    }

    function openLightbox(index) {

        updateImages();

        currentIndex = index;

        lightboxImg.src = images[currentIndex].src;

        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";

    }

    function closeLightbox() {

        lightbox.classList.remove("active");

        lightboxImg.src = "";

        document.body.style.overflow = "";

    }

    function nextImage() {

        currentIndex++;

        if(currentIndex >= images.length){

            currentIndex = 0;

        }

        lightboxImg.src = images[currentIndex].src;

    }

    function prevImage() {

        currentIndex--;

        if(currentIndex < 0){

            currentIndex = images.length - 1;

        }

        lightboxImg.src = images[currentIndex].src;

    }

    gallery.addEventListener("click",(e)=>{

        if(!e.target.classList.contains("gallery-img")) return;

        updateImages();

        const index = images.indexOf(e.target);

        openLightbox(index);

    });

    lightbox.addEventListener("click",(e)=>{

        if(e.target===lightbox){

            closeLightbox();

        }

    });

    document.addEventListener("keydown",(e)=>{

        if(!lightbox.classList.contains("active")) return;

        if(e.key==="Escape"){

            closeLightbox();

        }

        if(e.key==="ArrowRight"){

            nextImage();

        }

        if(e.key==="ArrowLeft"){

            prevImage();

        }

    });

});
