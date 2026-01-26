import { storage } from "./storage.js";

const logout = document.getElementById('logout');
const actualUser = storage.getUsers();

// --- When you need to take out an specific user ---
// const actualEmail = storage.getSession();
// const actualUser = usersList.find(user => user.email === actualEmail);

if (!actualUser) {
    window.location.href = 'index.html'
}

const userName = actualUser.userName
const titleName = document.getElementById("user-name");
titleName.textContent = userName;

const habits = actualUser.habits || [];
const habitsForm = document.getElementById('habits-form');

const habitTitle = document.getElementById('habit-title');
const habitFrecuency = document.getElementById('habit-frequency');
const habitPriority = document.getElementById('habit-priority');
const habitDate = document.getElementById('habit-day');
const habitMonth = document.getElementById('habit-month');
const habitYear = document.getElementById('habit-year');

habitsForm.addEventListener(`submit`, (e) => {
    e.preventDefault();

    const title = habitTitle.value.trim();
    const frequency = habitFrecuency.value;
    const priority = habitPriority.value;
    const day = habitDate.value;
    const month = habitMonth.value;
    const year = habitYear.value;

    const date = `${day}/${month}/${year}`

    if (!title || !frequency || !priority || !date) {
        return
    };



})


