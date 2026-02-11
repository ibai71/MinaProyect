"use strict";

const memories = [
    {
        id: "madrid",
        city: "Madrid",
        status: "pending",
        lon: -3.7038,
        lat: 40.4168,
        pinImage: "assets/pins/madrid.png",
        memoryImage: null,
        date: null,
        phrase: "Recuerdo pendiente"
    },
    {
        id: "seoul",
        city: "Seoul",
        status: "active",
        lon: 126.978,
        lat: 37.5665,
        pinImage: "assets/pins/seoul.png",
        memoryImage: "assets/memories/seoul.png",
        date: "2023-10-15",
        phrase: "The city lights felt warmer because we were there together."
    },
    {
        id: "busan",
        city: "Busan",
        status: "active",
        lon: 129.0756,
        lat: 35.1796,
        pinImage: "assets/pins/busan.png",
        memoryImage: "assets/memories/busan.png",
        date: "2023-10-21",
        phrase: "Sea breeze, sunset, and us laughing with no rush."
    },
    {
        id: "tokio",
        city: "Tokio",
        status: "pending",
        lon: 139.6503,
        lat: 35.6762,
        pinImage: "assets/pins/tokio.png",
        memoryImage: null,
        date: null,
        phrase: "Recuerdo pendiente"
    },
    {
        id: "hong-kong",
        city: "Hong Kong",
        status: "pending",
        lon: 114.1694,
        lat: 22.3193,
        pinImage: "assets/pins/hong-kong.png",
        memoryImage: null,
        date: null,
        phrase: "Recuerdo pendiente"
    },
    {
        id: "hanoi",
        city: "Hanoi",
        status: "active",
        lon: 105.8342,
        lat: 21.0278,
        pinImage: "assets/pins/hanoi.png",
        memoryImage: "assets/memories/hanoi.png",
        date: "2024-01-08",
        phrase: "Small streets, warm food, and one unforgettable afternoon."
    },
    {
        id: "da-nang",
        city: "Da Nang",
        status: "active",
        lon: 108.2022,
        lat: 16.0544,
        pinImage: "assets/pins/da-nang.png",
        memoryImage: "assets/memories/da-nang.png",
        date: "2024-01-11",
        phrase: "The beach, the sky, and your smile made everything calm."
    },
    {
        id: "saigon",
        city: "Saigon",
        status: "active",
        lon: 106.6297,
        lat: 10.8231,
        pinImage: "assets/pins/saigon.png",
        memoryImage: "assets/memories/saigon.png",
        date: "2024-01-14",
        phrase: "A busy city outside, and peace whenever I looked at you."
    },
    {
        id: "bangkok",
        city: "Bangkok",
        status: "active",
        lon: 100.5018,
        lat: 13.7563,
        pinImage: "assets/pins/bangkok.png",
        memoryImage: "assets/memories/bangkok.png",
        date: "2024-02-03",
        phrase: "Neon nights and one more reason to keep traveling together."
    },
    {
        id: "kuala-lumpur",
        city: "Kuala Lumpur",
        status: "active",
        lon: 101.6869,
        lat: 3.139,
        pinImage: "assets/pins/kuala-lumpur.png",
        memoryImage: "assets/memories/kuala-lumpur.png",
        date: "2024-02-09",
        phrase: "New places always feel familiar when I am with you."
    }
];

const mapPins = document.getElementById("mapPins");
const memoryModal = document.getElementById("memoryModal");
const memoryModalDialog = document.getElementById("memoryModalDialog");
const memoryModalClose = document.getElementById("memoryModalClose");
const memoryModalBadge = document.getElementById("memoryModalBadge");
const memoryModalTitle = document.getElementById("memoryModalTitle");
const memoryModalDate = document.getElementById("memoryModalDate");
const memoryModalText = document.getElementById("memoryModalText");
const memoryModalImage = document.getElementById("memoryModalImage");
const memoryModalImageFallback = document.getElementById("memoryModalImageFallback");
const mapCanvas = document.getElementById("mapCanvas");

const MAP_BOUNDS = {
    left: 0,
    right: 100,
    top: 0,
    bottom: 100
};

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function projectLonLatToPercent(lon, lat) {
    const normalizedX = (lon + 180) / 360;
    const normalizedY = (90 - lat) / 180;
    const x = MAP_BOUNDS.left + normalizedX * (MAP_BOUNDS.right - MAP_BOUNDS.left);
    const y = MAP_BOUNDS.top + normalizedY * (MAP_BOUNDS.bottom - MAP_BOUNDS.top);
    return {
        x: clamp(x, MAP_BOUNDS.left, MAP_BOUNDS.right),
        y: clamp(y, MAP_BOUNDS.top, MAP_BOUNDS.bottom)
    };
}

function renderPins() {
    if (!mapPins) {
        return;
    }

    const fragment = document.createDocumentFragment();

    memories.forEach(memory => {
        const pin = document.createElement("button");
        pin.type = "button";
        pin.className = memory.status === "pending" ? "pin pin--pending" : "pin";
        const projected = projectLonLatToPercent(memory.lon, memory.lat);
        pin.style.setProperty("--x", String(projected.x));
        pin.style.setProperty("--y", String(projected.y));
        pin.setAttribute("aria-label", memory.city);
        pin.dataset.memoryId = memory.id;

        const pinPhoto = document.createElement("img");
        pinPhoto.className = "pin-photo";
        pinPhoto.src = memory.pinImage;
        pinPhoto.alt = `${memory.city} pin`;

        const fallback = document.createElement("span");
        fallback.className = "pin-fallback is-hidden";
        fallback.textContent = memory.city.slice(0, 3).toUpperCase();

        pinPhoto.addEventListener("error", () => {
            pinPhoto.classList.add("is-hidden");
            fallback.classList.remove("is-hidden");
        });

        pin.append(pinPhoto, fallback);
        pin.addEventListener("click", () => openMemory(memory.id));
        fragment.append(pin);
    });

    mapPins.append(fragment);
}

function openMemory(memoryId) {
    const memory = memories.find(item => item.id === memoryId);
    if (!memory || !memoryModal) {
        return;
    }

    memoryModalTitle.textContent = memory.city;
    memoryModalText.textContent = memory.phrase || "Recuerdo pendiente";

    if (memory.status === "pending") {
        memoryModalBadge.classList.remove("is-hidden");
        memoryModalDate.classList.add("is-hidden");
        memoryModalImage.classList.add("is-hidden");
        memoryModalImageFallback.classList.remove("is-hidden");
        memoryModalImageFallback.textContent = "Recuerdo pendiente";
    } else {
        memoryModalBadge.classList.add("is-hidden");
        memoryModalDate.classList.remove("is-hidden");
        memoryModalDate.textContent = memory.date || "";
        memoryModalImage.classList.remove("is-hidden");
        memoryModalImageFallback.classList.add("is-hidden");
        memoryModalImage.src = memory.memoryImage || "";
    }

    memoryModal.classList.remove("is-hidden");
    memoryModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeModal() {
    if (!memoryModal) {
        return;
    }
    memoryModal.classList.add("is-hidden");
    memoryModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

function bindModalEvents() {
    if (memoryModalImage) {
        memoryModalImage.addEventListener("error", () => {
            memoryModalImage.classList.add("is-hidden");
            memoryModalImageFallback.classList.remove("is-hidden");
            memoryModalImageFallback.textContent = "Imagen no disponible";
        });
    }

    if (memoryModalClose) {
        memoryModalClose.addEventListener("click", closeModal);
    }

    if (memoryModal) {
        memoryModal.addEventListener("click", event => {
            if (event.target === memoryModal) {
                closeModal();
            }
        });
    }

    if (memoryModalDialog) {
        memoryModalDialog.addEventListener("click", event => {
            event.stopPropagation();
        });
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && memoryModal && !memoryModal.classList.contains("is-hidden")) {
            closeModal();
        }
    });

    if (mapCanvas) {
        mapCanvas.addEventListener("click", event => {
            if (!event.altKey) {
                return;
            }
            const rect = mapCanvas.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            console.log("map-percent", { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
        });
    }
}

renderPins();
bindModalEvents();
