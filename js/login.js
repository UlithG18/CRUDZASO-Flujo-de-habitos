// Import storage module for data handling
import { storage } from "./storage.js";

// Get current session if user is already logged in
const currentUser = storage.getSession();

// Get login form element
const loginForm = document.getElementById("login-form");

// If there is a session, redirect to the habits page
if (currentUser) {
    window.location.href = 'habits.html';
}

// ------------------ User Login Function ------------------
async function userLogin() {
    // Fetch all registered users from storage
    const usersList = await storage.getUsers();

    // Get form values
    const userEmail = document.getElementById("input-email").value;
    const userPassword = document.getElementById("input-password").value;
    const errorMessage = document.getElementById('warning-msg');

    // Find a user with the entered email
    const findUser = usersList.find(user => user.email === userEmail);

    // Check if email or password is empty
    if (!userEmail || !userPassword) {
        errorMessage.innerHTML =
            `<div class="bg-purple-100 border-l-4 border-purple-500 text-fuchsia-700 p-4 mt-5" role="alert">
                <p class="font-bold">Missing information...</p>
                <p>You need to fill all the blanks</p>
            </div>`;
        return;
    }

    // Check if user exists
    if (!findUser) {
        errorMessage.innerHTML =
            `<div class="bg-purple-100 border-l-4 border-purple-500 text-fuchsia-700 p-4 mt-5" role="alert">
                <p class="font-bold">ALERT!</p>
                <p>Your don't have an account</p>
            </div>`;
        // Redirect to registration page after 2 seconds
        setTimeout(() => {
            window.location.href = 'register.html';
        }, 2000);
        return;
    }

    // Check if email and password match
    if (findUser.email !== userEmail || findUser.password !== userPassword) {
        errorMessage.innerHTML =
            `<div class="bg-purple-100 border-l-4 border-purple-500 text-fuchsia-700 p-4 mt-5" role="alert">
                <p class="font-bold">ALERT!</p>
                <p>Your information doesn't match with the stored data</p>
            </div>`;
        return;
    }

    // Save user session
    storage.saveSession(findUser);

    // Redirect based on role
    if (findUser.role === "admin") { // Fixed assignment bug: use === instead of =
        window.location.href = 'habits-admin.html';
    } else {
        window.location.href = 'habits.html';
    }
}

// ------------------ Event Listener for Form Submission ------------------
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission
    await userLogin(); // Call login function
});
