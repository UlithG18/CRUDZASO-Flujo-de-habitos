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

const habitTitle = document.getElementById('habit-title').value.trim();
const habitFrecuency = document.getElementById('habit-frequency').value;
const habitPriority = document.getElementById('habit-priority').value;
const habitDay = document.getElementById('habit-day').value;
const habitMonth = document.getElementById('habit-month').value;
const habitYear = document.getElementById('habit-year').value;

function createHabit(habit, userId) {
    const habits = getHabits(userId);
    habits.push(habit);
    saveHabits(habits, userId);
}

habitsForm.addEventListener(`submit`, (e) => {
    e.preventDefault();

    const date = `${habitDay}/${habitMonth}/${habitYear}`

    if (!habitTitle || !habitFrecuency || !habitPriority || !date) {
        return
    };

    const habitId = Date.now()

    const habit = {
        id: habitId,
        title: title,
        frequency: frequency,
        priority: priority,
        status: "pending",
        date: date,
    }




})


