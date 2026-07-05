document.addEventListener("DOMContentLoaded", () => {
    
    const gallery=document.getElementById("gallery");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const closeButton = document.querySelector(".lightbox-close");
    
    const prev=document.querySelector(".lb-prev");

const next=document.querySelector(".lb-next");

const close=document.querySelector(".lb-close");

const counter=document.getElementById("lb-counter");
    
    let images=[];

let current=0;
    
}
                          
function refreshImages(){

    images=[...gallery.querySelectorAll(".gallery-img")];

    const images = document.querySelectorAll(".lightbox-trigger");
}

    images.forEach(image => {

        image.addEventListener("click", (event) => {

            event.preventDefault();

            lightboxImage.src = image.src;
            lightboxCaption.textContent = image.alt;

            lightbox.classList.add("show");

            document.body.style.overflow = "hidden";

        });

    });

    function open(index){

    refreshImages();

    current=index;

    update();

    lightbox.classList.add("active");

    document.body.style.overflow="hidden";

}

    function update(){

    lightboxImg.src=images[current].src;

    counter.textContent=`${current+1} / ${images.length}`;

}

    function closeLightbox(){

        lightbox.classList.remove("show");

        document.body.style.overflow = "";

    }

    function nextImg(){

    current++;

    if(current>=images.length){

        current=0;

    }

    update();

}

function prevImg(){

    current--;

    if(current<0){

        current=images.length-1;

    }

    update();

}

gallery.addEventListener("click",(e)=>{

    if(!e.target.classList.contains("gallery-img")) return;

    refreshImages();

    open(images.indexOf(e.target));

});

next.onclick=nextImg;

prev.onclick=prevImg;

close.onclick=closeBox;

lightbox.onclick=(e)=>{

    if(e.target===lightbox){

        closeBox();

    }

};

    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event)=>{

        if(event.target === lightbox){

            closeLightbox();

        }

    });

    document.addEventListener("keydown",(event)=>{

        if(event.key==="Escape"){

            closeLightbox();
            
             if(!lightbox.classList.contains("active")) return;

    if(e.key==="Escape") closeBox();

    if(e.key==="ArrowRight") nextImg();

    if(e.key==="ArrowLeft") prevImg();

        }

    });

});
