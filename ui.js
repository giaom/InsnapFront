import { getCurrentUser } from "./auth.js";

export function setupSidebar() {
    const sidebar = document.getElementById("textSidebar");
    const toggleBtn = document.getElementById("toggleSidebar");
    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        toggleBtn.classList.toggle("flipped");
    });
}

export function setupTabs(renderPhotos) {
    document.querySelectorAll(".tabs button").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelector(".tabs button.active")?.classList.remove("active");
            btn.classList.add("active");
            renderPhotos(btn.dataset.tab);
        });
    });
}

export function setupUserProfile() {
    const user = getCurrentUser();
    if (!user) return;

    document.getElementById("iconProfilePic").src = user.profilePic || "./assets/defaultPfp.png";
    document.getElementById("mainProfilePic").src = user.profilePic || "./assets/defaultPfp.png";
    document.getElementById("mainUsername").textContent = user.username;
    document.getElementById("textUsername").textContent = user.username;
    document.getElementById("bioText").textContent = user.bio || "Welcome to Insnap!";
}
