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

const habitsForm = document.getElementById('habits-form');



habitsForm.addEventListener(`submit`, (e) => {
    e.preventDefault();

    const title = document.getElementById('habit-title').value.trim();
    const frequency = document.getElementById('habit-frequency').value;
    const priority = document.getElementById('habit-priority').value;
    const day = document.getElementById('habit-day').value;
    const month = document.getElementById('habit-month').value;
    const year = document.getElementById('habit-year').value;
    const date = `${day}/${month}/${year}`

    if (!title || !frequency || !priority || !date) {
        return
    };

    const id = Date.now()

    const habit = {
        id,
        title,
        frequency,
        priority,
        status: "pending",
        date,
    }

    const habits = actualUser.habits || [];
    habits.push(habit)

    actualUser.habits = habits
    storage.saveUsers(actualUser)
})


function createHabit(title, frequency, priority, status) {

}