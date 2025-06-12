let currentUser = null;

async function fetchCurrentUser() {
    try {
        const res = await fetch("http://localhost:3001/api/current-user", { credentials: "include" });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (data.username) {
            currentUser = data;
            return currentUser;
        } else {
            window.location.href = "/auth.html";  // redirect to combined auth page
        }
    } catch (err) {
        console.error("Fetch user failed:", err);
        window.location.href = "/auth.html";
    }
}

/**
 * Logs in user with username and password.
 * On success, sets currentUser and returns user data.
 * Throws error on failure.
 */
 async function login(username, password) {
    try {
        const res = await fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!data.Login) throw new Error(data.message || 'Login failed');
        currentUser = data;
            window.location.href = 'index.html';  
        return data;
    } catch (err) {
        console.error("Login error:", err);
        throw err;
    }
}

/**
 * Signs up user with username, email, and password.
 * On success, sets currentUser and returns user data.
 * Throws error on failure.
 */
 async function signup(username, email, password) {
    try {
        const res = await fetch("http://localhost:3001/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (!data.success) {
            throw new Error(data.message || 'Signup failed');
        }
        currentUser = data;
        return data;
    } catch (err) {
        console.error("Signup error:", err);
        throw err;
    }
}

 function getCurrentUser() {
    return currentUser;
}

        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const toggleToSignup = document.getElementById('toggleToSignup');
        const toggleToLogin = document.getElementById('toggleToLogin');
        const authTitle = document.getElementById('authTitle');
        const toggleToLoginText = document.getElementById('toggleToLoginText');
        const toggleAuthText = document.getElementById('toggleAuthText');
        const loginError = document.getElementById('loginError');
        const signupError = document.getElementById('signupError');

        // Toggle forms
        toggleToSignup.addEventListener('click', e => {
            e.preventDefault();
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
            authTitle.textContent = 'Sign Up for Insnap';
            toggleToSignup.parentElement.style.display = 'none';
            toggleToLoginText.classList.remove('hidden');
            clearErrors();
        });

        toggleToLogin.addEventListener('click', e => {
            e.preventDefault();
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            authTitle.textContent = 'Log In to Insnap';
            toggleToLoginText.classList.add('hidden');
            toggleToSignup.parentElement.style.display = 'block';
            clearErrors();
        });

        function clearErrors() {
            loginError.textContent = '';
            loginError.classList.add('hidden');
            signupError.textContent = '';
            signupError.classList.add('hidden');
        }

        // Login form submit
        loginForm.addEventListener('submit', async e => {
            e.preventDefault();
            clearErrors();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;

            try {
                await login(username, password);
                // On success, redirect to home or wherever
                window.location.href = 'index.html';
            } catch (err) {
                loginError.textContent = err.message || 'Login failed';
                loginError.classList.remove('hidden');
            }
        });

        // Signup form submit
        signupForm.addEventListener('submit', async e => {
            e.preventDefault();
            clearErrors();

            const username = document.getElementById('signupUsername').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;

            if (password !== confirmPassword) {
                signupError.textContent = 'Passwords do not match';
                signupError.classList.remove('hidden');
                return;
            }

            try {
                await signup(username, email, password);
                // On success, redirect to home or wherever
                window.location.href = 'index.html';
            } catch (err) {
                signupError.textContent = err.message || 'Signup failed';
                signupError.classList.remove('hidden');
            }
        });
