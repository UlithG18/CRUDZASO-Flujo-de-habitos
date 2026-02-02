// Import storage module for handling data persistence
import { storage } from "./storage.js";

// DOM elements
const editForm = document.getElementById("edit-task-form"); // Form used for editing habits
const cancelBtn = document.getElementById("cancel-edit"); // Button to cancel editing
const logout = document.getElementById("logout"); // Logout button

// State variables
let editingHabitId = null; // Stores the ID of the habit being edited
let actualUser = null; // The currently logged-in user
let allHabits = []; // All habits in the system (not used extensively here)
let habits = []; // User-specific habits array

// Get the currently logged-in user session
const sessionUser = storage.getSession();

// Redirect if there is no session
if (!sessionUser) {
    window.location.href = "index.html";
}

// ------------------ Initialization ------------------
async function init() {
    const users = await storage.getUsers(); // Fetch all users
    actualUser = users.find(user => user.id === sessionUser.id); // Find current user

    if (!actualUser) {
        storage.clearSession();
        window.location.href = "index.html"; // If user not found, redirect
    }

    habits = actualUser.habits || []; // Load the user's habits
    activeFilters(); // Render with current filters

    // Display username in the UI
    const titleName = document.getElementById("user-name");
    titleName.textContent = actualUser.userName;
}

init(); // Call initialization

// ------------------ DOM Elements for Habit Creation & Filters ------------------
const habitsForm = document.getElementById("habits-form");
const titleHabit = document.getElementById("habit-title");
const frequencyHabit = document.getElementById("habit-frequency");
const priorityHabit = document.getElementById("habit-priority");
const dayHabit = document.getElementById("habit-day");
const monthHabit = document.getElementById("habit-month");
const yearHabit = document.getElementById("habit-year");

const statusFilter = document.getElementById("status-filter");
const priorityFilter = document.getElementById("priority-filter");

// Filter and search state
let searchLetters = ""; // Not currently used for searching
let activeStatus = "all"; // Status filter
let activePriority = "all"; // Priority filter

// ------------------ Helper Functions ------------------

// Determine which column a habit should go into based on status
function getHabitColumn(status) {
    if (status === "In progress") return document.getElementById("article2");
    if (status === "Completed") return document.getElementById("article3");
    return document.getElementById("article1"); // Pending
}

// Return text color based on priority
function getPriority(priority) {
    if (priority === "High") return "red";
    if (priority === "Medium") return "yellow";
    return "green"; // Low
}

// Return card border and background colors based on status
function getStatus(status) {
    if (status === "In progress") {
        return { border: "border-yellow-300", bg: "bg-yellow-600", hover: "hover:bg-yellow-700" };
    }
    if (status === "Completed") {
        return { border: "border-green-300", bg: "bg-green-600", hover: "hover:bg-green-700" };
    }
    return { border: "border-gray-300", bg: "bg-gray-600", hover: "hover:bg-gray-700" }; // Pending
}

// ------------------ Habit Card Creation ------------------
function createHabitCard(habit) {
    const priorityColor = getPriority(habit.priority);
    const statusColor = getStatus(habit.status);

    const card = document.createElement("div");
    card.className = `w-full border-2 ${statusColor.border} rounded-lg`;
    card.dataset.id = habit.id;

    // Inner HTML of the card
    card.innerHTML =
        `<div class="p-6 flex flex-col gap-3">
            <div class="flex justify-between items-start">
                <h1 class="font-medium text-black">${habit.title}</h1>
                <div class="hover:bg-white flex justify-center rounded-lg">
                    <button type="button" id="edit-btn" class="px-4 rounded-lg hover:bg-gradient-to-br from-sky-400/25 to-purple-900/25">
                        <img src="assets/icons/pencil-fill.svg" alt="" class="h-5 my-1">
                    </button>
                </div>
                <div class="hover:bg-white flex justify-center rounded-lg">
                    <button type="button" id="delete-btn" class="px-4 rounded-lg hover:bg-gradient-to-br from-sky-400/25 to-purple-900/25">
                        <img src="assets/icons/trash-fill.svg" class="h-5">
                    </button>
                </div>
            </div>
            <h2 class="text-sky-500">${habit.frequency}</h2>
            <h3 class="text-${priorityColor}-700">${habit.priority}</h3>
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">${habit.date}</span>
                <button type="button" id="status-btn" class="${statusColor.bg} ${statusColor.hover} text-white px-3 py-1 rounded">
                    ${habit.status}
                </button>
            </div>
        </div>`;

    // ------------------ Card Event Listeners ------------------

    // Delete habit
    card.querySelector("#delete-btn").addEventListener("click", async (e) => {
        e.preventDefault();
        await storage.deleteHabit(actualUser, habit.id); // Delete from storage
        habits = storage.getHabits(actualUser); // Refresh local habits
        activeFilters(); // Re-render with filters
    });

    // Edit habit
    card.querySelector("#edit-btn").addEventListener("click", (e) => {
        e.preventDefault();
        editingHabitId = habit.id;

        // Fill edit form with current habit info
        document.getElementById("edit-title").value = habit.title;
        document.getElementById("edit-frequency").value = habit.frequency;
        document.getElementById("edit-priority").value = habit.priority;

        // Show edit modal
        document.getElementById("edit-task").className = "absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center";
    });

    // Update status
    card.querySelector("#status-btn").addEventListener("click", async (e) => {
        e.preventDefault();
        const nextStatus =
            habit.status === "Pending" ? "In progress" :
                habit.status === "In progress" ? "Completed" :
                    "Pending";

        await storage.updateHabit(actualUser, habit.id, { status: nextStatus }); // Update storage
        habits = storage.getHabits(actualUser); // Refresh local habits
        activeFilters(); // Re-render
    });

    return card;
}

// ------------------ Render Habits ------------------
function renderHabits(habits) {
    const columns = [
        document.getElementById("article1"),
        document.getElementById("article2"),
        document.getElementById("article3")
    ];
    columns.forEach(column => (column.innerHTML = "")); // Clear columns

    habits.forEach(habit => {
        const column = getHabitColumn(habit.status);
        const card = createHabitCard(habit);
        column.appendChild(card);
    });
}

// ------------------ Habit Creation ------------------
async function createHabit(habit) {
    await storage.saveHabit(actualUser, habit); // Save habit in storage
    habits = storage.getHabits(actualUser); // Refresh local habits
    activeFilters(); // Re-render
}

// ------------------ Filters ------------------
function activeFilters() {
    const filtered = habits.filter(habit => {
        const statusMatch = activeStatus === "all" || habit.status === activeStatus;
        const priorityMatch = activePriority === "all" || habit.priority === activePriority;
        return statusMatch && priorityMatch;
    });

    renderHabits(filtered);
}

function setStatusFilter(value) {
    activeStatus = value;
    activeFilters();
}

function setPriorityFilter(value) {
    activePriority = value;
    activeFilters();
}

// ------------------ Event Listeners ------------------

// Submit edit form
editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!editingHabitId) return;

    const title = document.getElementById("edit-title").value.trim();
    const frequency = document.getElementById("edit-frequency").value;
    const priority = document.getElementById("edit-priority").value;

    await storage.updateHabit(actualUser, editingHabitId, { title, frequency, priority });
    habits = storage.getHabits(actualUser);
    activeFilters();

    editingHabitId = null; // Reset edit
    document.getElementById("edit-task").className = "hidden"; // Hide modal
});

// Cancel edit
cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    editingHabitId = null;
    document.getElementById("edit-task").className = "hidden";
});

// Submit new habit
habitsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const habit = {
        id: Date.now(),
        title: titleHabit.value.trim(),
        frequency: frequencyHabit.value,
        priority: priorityHabit.value,
        status: "Pending",
        date: `${dayHabit.value}/${monthHabit.value}/${yearHabit.value}`
    };

    if (!habit.title || !habit.frequency || !habit.priority) return; // Validate
    createHabit(habit); // Save habit
    habitsForm.reset(); // Clear form
});

// Filter change events
statusFilter.addEventListener("change", () => setStatusFilter(e.target.value));
priorityFilter.addEventListener("change", () => setPriorityFilter(e.target.value));

// Logout
logout.addEventListener("click", () => {
    storage.clearSession(); // Clear session
    window.location.href = "index.html"; // Redirect
});
