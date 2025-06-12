import { fetchCurrentUser, getCurrentUser } from "./auth.js";
import { setupSidebar, setupTabs, setupUserProfile } from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {
    await fetchCurrentUser();
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    setupSidebar();
    setupTabs(renderPhotos);
    setupUserProfile();

    setupUploadForm();
    setupPreviewImage();
    renderPhotos();
});

function setupUploadForm() {
    document.getElementById("uploadForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const currentUser = getCurrentUser();
        const address = document.getElementById("uploadAddress").value;
        const access = document.getElementById("uploadAccess").value;
        const caption = document.getElementById("uploadCaption").value;

        try {
            const res = await fetch("http://localhost:3001/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    username: currentUser.username,
                    address,
                    access,
                    caption
                })
            });

            const data = await res.json();
            if (data.success) {
                console.log("Uploaded:", address);
                renderPhotos();
            } else {
                console.error("Upload failed:", data.message);
            }
        } catch (err) {
            console.error("Error uploading:", err);
        }
    });
}

function setupPreviewImage() {
    const addressInput = document.getElementById("uploadAddress");
    const previewImage = document.getElementById("imagePreview");

    addressInput.addEventListener("input", () => {
        const url = addressInput.value.trim();
        previewImage.src = url || "";
        previewImage.style.display = url ? "block" : "none";
    });
}

const photoGrid = document.getElementById("photoGrid");

async function fetchUserPhotos() {
    const currentUser = getCurrentUser();
    try {
        const res = await fetch(`http://localhost:3001/api/user-uploads/${encodeURIComponent(currentUser.username)}`);
        return await res.json();
    } catch (e) {
        console.error("Could not load user photos:", e);
        return [];
    }
}

async function renderPhotos(filter = "all") {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const photos = await fetchUserPhotos();
    photoGrid.innerHTML = "";

    document.getElementById("photoCount").textContent = photos.length;
    document.getElementById("tabCount").textContent = photos.length;

    if (photos.length === 0) {
        photoGrid.innerHTML = "<p class='no-photos'>No photos to display yet.</p>";
        return;
    }

    photos.forEach(photo => {
        const div = document.createElement("div");
        div.className = "photo-item";
        div.innerHTML = `
            <img src="${photo.Address}" alt="Photo ${photo.Upload_Id}" />
            ${photo.Caption}
        `;
        photoGrid.appendChild(div);
    });
}
