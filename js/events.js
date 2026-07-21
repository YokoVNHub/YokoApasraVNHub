/* ======================================================
   ELEMENTS
====================================================== */

const eventsList = document.getElementById("events-list");
const latestCard = document.getElementById("latest-event-card");
const monthFilter = document.getElementById("month-filter");
const totalEvents = document.getElementById("total-events");
const totalPhotos = document.getElementById("total-photos");
const sortSelect = document.getElementById("sort-select");
const gridBtn = document.getElementById("grid-view");
const listBtn = document.getElementById("list-view");

/* ======================================================
   STATE
====================================================== */

let events = [];
let currentMonth = "all";

/* ======================================================
   LOAD
====================================================== */

async function loadEvents() {
    try {
        const response = await fetch("../data/gallery.json");

        if (!response.ok) {
            throw new Error("Cannot load gallery.json");
        }

        events = await response.json();

        events.sort(
            (a, b) => parseDate(b.date) - parseDate(a.date)
        );

        updateStats();
        renderLatest();
        createFilters();
        renderEvents();
        setupToggleView(); // Kích hoạt bộ lắng nghe đổi layout Grid/List nếu cần
    } catch (error) {
        console.error(error);
        eventsList.innerHTML = `
            <div class="empty">
                Failed to load events.
            </div>
        `;
    }
}

loadEvents();

/* ======================================================
   DATE PARSER
====================================================== */

function parseDate(dateString) {
    return new Date(
        dateString.replace(
            /(\d+) (\w+) (\d+)/,
            "$2 $1, $3"
        )
    );
}

/* ======================================================
   COUNTER ANIMATION
====================================================== */

function animateNumber(element, target) {
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current.toLocaleString();
    }, 20);
}

/* ======================================================
   STATS UPDATE
====================================================== */

function updateStats() {
    const photos = events.reduce((sum, item) => sum + item.photos, 0);
    animateNumber(totalEvents, events.length);
    animateNumber(totalPhotos, photos);
}

/* ======================================================
   LATEST EVENT CARD (Nút bấm đồng bộ màu Hồng - Xanh và Mặt Trăng)
====================================================== */

function renderLatest() {
    if (!latestCard || !events.length) return;

    const item = events[0];

    latestCard.innerHTML = `
        <article class="latest-card glass-card">
            <div class="latest-image">
                <img
                    src="../assets/events/${item.folder}/${item.cover}.${item.format}"
                    alt="${item.title}">
            </div>

            <div class="latest-content">
                <span class="badge">
                    ✦ LATEST EVENT
                </span>

                <h2>
                    ${item.title}
                </h2>

                <p class="latest-meta">
                    📅 ${item.date}
                </p>

                <p class="latest-meta">
                    📷 ${item.photos} photos archived
                </p>

                <!-- Sửa lại class btn-secondary cố định dải màu mượt kẹo ngọt -->
                <a href="detail.html?id=${item.id}" class="btn-secondary latest-btn">
                    <span>View Gallery &nbsp; →</span>
                    <div class="icon-circle">
                        ☾
                    </div>
                </a>
            </div>
        </article>
    `;
}

/* ======================================================
   MONTH FILTER CAPTURE
====================================================== */

function createFilters() {
    if (!monthFilter) return;

    const months = [
        "all",
        ...new Set(
            events.map(item =>
                parseDate(item.date).toLocaleString("en-US", { month: "long" })
            )
        )
    ];

    monthFilter.innerHTML = months.map(month => `
        <button
            data-month="${month}"
            class="${month === "all" ? "active" : ""}">
            ${month === "all" ? "All" : month}
        </button>
    `).join("");

    monthFilter.querySelectorAll("button").forEach(button => {
        button.onclick = () => {
            monthFilter.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            currentMonth = button.dataset.month;
            renderEvents();
        };
    });
}

/* ======================================================
   EVENTS RENDER GRID (Tích hợp Bubbles 3D tự động)
====================================================== */

function renderEvents() {
    if (!eventsList) return;

    let filtered = [...events];

    // Xử lý bộ lọc theo tháng
    if (currentMonth !== "all") {
        filtered = filtered.filter(item => {
            const month = parseDate(item.date).toLocaleString("en-US", { month: "long" });
            return month === currentMonth;
        });
    }

    // Xử lý sắp xếp Newest / Oldest First
    if (sortSelect && sortSelect.value === "oldest") {
        filtered.sort((a, b) => parseDate(a.date) - parseDate(b.date));
    } else {
        filtered.sort((a, b) => parseDate(b.date) - parseDate(a.date));
    }

    if (filtered.length === 0) {
        eventsList.innerHTML = `<div class="empty">No events found in this month.</div>`;
        return;
    }

    // Tiến hành gán chuỗi render chi tiết từng tấm card
    eventsList.innerHTML = filtered.map(item => {
        const date = parseDate(item.date);
        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();

        return `
            <a href="detail.html?id=${item.id}" class="event-card">
                <div class="event-thumb">
                    <img 
                        src="../assets/events/${item.folder}/${item.cover}.${item.format}" 
                        alt="${item.title}"
                        loading="lazy"
                    >
                    
                    <!-- LAYER ĐẶT BONG BÓNG ĐỘNG LƠ LỬNG 3D -->
                    <div class="bubble b1"></div>
                    <div class="bubble b2"></div>
                    <div class="bubble b3"></div>

                    <!-- KHỐI LỊCH CHỐNG LÓA AN TOÀN -->
                    <div class="event-date-badge">
                        strong>${day}</strong>
                        <span>${month.toUpperCase()}</span>
                        <small>${year}</small>
                    </div>
                </div>

                <div class="event-info">
                    <h2>${item.title}</h2>
                    <div class="event-meta">
                        <p class="event-date">
                            📅 ${item.date}
                        </p>
                        <!-- NÚT ĐẾM ẢNH MINI CHUYỂN SẮC HOVER -->
                        <span class="event-photos">
                            📷 ${item.photos} photos &nbsp; →
                        </span>
                    </div>
                </div>
            </a>
        `;
    }).join("");
}

/* ======================================================
   SORT SELECT WATCHER (Bắt sự kiện Newest First đổi danh sách)
====================================================== */
if (sortSelect) {
    sortSelect.onchange = () => {
        renderEvents();
    };
}

/* ======================================================
   VIEW TOGGLE (Xử lý chuyển đổi Grid / List View)
====================================================== */
function setupToggleView() {
    if (!gridBtn || !listBtn) return;

    gridBtn.onclick = () => {
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
        eventsList.classList.remove("events-list-view");
        eventsList.classList.add("events-grid");
    };

    listBtn.onclick = () => {
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
        eventsList.classList.remove("events-grid");
        eventsList.classList.add("events-list-view");
    };
}
