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
            window.location.href = "/login.html";
        }
    } catch (err) {
        console.error("Fetch user failed:", err);
        window.location.href = "/login.html";
    }
}

export async function login(username, password) {
    const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password })
    });
    return await res.json();
}

export async function signup(username, password) {
    const res = await fetch("http://localhost:3001/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    return await res.json();
}

export function getCurrentUser() {
    return currentUser;
}
