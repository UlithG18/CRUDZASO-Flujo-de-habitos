// Import the storage module for handling data persistence
import { storage } from "./storage.js";

// DOM elements
const editForm = document.getElementById("edit-task-form"); // Form used to edit habits
const cancelBtn = document.getElementById("cancel-edit"); // Button to cancel editing
const logout = document.getElementById("logout"); // Logout button

// State variables
let editingHabitId = null; // Stores the ID of the habit currently being edited
let allUsers = []; // Array containing all users
let allHabits = []; // "Source of truth" array containing all habits for rendering
let sessionUser = storage.getSession(); // Current logged-in user from session

// Redirect if not logged in or not an admin
if (!sessionUser || sessionUser.role !== "admin") {
    window.location.href = "index.html";
}

// State for filters and search
let activeStatus = "all"; // Current status filter
let activePriority = "all"; // Current priority filter
let searchQuery = ""; // Current search query

// ------------------ Initialization ------------------
async function init() {
    allUsers = await storage.getUsers(); // Fetch all users

    // Merge all users' habits into a single array with owner reference
    allHabits = allUsers.flatMap(user =>
        user.habits.map(habit => ({ ...habit, owner: user }))
    );

    renderHabits(allHabits); // Render all habits initially
}

init(); // Call initialization

// DOM elements for search and filters
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");
const priorityFilter = document.getElementById("priority-filter");

// ------------------ Utility Functions ------------------

// Get the correct column element based on habit status
function getHabitColumn(status) {
    if (status === "In progress") return document.getElementById("article2");
    if (status === "Completed") return document.getElementById("article3");
    return document.getElementById("article1"); // Pending or default
}

// Get priority color for display
function getPriorityColor(priority) {
    if (priority === "High") return "red";
    if (priority === "Medium") return "yellow";
    return "green"; // Low priority
}

// Get status-related CSS classes
function getStatusColor(status) {
    if (status === "In progress") {
        return { border: "border-yellow-300", bg: "bg-yellow-600", hover: "hover:bg-yellow-700" };
    }
    if (status === "Completed") {
        return { border: "border-green-300", bg: "bg-green-600", hover: "hover:bg-green-700" };
    }
    return { border: "border-gray-300", bg: "bg-gray-600", hover: "hover:bg-gray-700" }; // Pending
}

// Create a habit card element for the DOM
function createHabitCard(habit) {
    const priorityColor = getPriorityColor(habit.priority);
    const statusColor = getStatusColor(habit.status);

    const card = document.createElement("div");
    card.className = `w-full border-2 ${statusColor.border} rounded-lg`;
    card.dataset.id = habit.id; // Store habit ID for reference

    // Set inner HTML for the card
    card.innerHTML = `
        <div class="p-6 flex flex-col gap-3">
            <div class="flex justify-between items-start">
                <h1 class="font-medium text-black">${habit.title}</h1>
                <span class="text-sm text-gray-600">${habit.owner.userName}</span>
                <div class="flex gap-2">
                    <button class="edit-btn px-4 rounded-lg hover:bg-gray-200">
                        <img src="assets/icons/pencil-fill.svg" alt="edit" class="h-5 my-1">
                    </button>
                    <button class="delete-btn px-4 rounded-lg hover:bg-gray-200">
                        <img src="assets/icons/trash-fill.svg" class="h-5">
                    </button>
                </div>
            </div>
            <h2 class="text-sky-500">${habit.frequency}</h2>
            <h3 class="text-${priorityColor}-700">${habit.priority}</h3>
            <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">${habit.date}</span>
                <button class="status-btn ${statusColor.bg} ${statusColor.hover} text-white px-3 py-1 rounded">
                    ${habit.status}
                </button>
            </div>
        </div>
    `;

    // ------------------ Event listeners for the card ------------------

    // Edit habit
    card.querySelector(".edit-btn").addEventListener("click", () => {
        editingHabitId = habit.id; // Store currently edited habit
        // Pre-fill form values
        document.getElementById("edit-title").value = habit.title;
        document.getElementById("edit-frequency").value = habit.frequency;
        document.getElementById("edit-priority").value = habit.priority;
        // Show edit modal
        document.getElementById("edit-task").className = "absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center";
    });

    // Delete habit
    card.querySelector(".delete-btn").addEventListener("click", async () => {
        await storage.deleteHabit(habit.owner, habit.id); // Delete from storage
        // Remove from user's local habits array
        habit.owner.habits = habit.owner.habits.filter(h => h.id !== habit.id);
        // Rebuild allHabits array
        allHabits = allUsers.flatMap(u => u.habits.map(h => ({ ...h, owner: u })));
        applyFilters(); // Re-render filtered view
    });

    // Change status on button click
    card.querySelector(".status-btn").addEventListener("click", async () => {
        const nextStatus = habit.status === "Pending" ? "In progress" :
            habit.status === "In progress" ? "Completed" :
                "Pending";
        await storage.updateHabit(habit.owner, habit.id, { status: nextStatus }); // Update in storage
        habit.status = nextStatus; // Update local object
        applyFilters(); // Re-render filtered view
    });

    return card; // Return the constructed card element
}

// Render an array of habits into their respective columns
function renderHabits(habits) {
    const columns = [
        document.getElementById("article1"),
        document.getElementById("article2"),
        document.getElementById("article3")
    ];
    columns.forEach(c => c.innerHTML = ""); // Clear columns
    habits.forEach(habit => {
        const column = getHabitColumn(habit.status); // Determine column
        column.appendChild(createHabitCard(habit)); // Append card
    });
}

// ------------------ Filters & Search ------------------

// Apply all active filters and search query
function applyFilters() {
    let filtered = allHabits;

    // Search filter
    if (searchQuery) {
        filtered = filtered.filter(habit =>
            habit.title.toLowerCase().includes(searchQuery) ||
            habit.owner.userName.toLowerCase().includes(searchQuery)
        );
    }

    // Status filter
    if (activeStatus !== "all") {
        filtered = filtered.filter(habit => habit.status === activeStatus);
    }

    // Priority filter
    if (activePriority !== "all") {
        filtered = filtered.filter(habit => habit.priority === activePriority);
    }

    renderHabits(filtered); // Render filtered results
}

// Update status filter and apply
function setStatusFilter(value) {
    activeStatus = value;
    applyFilters();
}

// Update priority filter and apply
function setPriorityFilter(value) {
    activePriority = value;
    applyFilters();
}

// ------------------ Event Listeners ------------------

// Edit habit form submission
editForm.addEventListener("submit", async e => {
    e.preventDefault();
    if (!editingHabitId) return;

    const title = document.getElementById("edit-title").value.trim();
    const frequency = document.getElementById("edit-frequency").value;
    const priority = document.getElementById("edit-priority").value;

    // Find the habit object in memory
    const habitToEdit = allHabits.find(h => h.id === editingHabitId);
    await storage.updateHabit(habitToEdit.owner, editingHabitId, { title, frequency, priority }); // Update in storage
    // Update local object
    habitToEdit.title = title;
    habitToEdit.frequency = frequency;
    habitToEdit.priority = priority;

    applyFilters(); // Re-render after changes

    editingHabitId = null; // Reset editing state
    document.getElementById("edit-task").className = "hidden"; // Hide edit modal
});

// Cancel edit
cancelBtn.addEventListener("click", e => {
    e.preventDefault();
    editingHabitId = null;
    document.getElementById("edit-task").className = "hidden"; // Hide modal
});

// Filters change
statusFilter.addEventListener("change", e => setStatusFilter(e.target.value));
priorityFilter.addEventListener("change", e => setPriorityFilter(e.target.value));

// Search input
searchInput.addEventListener("input", e => {
    searchQuery = e.target.value.toLowerCase();
    applyFilters();
});

// Logout
logout.addEventListener("click", () => {
    storage.clearSession(); // Clear session
    window.location.href = "index.html"; // Redirect to login
});
