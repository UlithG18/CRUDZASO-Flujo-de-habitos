// Import storage module for data handling
import { storage } from "./storage.js";

// Get registration form element
const registerForm = document.getElementById("register-form");

// Get current session
const currentUser = storage.getSession();

// Redirect if user is already logged in
if (currentUser) {
    window.location.href = 'habits.html';
}

// ------------------ User Registration Function ------------------
async function userRegister() {
    // Fetch all users from storage
    const usersList = await storage.getUsers();

    // Get form values
    const username = document.getElementById("input-register-username").value.trim();
    const userRegEmail = document.getElementById("input-register-email").value;
    const userRegPassword = document.getElementById("input-register-password").value;
    const userRepeatPassword = document.getElementById("input-register-confirm-password").value;
    const errorMessage = document.getElementById('warning-msg');

    // Check if the email is already registered
    const findUser = usersList.find(user => user.email === userRegEmail);
    if (findUser) {
        errorMessage.innerHTML =
            `<div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-5">
                <p class="font-bold">ALERT!</p>
                <p>You already have an account</p>
            </div>`;
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    // Check for empty email or password
    if (!userRegEmail || !userRegPassword) {
        errorMessage.innerHTML =
            `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-5">
                <p class="font-bold">Missing information...</p>
                <p>You need to fill all the blanks</p>
            </div>`;
        return;
    }

    // Check if passwords match
    if (userRegPassword !== userRepeatPassword) {
        errorMessage.innerHTML =
            `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-5">
                <p class="font-bold">Missing information...</p>
                <p>The passwords don't match</p>
            </div>`;
        return;
    }

    // Create new user object
    const newUser = {
        id: Date.now(), // Unique ID using timestamp
        username,
        email: userRegEmail,
        password: userRegPassword,
    };

    // Save new user session and user data
    storage.saveSession(newUser);
    storage.saveUser(newUser);

    // Redirect to habits page after successful registration
    window.location.href = 'habits.html';
}

// ------------------ Event Listener for Form Submission ------------------
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission
    await userRegister(); // Call the registration function
});
