let currentUser = null;

export async function fetchCurrentUser() {
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
export async function login(username, password) {
    try {
        const res = await fetch("http://localhost:3001/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        currentUser = data;
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
export async function signup(username, email, password) {
    try {
        const res = await fetch("http://localhost:3001/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Signup failed');
        currentUser = data;
        return data;
    } catch (err) {
        console.error("Signup error:", err);
        throw err;
    }
}

export function getCurrentUser() {
    return currentUser;
}
