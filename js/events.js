document.addEventListener(
    "DOMContentLoaded",
    async () => {

    const list =
        document.getElementById(
            "events-list"
        );

    const latest =
        document.getElementById(
            "latest-event-card"
        );

    const monthFilter =
        document.getElementById(
            "month-filter"
        );

    const sortSelect =
        document.getElementById(
            "sort-select"
        );

    try {

        const res =
            await fetch(
                "../data/gallery.json"
            );

        const events =
            await res.json();

        /*
        stats
        */

        document.getElementById(
            "total-events"
        ).textContent =
            events.length;

        const totalPhotos =
            events.reduce(
                (sum, e) =>
                    sum + e.photos,
                0
            );

        document.getElementById(
            "total-photos"
        ).textContent =
            totalPhotos.toLocaleString()
            + "+";

        /*
        latest card
        */

        const latestEvent =
            events[0];

        latest.innerHTML = `

        <div class="latest-card">

            <div class="event-thumb">

                <img
                    src="../assets/events/${latestEvent.folder}/${latestEvent.cover}.${latestEvent.format}"
                    alt="${latestEvent.title}">

            </div>

            <div>

                <div class="latest-badge">
                    ⭐ LATEST EVENT
                </div>

                <h2>
                    ${latestEvent.title}
                </h2>

                <p class="event-date">
                    📅 ${latestEvent.date}
                </p>

                <p>
                    ${latestEvent.photos}
                    photos archived.
                </p>

                <a
                    class="event-photos"
                    href="detail.html?id=${latestEvent.id}">

                    View Gallery →

                </a>

            </div>

        </div>
        `;

        /*
        months
        */

        const months =
            [
                "All",
                ...new Set(
                    events.map(e =>
                        e.date.split(" ")[1]
                    )
                )
            ];

        months.forEach(month => {

            const btn =
                document.createElement(
                    "button"
                );

            btn.textContent =
                month;

            if (
                month === "All"
            ) {

                btn.classList.add(
                    "active"
                );

            }

            btn.onclick = () => {

                document
                    .querySelectorAll(
                        "#month-filter button"
                    )
                    .forEach(
                        b =>
                            b.classList.remove(
                                "active"
                            )
                    );

                btn.classList.add(
                    "active"
                );

                render(month);

            };

            monthFilter.appendChild(
                btn
            );

        });

        /*
        render
        */

        function render(
            month = "All"
        ) {

            let filtered =
                [...events];

            if (
                month !== "All"
            ) {

                filtered =
                    filtered.filter(
                        e =>
                            e.date.includes(
                                month
                            )
                    );

            }

            if (
                sortSelect.value
                === "oldest"
            ) {

                filtered.reverse();

            }

            list.innerHTML = "";

            filtered.forEach(
                event => {

                const parts =
                    event.date.split(
                        " "
                    );

                const day =
                    parts[0];

                const month =
                    parts[1].slice(
                        0,
                        3
                    );

                const year =
                    parts[2];

                const card =
                    document.createElement(
                        "a"
                    );

                card.className =
                    "event-card";

                card.href =
                    `detail.html?id=${event.id}`;

                card.innerHTML =
                `
                <div class="event-thumb">

                    <div class="event-date-badge">

                        <strong>
                            ${day}
                        </strong>

                        <span>
                            ${month}
                        </span>

                        <small>
                            ${year}
                        </small>

                    </div>

                    <img
                        src="../assets/events/${event.folder}/${event.cover}.${event.format}"
                        alt="${event.title}">

                </div>

                <div class="event-info">

                    <h2>
                        ${event.title}
                    </h2>

                    <p class="event-date">

                        📅 ${event.date}

                    </p>

                    <span
                        class="event-photos">

                        📷
                        ${event.photos}
                        Photos

                    </span>

                </div>
                `;

                list.appendChild(
                    card
                );

            });

        }

        sortSelect.addEventListener(
            "change",
            () => {

                const active =
                    document.querySelector(
                        "#month-filter .active"
                    );

                render(
                    active.textContent
                );

            }
        );

        render();

    }

    catch(error){

        console.error(error);

    }

});
