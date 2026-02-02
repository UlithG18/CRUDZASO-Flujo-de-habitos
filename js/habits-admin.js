import { storage } from "./storage.js";

const editForm = document.getElementById("edit-task-form");
const cancelBtn = document.getElementById("cancel-edit")
const logoutBtn = document.getElementById("logout");

let editingHabitOwner = null;
let editingHabitId = null;
let actualUser = null;
let allUsers = [];
let habits = [];

// Revisar sesión
const sessionUser = storage.getSession();

if (!sessionUser) {
    window.location.href = "index.html";
}

async function initAdmin() {
    const users = await storage.getUsers();
    actualUser = users.find(user => user.id === sessionUser.id);

    // Si no hay usuario o no es admin, redirige
    if (!actualUser || actualUser.role !== "admin") {
        window.location.href = "index.html";
        return;
    }

    allUsers = users;
    loadAllHabits();

    const titleName = document.getElementById("user-name");
    titleName.textContent = `Admin: ${actualUser.userName}`;
}

// Cargar todos los hábitos con referencia al dueño
function loadAllHabits() {
    habits = [];
    allUsers.forEach(user => {
        (user.habits || []).forEach(habit => {
            habits.push({ habit, owner: user });
        });
    });
    renderHabits(habits);
}

// Determinar columna por status
function getHabitColumn(status) {
    if (status === "In progress") return document.getElementById("article2");
    if (status === "Completed") return document.getElementById("article3");
    return document.getElementById("article1");
}

// Colores por prioridad
function getPriority(priority) {
    if (priority === "High") return "red";
    if (priority === "Medium") return "yellow";
    return "green";
}

// Colores por status
function getStatus(status) {
    if (status === "In progress") return { border: "border-yellow-300", bg: "bg-yellow-600", hover: "hover:bg-yellow-700" };
    if (status === "Completed") return { border: "border-green-300", bg: "bg-green-600", hover: "hover:bg-green-700" };
    return { border: "border-gray-300", bg: "bg-gray-600", hover: "hover:bg-gray-700" };
}

// Crear tarjeta
function createHabitCard(habitObj) {
    const { habit, owner } = habitObj;
    const priorityColor = getPriority(habit.priority);
    const statusColor = getStatus(habit.status);

    const card = document.createElement("div");
    card.className = `w-full border-2 ${statusColor.border} rounded-lg`;
    card.dataset.id = habit.id;
    card.dataset.userId = owner.id;

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

    // Botón delete
    card.querySelector("#delete-btn").addEventListener("click", async () => {
        await storage.deleteHabit(owner, habit.id);
        loadAllHabits();
    });

    // Botón edit
    card.querySelector("#edit-btn").addEventListener("click", () => {
        editingHabitId = habit.id;
        editingHabitOwner = owner;

        document.getElementById("edit-title").value = habit.title;
        document.getElementById("edit-frequency").value = habit.frequency;
        document.getElementById("edit-priority").value = habit.priority;

        document.getElementById("edit-task").className = "absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center";
    });

    // Botón status
    card.querySelector("#status-btn").addEventListener("click", async () => {
        const nextStatus =
            habit.status === "Pending"
                ? "In progress"
                : habit.status === "In progress"
                    ? "Completed"
                    : "Pending";
        await storage.updateHabit(owner, habit.id, { status: nextStatus });
        loadAllHabits();
    });

    return card;
}

// Render de todas las tarjetas
function renderHabits(habitsArr) {
    const columns = [
        document.getElementById("article1"),
        document.getElementById("article2"),
        document.getElementById("article3")
    ];

    columns.forEach(col => (col.innerHTML = ""));

    habitsArr.forEach(habitObj => {
        const column = getHabitColumn(habitObj.habit.status);
        column.appendChild(createHabitCard(habitObj));
    });
}

editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!editingHabitId || !editingHabitOwner) return;

    const title = document.getElementById("edit-title").value.trim();
    const frequency = document.getElementById("edit-frequency").value;
    const priority = document.getElementById("edit-priority").value;

    await storage.updateHabit(editingHabitOwner, editingHabitId, { title, frequency, priority });

    loadAllHabits(); // recarga todos los hábitos actualizados

    editingHabitId = null;
    editingHabitOwner = null;
    document.getElementById("edit-task").className = "hidden";
});

cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    editingHabitId = null;
    editingHabitOwner = null;
    document.getElementById("edit-task").className = "hidden";
});


// Logout
logoutBtn.addEventListener("click", () => {
    storage.clearSession();
    window.location.href = "index.html";
});

initAdmin();
