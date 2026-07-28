/* ======================================================
   EXCLUSIVE DETAIL
   Yoko Apasra VNHub
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /* ======================================================
           ELEMENTS
        ====================================================== */

        const titleElement =
            document.getElementById(
                "event-title"
            );

        const subtitleElement =
            document.getElementById(
                "event-subtitle"
            );

        const metaElement =
            document.getElementById(
                "event-meta"
            );

        const galleryElement =
            document.getElementById(
                "gallery"
            );

        const downloadButton =
            document.getElementById(
                "download-album"
            );

        if (

            !titleElement ||

            !subtitleElement ||

            !metaElement ||

            !galleryElement ||

            !downloadButton

        ){

            console.error(
                "Exclusive Detail elements not found."
            );

            return;

        }


        /* ======================================================
           GET ALBUM ID
        ====================================================== */

        const params =
            new URLSearchParams(
                window.location.search
            );

        const albumId =
            params.get("id");

        if(!albumId){

            titleElement.textContent =
                "Album not found";

            metaElement.innerHTML =
                "<span>Missing album ID.</span>";

            return;

        }


        /* ======================================================
           LOAD JSON
        ====================================================== */

        let albums = [];

        let downloadData = {};

        try{

            const [

                albumResponse,

                downloadResponse

            ] = await Promise.all([

                fetch(
                    "../data/exclusive.json"
                ),

                fetch(
                    "../data/download.json"
                )

            ]);

            if(!albumResponse.ok){

                throw new Error(
                    "exclusive.json not found."
                );

            }

            albums =
                await albumResponse.json();

            if(downloadResponse.ok){

                downloadData =
                    await downloadResponse.json();

            }

        }

        catch(error){

            console.error(error);

            titleElement.textContent =
                "Loading failed";

            metaElement.innerHTML =
                "<span>Unable to load gallery.</span>";

            return;

        }


        /* ======================================================
           FIND ALBUM
        ====================================================== */

        const album =

            albums.find(

                item =>

                    item.id === albumId

            );

        if(!album){

            titleElement.textContent =
                "Album not found";

            metaElement.innerHTML =
                "<span>This album does not exist.</span>";

            return;

        }


        /* ======================================================
           ALBUM DATA
        ====================================================== */

        const {

            title,

            subtitle,

            date,

            location,

            folder,

            photos,

            format = "jpg"

        } = album;


        const downloadLink =

            downloadData.exclusive?.[
                albumId
            ] || "";


        document.title =

            `${title} | Yoko Apasra VNHub`;

           /* ======================================================
           RENDER HEADER
        ====================================================== */

        titleElement.textContent =
            title;

        subtitleElement.textContent =
            subtitle || "";

        metaElement.innerHTML =

`
<div class="meta-item">

    <span class="meta-icon">
        📅
    </span>

    <div>

        <strong>
            Date
        </strong>

        <p>
            ${date}
        </p>

    </div>

</div>


<div class="meta-item">

    <span class="meta-icon">
        📍
    </span>

    <div>

        <strong>
            Location
        </strong>

        <p>
            ${location}
        </p>

    </div>

</div>


<div class="meta-item">

    <span class="meta-icon">
        📷
    </span>

    <div>

        <strong>
            Collection
        </strong>

        <p>
            ${photos.toLocaleString()} Photos
        </p>

    </div>

</div>

`;


        /* ======================================================
           DOWNLOAD BUTTON
        ====================================================== */

        if(downloadLink){

            downloadButton.href =
                downloadLink;

            downloadButton.target =
                "_blank";

            downloadButton.rel =
                "noopener noreferrer";

            downloadButton.style.display =
                "inline-flex";

        }

        else{

            downloadButton.style.display =
                "none";

        }


        /* ======================================================
           CLEAR GALLERY
        ====================================================== */

        galleryElement.innerHTML = "";


        /* ======================================================
           EMPTY GALLERY
        ====================================================== */

        if(photos <= 0){

            galleryElement.innerHTML =

`
<div class="empty">

    <h3>

        📸 Gallery Coming Soon

    </h3>

    <p>

        Photos from this collection
        will be uploaded soon.

    </p>

    <small>

        Please come back later 🤍

    </small>

</div>
`;

        }

        else{

            /* ======================================================
               RENDER GALLERY
            ====================================================== */

            for(

                let i = 1;

                i <= photos;

                i++

            ){

                const fileNumber =

                    String(i).padStart(
                        3,
                        "0"
                    );

                const imagePath =

                    `../assets/exclusive/${folder}/${fileNumber}.${format}`;


                const link =

                    document.createElement("a");

                link.href =
                    imagePath;

                link.className =
                    "lightbox-trigger";

                link.dataset.filename =

                    `yoko-${folder}-${fileNumber}.${format}`;


                const image =

                    document.createElement("img");

                image.src =
                    imagePath;

                image.alt =

                    `${title} ${fileNumber}`;

                image.loading =
                    "lazy";

                image.decoding =
                    "async";

                image.draggable =
                    false;

                image.onerror = () => {

                    console.warn(

                        `Missing image: ${imagePath}`

                    );

                    link.remove();

                };

                link.appendChild(
                    image
                );

                galleryElement.appendChild(
                    link
                );

            }

        }


        /* ======================================================
           REFRESH LIGHTBOX
        ====================================================== */

        if(

            typeof window.refreshLightbox ===
            "function"

        ){

            window.refreshLightbox();

        }


        /* ======================================================
           UPDATE PHOTO COUNT
        ====================================================== */

        const loadedPhotos =

            galleryElement.querySelectorAll(
                ".lightbox-trigger"
            ).length;

        const photoText =

            metaElement.querySelectorAll("p");

        if(photoText.length >= 3){

            photoText[2].textContent =

                `${loadedPhotos.toLocaleString()} Photos`;

        }


        /* ======================================================
           DEBUG
        ====================================================== */

        console.groupCollapsed(

            "Exclusive Detail"

        );

        console.log(

            "Album:",
            title

        );

        console.log(

            "Folder:",
            folder

        );

        console.log(

            "Photos:",
            loadedPhotos

        );

        console.log(

            "Download:",

            downloadLink
                ? "Available"
                : "Unavailable"

        );

        console.groupEnd();

    }

);
