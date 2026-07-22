document.addEventListener(
    "DOMContentLoaded",
    () => {

        const lightbox =
            document.getElementById(
                "lightbox"
            );

        const image =
            document.getElementById(
                "lightbox-image"
            );

        if (!lightbox || !image)
            return;

        const closeBtn =
            document.querySelector(
                ".lightbox-close"
            );

        const prevBtn =
            document.querySelector(
                ".lightbox-prev"
            );

        const nextBtn =
            document.querySelector(
                ".lightbox-next"
            );

        const counter =
            document.getElementById(
                "lightbox-counter"
            );

        const caption =
            document.getElementById(
                "lightbox-caption"
            );

        const download =
            document.getElementById(
                "lightbox-download"
            );

        /* ======================================================
           NEW: HÀM TẢI FILE NHỊ PHÂN VÀ TỰ ĐỘNG ĐỔI TÊN THEO SỐ ẢNH
        ====================================================== */
        async function downloadFileBlob(url, customName) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Mất kết nối mạng");
                
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                
                // Tự động lấy đuôi định dạng ảnh gốc (.jpg, .png...) từ link nguồn
                const extension = url.substring(url.lastIndexOf('.')) || '.jpg';
                
                const tempLink = document.createElement("a");
                tempLink.href = blobUrl;
                
                // Đổi tên file tải về chính xác dạng: "Special Day 2026 - 003.jpg"
                tempLink.download = `${customName}${extension}`;
                
                document.body.appendChild(tempLink);
                tempLink.click();
                
                document.body.removeChild(tempLink);
                URL.revokeObjectURL(blobUrl);
            } catch (error) {
                console.error("Lỗi tải ảnh, mở link gốc dự phòng:", error);
                window.open(url, "_blank");
            }
        }

        /* ============================
           DOWNLOAD BUBBLES
        ============================ */

        if (download) {

            download.innerHTML =
                `
                <span class="moon">☾</span>
                <span>Download Original</span>
                `;

            for (
                let i = 0;
                i < 6;
                i++
            ) {

                const bubble =
                    document.createElement(
                        "span"
                    );

                bubble.className =
                    "bubble";

                download.appendChild(
                    bubble
                );

            }
        } // Đã thêm dấu đóng ngoặc để kết thúc khối lệnh xử lý bubbles an toàn

           /* ======================================================
           ADVANCED BLOB DOWNLOAD (Đã sửa đổi tên file theo yêu cầu)
        ====================================================== */
        if (download) {
            download.addEventListener("click", async (e) => {
                e.preventDefault(); // Ngăn trình duyệt mở liên kết sang tab mới
                
                const src = image.src;
                if (!src) return;

                // Tìm span chứa text để thay đổi trạng thái
                const textSpan = download.querySelector("span:not(.moon)");
                const originalText = textSpan ? textSpan.textContent : "Download Original";
                if (textSpan) textSpan.textContent = "Downloading...";
                download.style.pointerEvents = "none";

                try {
                    // Trích xuất số thứ tự ảnh hiện tại (Ví dụ từ src hoặc từ caption)
                    let photoNumber = String(current + 1).padStart(3, '0');
                    if (image.alt) {
                        const matchNumber = image.alt.match(/\d+/);
                        if (matchNumber) photoNumber = String(matchNumber[0]).padStart(3, '0');
                    }

                    // Thực thi hàm tải file blob đã khai báo ở Part 1 với tên tùy chỉnh chính xác
                    await downloadFileBlob(src, `Special Day 2026 - ${photoNumber}`);
                } catch (error) {
                    console.error("Download failed, opening origin link instead:", error);
                    window.open(src, "_blank");
                } finally {
                    if (textSpan) textSpan.textContent = originalText;
                    download.style.pointerEvents = "auto";
                }
            });
        }

        let gallery = [];
        let current = 0;
        let zoom = 1;
        let touchStart = 0;

        function collect() {
            gallery = [
                ...document.querySelectorAll(
                    ".lightbox-trigger"
                )
            ];
        }

        window.refreshLightbox = collect;

        function getSrc(item) {
            return (
                item.getAttribute(
                    "href"
                ) ||
                item.dataset.src ||
                ""
            );
        }

        function getImg(item) {
            return (
                item.querySelector(
                    "img"
                )
            );
        }

        function resetZoom() {
            zoom = 1;
            image.style.transform = "scale(1)";
        }

        function preload(index) {
            if (index < 0 || index >= gallery.length) return;
            const img = new Image();
            img.src = getSrc(gallery[index]);
        }

        function preloadNearby() {
            preload(current - 1);
            preload(current + 1);
        }

        function updateUI() {
            const item = gallery[current];
            if (!item) return;

            const img = getImg(item);
            const src = getSrc(item);

            if (counter) {
                counter.textContent = `${current + 1} / ${gallery.length}`;
            }

            /* ----------------==================================
               ĐÃ SỬA: TỰ ĐỘNG ĐỔI TIÊU ĐỀ THEO CHUẨN ĐỊNH DẠNG MỚI
            -------------------------------------------------- */
            if (caption) {
                // Tự động tìm số thứ tự ảnh dựa trên thuộc tính alt (Ví dụ: "003")
                let photoNumber = String(current + 1).padStart(3, '0');
                const altText = img?.alt || "";
                const matchNumber = altText.match(/\d+/);
                
                if (matchNumber) {
                    photoNumber = String(matchNumber[0]).padStart(3, '0');
                }
                
                // Gán lại chuỗi tiêu đề theo yêu cầu của bạn
                caption.textContent = `Yoko @ Special Day 2026 - Photo ${photoNumber}`;
            }

            if (download) {
                download.href = src;
            }
        }

        function show(index) {
            const item = gallery[index];
            if (!item) return;

            const src = getSrc(item);
            const img = getImg(item);

            image.classList.add("loading");

            const loader = new Image();
            loader.onload = () => {
                image.src = src;
                image.alt = img?.alt || "";
                current = index;

                updateUI();
                preloadNearby();
                resetZoom();

                requestAnimationFrame(() => {
                    image.classList.remove("loading");
                });
            };
            loader.src = src;
        }

        function open(index) {
            collect();
            if (!gallery.length) return;

            lightbox.classList.add("show");
            document.body.classList.add("lightbox-open");
            show(index);
        }

        function close() {
            lightbox.classList.remove("show");
            document.body.classList.remove("lightbox-open");
            resetZoom();
        }

        function next() {
            current++;
            if (current >= gallery.length) {
                current = 0;
            }
            show(current);
        }

        function prev() {
            current--;
            if (current < 0) {
                current = gallery.length - 1;
            }
            show(current);
        }

        /* ======================================================
           PART 3: KHÔI PHỤC TOÀN BỘ SỰ KIỆN ĐÓNG/MỞ & VUỐT MÀN HÌNH MỚI
        ====================================================== */

        // Lắng nghe click mở Lightbox
        document.addEventListener("click", e => {
            const trigger = e.target.closest(".lightbox-trigger");
            if (!trigger) return;

            e.preventDefault();
            collect();

            const index = gallery.indexOf(trigger);
            if (index >= 0) {
                open(index);
            }
        });

        closeBtn?.addEventListener("click", close);
        nextBtn?.addEventListener("click", next);
        prevBtn?.addEventListener("click", prev);

        // Click vùng tối che khuất để đóng Lightbox
        lightbox.addEventListener("click", e => {
            if (e.target === lightbox || e.target.classList.contains("lightbox-stage")) {
                close();
            }
        });

        // Điều khiển bằng phím mũi tên bàn phím máy tính
        document.addEventListener("keydown", e => {
            if (!lightbox.classList.contains("show")) return;

            switch (e.key) {
                case "Escape":
                    close();
                    break;
                case "ArrowRight":
                    next();
                    break;
                case "ArrowLeft":
                    prev();
                    break;
            }
        });

        // Thao tác vuốt chuyển ảnh mượt mà trên Điện thoại
        lightbox.addEventListener("touchstart", e => {
            touchStart = e.changedTouches[0].screenX;
        });

        lightbox.addEventListener("touchend", e => {
            const touchEnd = e.changedTouches[0].screenX;
            const distance = touchEnd - touchStart;

            if (distance > 50) {
                prev(); // Vuốt sang phải: Quay lại hình cũ
            } else if (distance < -50) {
                next(); // Vuốt sang trái: Xem hình tiếp theo
            }
        });
    }
);
