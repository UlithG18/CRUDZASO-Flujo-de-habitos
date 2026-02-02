import { storage } from "./storage.js";

const editForm = document.getElementById("edit-task-form");
const cancelBtn = document.getElementById("cancel-edit")
const logout = document.getElementById("logout");
let editingHabitId = null;
let actualUser = null;
let habits = [];

const sessionUser = storage.getSession();

if (!sessionUser) {
    window.location.href = "index.html";
}

async function init() {
    const users = await storage.getUsers();
    actualUser = users.find(user => user.id === sessionUser.id);

    if (!actualUser) {
        storage.clearSession();
        window.location.href = "index.html";
    }

    habits = actualUser.habits || [];
    activeFilters();

    const titleName = document.getElementById("user-name");
    titleName.textContent = actualUser.userName;
}

init();


// Initial values needed

const habitsForm = document.getElementById("habits-form");
const titleHabit = document.getElementById("habit-title");
const frequencyHabit = document.getElementById("habit-frequency");
const priorityHabit = document.getElementById("habit-priority");
const dayHabit = document.getElementById("habit-day");
const monthHabit = document.getElementById("habit-month");
const yearHabit = document.getElementById("habit-year");

const statusFilter = document.getElementById("status-filter")
const priorityFilter = document.getElementById("priority-filter")
let activeStatus = "all";
let activePriority = "all";



// Define where the habit card goes

function getHabitColumn(status) {
    if (status === "In progress") return document.getElementById("article2");
    if (status === "Completed") return document.getElementById("article3");
    return document.getElementById("article1");
}

// Priority text color

function getPriority(priority) {
    if (priority === "High") return "red";
    if (priority === "Medium") return "yellow";
    return "green";
}

// Cards desing colors depends on status 

function getStatus(status) {
    if (status === "In progress") {
        return {
            border: "border-yellow-300",
            bg: "bg-yellow-600",
            hover: "hover:bg-yellow-700"
        };
    }

    if (status === "Completed") {
        return {
            border: "border-green-300",
            bg: "bg-green-600",
            hover: "hover:bg-green-700"
        };
    }

    return {
        border: "border-gray-300",
        bg: "bg-gray-600",
        hover: "hover:bg-gray-700"
    };
}

// Habits creation and modifications

function createHabitCard(habit) {
    const priorityColor = getPriority(habit.priority);
    const statusColor = getStatus(habit.status);

    const card = document.createElement("div");
    card.className = `w-full border-2 ${statusColor.border} rounded-lg`;
    card.dataset.id = habit.id;

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

    // delete habits

    card.querySelector("#delete-btn").addEventListener("click", async (e) => {
        e.preventDefault();
        await storage.deleteHabit(actualUser, habit.id);
        habits = storage.getHabits(actualUser);
        activeFilters();
    });

    // Edit habits

    card.querySelector("#edit-btn").addEventListener("click", (e) => {
        e.preventDefault();

        editingHabitId = habit.id;

        document.getElementById("edit-title").value = habit.title;
        document.getElementById("edit-frequency").value = habit.frequency;
        document.getElementById("edit-priority").value = habit.priority;

        document.getElementById("edit-task").className = "absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center";
    });

    // Status update

    card.querySelector("#status-btn").addEventListener("click", async (e) => {
        e.preventDefault();
        const nextStatus =
            habit.status === "Pending"
                ? "In progress"
                : habit.status === "In progress"
                    ? "Completed"
                    : "Pending";

        await storage.updateHabit(actualUser, habit.id, { status: nextStatus });
        habits = storage.getHabits(actualUser);
        activeFilters();
    });

    return card;
}

// Render habits

function renderHabits(habits) {

    const columns = [
        document.getElementById("article1"),
        document.getElementById("article2"),
        document.getElementById("article3")
    ];

    columns.forEach(column => (column.innerHTML = ""));

    habits.forEach(habit => {
        const column = getHabitColumn(habit.status);
        const card = createHabitCard(habit);
        column.appendChild(card);
    });
}

// created habit

async function createHabit(habit) {
    await storage.saveHabit(actualUser, habit);
    habits = storage.getHabits(actualUser);
    activeFilters();
}

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


editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!editingHabitId) return;

    const title = document.getElementById("edit-title").value.trim();
    const frequency = document.getElementById("edit-frequency").value;
    const priority = document.getElementById("edit-priority").value;

    await storage.updateHabit(actualUser, editingHabitId, { title, frequency, priority });

    habits = storage.getHabits(actualUser);
    activeFilters();

    editingHabitId = null;
    document.getElementById("edit-task").className = "hidden";
});

cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    editingHabitId = null;
    document.getElementById("edit-task").className = "hidden";
});


// submit for the creation

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

    if (!habit.title || !habit.frequency || !habit.priority) return;

    createHabit(habit);
    habitsForm.reset();
});

statusFilter.addEventListener("change", () => {
    setStatusFilter(e.target.value);
});

priorityFilter.addEventListener("change", () => {
    setPriorityFilter(e.target.value);
});


// logout option

logout.addEventListener("click", () => {
    storage.clearSession();
    window.location.href = "index.html";
});
