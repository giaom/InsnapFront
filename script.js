import { dummyAccounts, dummyPhotos } from './dummyData.js';

document.addEventListener("DOMContentLoaded", () => {
    // Guest user setup
    const guestUser = {
        username: "guest",
        profilePic: "./assets/guestPfp.png",
        bio: "Welcome to Insnap! You're browsing as a guest.",
    };

    document.getElementById("iconProfilePic").src = guestUser.profilePic;
    document.getElementById("mainProfilePic").src = guestUser.profilePic;
    document.getElementById("mainUsername").textContent = guestUser.username;
    document.getElementById("textUsername").textContent = guestUser.username;
    document.getElementById("bioText").textContent = guestUser.bio;

    // Sidebar toggle
    const sidebar = document.getElementById("textSidebar");
    const toggleBtn = document.getElementById("toggleSidebar");

    // Ensure arrow is correct on load
    function setArrowInitialState() {
        if (sidebar.classList.contains("collapsed")) {
            toggleBtn.classList.remove("flipped");
        } else {
            toggleBtn.classList.add("flipped");
        }
    }
    setArrowInitialState();

    function updateMainContentPadding() {
        const iconsSidebar = document.querySelector('.sidebar-icons');
        const textSidebar = document.getElementById('textSidebar');
        const mainContent = document.querySelector('.main-content');
        const iconsWidth = iconsSidebar.offsetWidth;
        const textWidth = textSidebar.classList.contains('collapsed') ? 0 : textSidebar.offsetWidth;
        // Add a little extra space (e.g., 24px)
        mainContent.style.paddingLeft = (iconsWidth + textWidth + 24) + "px";
    }

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
        toggleBtn.classList.toggle("flipped");
        setTimeout(() => {
            updateSearchSidebarPosition();
            updateMainContentPadding();
        }, 310);
    });

    window.addEventListener('resize', updateMainContentPadding);
    updateMainContentPadding();

    // Tabs
    document.querySelectorAll(".tabs button").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelector(".tabs button.active")?.classList.remove("active");
            btn.classList.add("active");
            renderPhotos(btn.dataset.tab);
        });
    });

    // --- Photo rendering logic ---
    const photos = dummyPhotos;
    const photoGrid = document.getElementById("photoGrid");

    function renderPhotos(filter = "all") {
        photoGrid.innerHTML = "";

        // Only show photos owned by the current user (e.g., guest)
        const currentUsername = document.getElementById("mainUsername").textContent.trim();
        let filtered = photos.filter(photo => photo.owner === currentUsername);

        document.getElementById("photoCount").textContent = filtered.length;
        document.getElementById("tabCount").textContent = filtered.length;

        if (filtered.length === 0) {
            photoGrid.innerHTML = "<p class='no-photos'>No photos to display yet.</p>";
            return;
        }

        filtered.forEach((photo) => {
            const div = document.createElement("div");
            div.className = "photo-item";
            div.innerHTML = `
                <img src="${photo.url}" alt="Photo ${photo.id}" />
                ${photo.owner ? '<div class="edit-icon" title="Edit Photo">✏️</div>' : ""}
                ${photo.hasEdits ? '<div class="toggle-icon" title="Toggle Original/Edit">🌓</div>' : ""}
            `;
            photoGrid.appendChild(div);
        });
    }

    renderPhotos();

    // --- Show Auth modal when clicking Sign In/Out icon or "Sign In" text ---
    const authModal = document.getElementById('authModal');
    const signInOutIcon = document.querySelector('.icon-section img[alt="Sign In/Out"]');
    const signInText = Array.from(document.querySelectorAll('.text-section'))
        .find(el => el.textContent.trim().toLowerCase().includes("sign in"));
    const modalTitle = document.getElementById('modalTitle');
    const signupForm = document.getElementById('signupForm');
    const signinForm = document.createElement('form');
    signinForm.id = 'signinForm';
    signinForm.className = 'auth-form';
    signinForm.innerHTML = `
        <div class="input-group">
            <label for="signinUsername">Username</label>
            <input type="text" id="signinUsername" required placeholder="Enter your username" />
        </div>
        <div class="input-group">
            <label for="signinPassword">Password</label>
            <input type="password" id="signinPassword" required placeholder="Enter your password" />
            <div class="input-warning" id="signinWarning"></div>
        </div>
        <button type="submit" id="signinBtn">Sign In</button>
        <div class="switch-auth">
            Don't have an account? <a href="#" id="switchToSignUp">Sign up</a>
        </div>
    `;
    
    const switchToSignIn = document.getElementById('switchToSignIn');
    const switchToSignUpLink = signinForm.querySelector('#switchToSignUp');
    
    function showAuthModal(mode = 'signup') {
        authModal.classList.remove('hidden');
        
        if (mode === 'signin') {
            modalTitle.textContent = 'Sign In';
            signupForm.style.display = 'none';
            
            // Add signin form if not already in the DOM
            if (!document.getElementById('signinForm')) {
                signupForm.parentNode.appendChild(signinForm);
            }
            signinForm.style.display = 'flex';
        } else {
            modalTitle.textContent = 'Sign Up';
            signupForm.style.display = 'flex';
            if (document.getElementById('signinForm')) {
                signinForm.style.display = 'none';
            }
        }
    }

    signInOutIcon?.parentElement?.addEventListener('click', () => showAuthModal('signin'));
    signInText?.addEventListener('click', () => showAuthModal('signin'));
    
    // Switch between sign up and sign in forms
    switchToSignIn.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthModal('signin');
    });
    
    switchToSignUpLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthModal('signup');
    });

    // ESC to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") authModal.classList.add('hidden');
    });

    // Click outside modal to close
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) authModal.classList.add('hidden');
    });
    
    // Handle sign in form submission
    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signinUsername').value;
        const password = document.getElementById('signinPassword').value;
        const signinWarning = document.getElementById('signinWarning');
        
        // Check against dummy accounts
        const account = dummyAccounts.find(acc => 
            acc.username.toLowerCase() === username.toLowerCase() && 
            acc.password === password
        );
        
        if (account) {
            // Successful login
            signinWarning.textContent = "";
            signinWarning.style.display = "none";
            
            // Update user info
            document.getElementById("iconProfilePic").src = account.profilePic;
            document.getElementById("mainProfilePic").src = account.profilePic;
            document.getElementById("mainUsername").textContent = account.username;
            document.getElementById("textUsername").textContent = account.username;
            document.getElementById("bioText").textContent = account.bio || "No bio available.";
            
            // Close modal
            authModal.classList.add('hidden');
            
            // Refresh photos to show the logged-in user's photos
            renderPhotos();
        } else {
            // Failed login
            signinWarning.textContent = "Invalid username or password.";
            signinWarning.style.display = "block";
        }
    });

    // --- Sign Up Validation Logic ---
    const usernameInput = document.getElementById('signupUsername');
    const usernameCheck = document.getElementById('usernameCheck');
    const usernameWarning = document.getElementById('usernameWarning');
    usernameInput.addEventListener('input', async function () {
        const val = usernameInput.value;
        usernameCheck.classList.add('hidden');
        if (!val) {
            usernameWarning.textContent = "";
            usernameWarning.style.display = "none";
            checkSignupValidity();
            return;
        }
        if (!/^[A-Za-z0-9_]{5,}$/.test(val)) {
            usernameWarning.textContent = "At least 5 characters, only letters, numbers, or underscores.";
            usernameWarning.style.display = "block";
            checkSignupValidity();
            return;
        }
        try {
            const res = await fetch(`http://localhost:3001/api/auth/check-username?username=${encodeURIComponent(val)}`);
            const data = await res.json();
            if (data.taken) {
                usernameWarning.textContent = "Username taken, please try another.";
                usernameWarning.style.display = "block";
                usernameCheck.classList.add('hidden');
            } else {
                usernameWarning.textContent = "";
                usernameWarning.style.display = "none";
                usernameCheck.classList.remove('hidden');
            }
        } catch {
            // Fallback: check dummy accounts for uniqueness
            const taken = dummyAccounts.some(acc => acc.username.toLowerCase() === val.toLowerCase());
            if (taken) {
                usernameWarning.textContent = "Username taken (dummy).";
                usernameWarning.style.display = "block";
                usernameCheck.classList.add('hidden');
            } else {
                usernameWarning.textContent = "";
                usernameWarning.style.display = "none";
                usernameCheck.classList.remove('hidden');
            }
        }
        checkSignupValidity();
    });

    const emailInput = document.getElementById('signupEmail');
    const emailCheck = document.getElementById('emailCheck');
    const emailWarning = document.getElementById('emailWarning');
    emailInput.addEventListener('input', async function () {
        const val = emailInput.value;
        emailCheck.classList.add('hidden');
        if (!val) {
            emailWarning.textContent = "";
            emailWarning.style.display = "none";
            checkSignupValidity();
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            emailWarning.textContent = "Enter a valid email address.";
            emailWarning.style.display = "block";
            checkSignupValidity();
            return;
        }
        try {
            const res = await fetch(`http://localhost:3001/api/auth/check-email?email=${encodeURIComponent(val)}`);
            const data = await res.json();
            if (data.taken) {
                emailWarning.textContent = "Email already in use.";
                emailWarning.style.display = "block";
                emailCheck.classList.add('hidden');
            } else {
                emailWarning.textContent = "";
                emailWarning.style.display = "none";
                emailCheck.classList.remove('hidden');
            }
        } catch {
            // Fallback: check dummy accounts for uniqueness
            const taken = dummyAccounts.some(acc => acc.email?.toLowerCase() === val.toLowerCase());
            if (taken) {
                emailWarning.textContent = "Email already in use (dummy).";
                emailWarning.style.display = "block";
                emailCheck.classList.add('hidden');
            } else {
                emailWarning.textContent = "";
                emailWarning.style.display = "none";
                emailCheck.classList.remove('hidden');
            }
        }
        checkSignupValidity();
    });

    const passwordInput = document.getElementById('signupPassword');
    const passwordCheck = document.getElementById('passwordCheck');
    const passwordWarning = document.getElementById('passwordWarning');
    passwordInput.addEventListener('input', function () {
        const val = passwordInput.value;
        passwordCheck.classList.add('hidden');
        if (!val) {
            passwordWarning.textContent = "";
            passwordWarning.style.display = "none";
            confirmInput.dispatchEvent(new Event('input'));
            checkSignupValidity();
            return;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(val)) {
            passwordWarning.textContent = "At least 8 characters, 1 letter, 1 number, no special characters.";
            passwordWarning.style.display = "block";
            checkSignupValidity();
        } else {
            passwordWarning.textContent = "";
            passwordWarning.style.display = "none";
            passwordCheck.classList.remove('hidden');
            checkSignupValidity();
        }
        confirmInput.dispatchEvent(new Event('input'));
    });

    const confirmInput = document.getElementById('signupConfirm');
    const confirmCheck = document.getElementById('confirmCheck');
    const confirmWarning = document.getElementById('confirmWarning');
    confirmInput.addEventListener('input', function () {
        confirmCheck.classList.add('hidden');
        if (!confirmInput.value) {
            confirmWarning.textContent = "";
            confirmWarning.style.display = "none";
            checkSignupValidity();
            return;
        }
        if (confirmInput.value !== passwordInput.value) {
            confirmWarning.textContent = "Passwords do not match.";
            confirmWarning.style.display = "block";
            checkSignupValidity();
        } else {
            confirmWarning.textContent = "";
            confirmWarning.style.display = "none";
            confirmCheck.classList.remove('hidden');
            checkSignupValidity();
        }
    });

    // Enable Sign Up button only when all valid
    function checkSignupValidity() {
        const usernameValid = !usernameWarning.textContent && usernameInput.value && !usernameCheck.classList.contains('hidden');
        const emailValid = !emailWarning.textContent && emailInput.value && !emailCheck.classList.contains('hidden');
        const passwordValid = !passwordWarning.textContent && passwordInput.value && !passwordCheck.classList.contains('hidden');
        const confirmValid = !confirmWarning.textContent && confirmInput.value && !confirmCheck.classList.contains('hidden');
        const termsChecked = document.getElementById('termsCheck').checked;

        document.getElementById('signupBtn').disabled = !(usernameValid && emailValid && passwordValid && confirmValid && termsChecked);
    }
    usernameInput.addEventListener('input', checkSignupValidity);
    emailInput.addEventListener('input', checkSignupValidity);
    passwordInput.addEventListener('input', checkSignupValidity);
    confirmInput.addEventListener('input', checkSignupValidity);
    document.getElementById('termsCheck').addEventListener('change', checkSignupValidity);

    // --- Search sidebar logic ---
    const searchSidebar = document.getElementById("searchSidebar");
    const searchIcon = document.querySelector('.icon-section img[alt="Search"]');
    const searchSidebarArrow = document.getElementById("searchSidebarArrow");
    const searchText = Array.from(document.querySelectorAll('.text-section'))
        .find(el => el.textContent.trim().toLowerCase() === "search");

    function updateSearchSidebarPosition() {
        const iconsSidebar = document.querySelector('.sidebar-icons');
        const textSidebar = document.getElementById("textSidebar");
        const iconsWidth = iconsSidebar.offsetWidth;
        const textWidth = textSidebar.classList.contains("collapsed") ? 0 : textSidebar.offsetWidth;
        searchSidebar.style.left = (iconsWidth + textWidth) + "px";
    }

    function setSearchIconFlipped(isFlipped) {
        if (isFlipped) {
            searchIcon.classList.add("flipped");
        } else {
            searchIcon.classList.remove("flipped");
        }
    }

    function openSearchSidebar() {
        searchSidebar.classList.remove("hidden");
        setSearchIconFlipped(true);
        updateSearchSidebarPosition();
        document.getElementById("searchInput").focus();
    }

    function closeSearchSidebar() {
        searchSidebar.classList.add("hidden");
        setSearchIconFlipped(false);
    }

    searchIcon?.addEventListener('click', () => {
        if (searchSidebar.classList.contains("hidden")) {
            openSearchSidebar();
        } else {
            closeSearchSidebar();
        }
    });

    searchSidebarArrow?.addEventListener("click", closeSearchSidebar);

    if (searchText) {
        searchText.addEventListener('click', () => {
            if (searchSidebar.classList.contains("hidden")) {
                openSearchSidebar();
            } else {
                closeSearchSidebar();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") closeSearchSidebar();
    });

    function updateArrowFlip() {
        if (!searchSidebar.classList.contains("hidden")) {
            searchSidebarArrow.classList.add("flipped");
        } else {
            searchSidebarArrow.classList.remove("flipped");
        }
    }

    window.addEventListener('resize', updateSearchSidebarPosition);

    searchIcon?.addEventListener('click', updateArrowFlip);
    searchSidebarArrow?.addEventListener('click', updateArrowFlip);

    document.getElementById("searchInput").addEventListener("input", function () {
        const query = this.value.trim().toLowerCase();
        const resultsDiv = document.getElementById("searchResults");

        const imageResults = photos.filter(photo =>
            (photo.hashtags || []).some(tag => tag.toLowerCase().includes(query)) ||
            (photo.label || "").toLowerCase().includes(query)
        ).slice(0, 5);

        const accountResults = dummyAccounts.filter(acc =>
            acc.username.toLowerCase().includes(query)
        ).slice(0, 5);

        let html = `<div class="search-section-title">Images</div>`;
        if (imageResults.length) {
            html += imageResults.map(photo =>
                `<div class="search-result-item">${photo.label || "Untitled"}</div>`
            ).join("");
        } else {
            html += `<div class="search-not-found">Images not found</div>`;
        }

        html += `<hr class="search-divider" />`;
        html += `<div class="search-section-title">Accounts</div>`;
        if (accountResults.length) {
            html += accountResults.map(acc =>
                `<div class="search-result-item">@${acc.username}</div>`
            ).join("");
        } else {
            html += `<div class="search-not-found">Accounts not found</div>`;
        }

        resultsDiv.innerHTML = html;
    });
});