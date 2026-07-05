document.addEventListener("DOMContentLoaded", () => {

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeButton = document.querySelector(".lightbox-close");

    const images = document.querySelectorAll(".lightbox-trigger");

    images.forEach(image => {

        image.addEventListener("click", (event) => {

            event.preventDefault();

            lightboxImage.src = image.src;
            lightboxCaption.textContent = image.alt;

            lightbox.classList.add("show");

            document.body.style.overflow = "hidden";

        });

    });

    function closeLightbox(){

        lightbox.classList.remove("show");

        document.body.style.overflow = "";

    }

    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event)=>{

        if(event.target === lightbox){

            closeLightbox();

        }

    });

    document.addEventListener("keydown",(event)=>{

        if(event.key==="Escape"){

            closeLightbox();

        }

    });

});
