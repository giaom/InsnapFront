document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("signupUsername").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    const errorDiv = document.getElementById("signupError");
    errorDiv.style.display = "none";

    if (!username || !email || !password) {
        errorDiv.textContent = "Please fill in all fields.";
        errorDiv.style.display = "block";
        return;
    }

    try {
        const res = await fetch("http://localhost:3001/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
            // Signup success, redirect to login or main page
            window.location.href = "login.html"; // or wherever you want
        } else {
            // Show error from backend
            errorDiv.textContent = data.message || "Signup failed.";
            errorDiv.style.display = "block";
        }
    } catch (err) {
        errorDiv.textContent = "Network error. Please try again.";
        errorDiv.style.display = "block";
    }
});