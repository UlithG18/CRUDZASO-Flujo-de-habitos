// Import the storage module which handles data persistence
import { storage } from "./storage.js";

// DOM elements
const editForm = document.getElementById("edit-task-form"); // Form for editing a habit
const cancelBtn = document.getElementById("cancel-edit"); // Cancel button for editing
const logoutBtn = document.getElementById("logout"); // Logout button

// State variables
let editingHabitOwner = null; // Stores the user who owns the habit being edited
let editingHabitId = null; // Stores the ID of the habit being edited
let actualUser = null; // The currently logged-in user
let allUsers = []; // Array of all users
let habits = []; // Array of all habits combined from all users

// Check if there is a session
const sessionUser = storage.getSession(); // Retrieve the currently logged-in user from session

if (!sessionUser) {
    // If no user is logged in, redirect to the login page
    window.location.href = "index.html";
}

// Initialize admin dashboard
async function initAdmin() {
    const users = await storage.getUsers(); // Fetch all users from storage
    actualUser = users.find(user => user.id === sessionUser.id); // Find the logged-in user

    // Redirect if user does not exist or is not an admin
    if (!actualUser || actualUser.role !== "admin") {
        window.location.href = "index.html";
        return;
    }

    allUsers = users; // Store all users
    loadAllHabits(); // Load all habits to display

    // Update admin name in the UI
    const titleName = document.getElementById("user-name");
    titleName.textContent = `Admin: ${actualUser.userName}`;
}

// Load all habits from all users and keep track of the owner
function loadAllHabits() {
    habits = [];
    allUsers.forEach(user => {
        // If user has habits, combine them with their owner
        (user.habits || []).forEach(habit => {
            habits.push({ habit, owner: user });
        });
    });
    renderHabits(habits); // Render all habits in the UI
}

// Determine which column a habit should go into based on status
function getHabitColumn(status) {
    if (status === "In progress") return document.getElementById("article2");
    if (status === "Completed") return document.getElementById("article3");
    return document.getElementById("article1"); // Default column is "Pending"
}

// Determine color based on priority
function getPriority(priority) {
    if (priority === "High") return "red";
    if (priority === "Medium") return "yellow";
    return "green"; // Default color for low priority
}

// Determine CSS classes based on habit status
function getStatus(status) {
    if (status === "In progress") return { border: "border-yellow-300", bg: "bg-yellow-600", hover: "hover:bg-yellow-700" };
    if (status === "Completed") return { border: "border-green-300", bg: "bg-green-600", hover: "hover:bg-green-700" };
    return { border: "border-gray-300", bg: "bg-gray-600", hover: "hover:bg-gray-700" }; // Pending
}

// Create a habit card element for display
function createHabitCard(habitObj) {
    const { habit, owner } = habitObj; // Extract habit and owner
    const priorityColor = getPriority(habit.priority); // Get priority color
    const statusColor = getStatus(habit.status); // Get status colors

    // Create the card container
    const card = document.createElement("div");
    card.className = `w-full border-2 ${statusColor.border} rounded-lg`;
    card.dataset.id = habit.id; // Store habit ID in data attribute
    card.dataset.userId = owner.id; // Store owner ID in data attribute

    // Set card inner HTML
    card.innerHTML = `
        <div class="p-6 flex flex-col gap-3">
            <div class="flex justify-between items-start">
                <h1 class="font-medium text-black">${habit.title}</h1>
                <div class="flex gap-2">
                    <button id="edit-btn" class="edit-btn px-4 rounded-lg hover:bg-gray-200">Edit</button>
                    <button id="delete-btn" class="px-4 rounded-lg hover:bg-red-200">Delete</button>
                </div>
            </div>
            <h2 class="text-sky-500">${habit.frequency}</h2>
            <h3 class="text-${priorityColor}-700">${habit.priority}</h3>
            <span class="text-sm text-gray-600">Owner: ${owner.userName} | Date: ${habit.date}</span>
            <button id="status-btn" class="${statusColor.bg} ${statusColor.hover} text-white px-3 py-1 rounded">${habit.status}</button>
        </div>
    `;

    // Delete habit on button click
    card.querySelector("#delete-btn").addEventListener("click", async () => {
        await storage.deleteHabit(owner, habit.id);
        loadAllHabits(); // Reload all habits after deletion
    });

    // Edit habit on button click
    card.querySelector("#edit-btn").addEventListener("click", () => {
        editingHabitId = habit.id;
        editingHabitOwner = owner;

        // Pre-fill edit form with habit details
        document.getElementById("edit-title").value = habit.title;
        document.getElementById("edit-frequency").value = habit.frequency;
        document.getElementById("edit-priority").value = habit.priority;

        // Show edit modal
        document.getElementById("edit-task").className = "absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center";
    });

    // Change status on button click
    card.querySelector("#status-btn").addEventListener("click", async () => {
        const nextStatus =
            habit.status === "Pending"
                ? "In progress"
                : habit.status === "In progress"
                    ? "Completed"
                    : "Pending";
        await storage.updateHabit(owner, habit.id, { status: nextStatus });
        loadAllHabits(); // Reload habits to reflect status change
    });

    return card; // Return the created card element
}

// Render all habit cards into their respective columns
function renderHabits(habitsArr) {
    const columns = [
        document.getElementById("article1"), // Pending
        document.getElementById("article2"), // In progress
        document.getElementById("article3")  // Completed
    ];

    // Clear previous content
    columns.forEach(col => (col.innerHTML = ""));

    // Append each habit card to the correct column
    habitsArr.forEach(habitObj => {
        const column = getHabitColumn(habitObj.habit.status);
        column.appendChild(createHabitCard(habitObj));
    });
}

// Handle edit form submission
editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!editingHabitId || !editingHabitOwner) return;

    // Get updated values from form
    const title = document.getElementById("edit-title").value.trim();
    const frequency = document.getElementById("edit-frequency").value;
    const priority = document.getElementById("edit-priority").value;

    // Update habit in storage
    await storage.updateHabit(editingHabitOwner, editingHabitId, { title, frequency, priority });

    loadAllHabits(); // Reload all habits with updates

    // Reset editing state and hide edit modal
    editingHabitId = null;
    editingHabitOwner = null;
    document.getElementById("edit-task").className = "hidden";
});

// Cancel edit
cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    editingHabitId = null;
    editingHabitOwner = null;
    document.getElementById("edit-task").className = "hidden"; // Hide modal
});

// Logout functionality
logoutBtn.addEventListener("click", () => {
    storage.clearSession(); // Clear session
    window.location.href = "index.html"; // Redirect to login page
});

// Initialize the admin dashboard on page load
initAdmin();
