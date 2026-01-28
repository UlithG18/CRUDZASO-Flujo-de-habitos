import { storage } from "./storage.js";

const logout = document.getElementById('logout');

const usersList = storage.getUsers()
const actualEmail = storage.getSession();
const actualUser = usersList.find(user => user.email === actualEmail);
const habits = actualUser.habits || [];

if (!actualUser) {
    window.location.href = 'index.html'
}

const userName = actualUser.userName
const titleName = document.getElementById("user-name");
titleName.textContent = userName;

const habitsForm = document.getElementById('habits-form');
const titleHabit = document.getElementById('habit-title');
const frequencyHabit = document.getElementById('habit-frequency');
const priorityHabit = document.getElementById('habit-priority');
const dayHabit = document.getElementById('habit-day');
const monthHabit = document.getElementById('habit-month');
const yearHabit = document.getElementById('habit-year');

const article1 = document.getElementById("article1");
const article2 = document.getElementById("article2");
const article3 = document.getElementById("article3");

habits?.forEach(habit => {
    const habitId = habit.id;
    const habitDate = habit.date;
    const habitTitle = habit.title;
    const habitPriority = habit.priority;
    const habitFrequency = habit.frequency;

    const habitStatus = habit.status;
    let article;
    let statusColor1;
    let statusColor2;
    let statusColor3;
    let priorityColor;

    if (habitPriority === "Medium") {
        priorityColor = "yellow"
    } else if (habitPriority === "High") {
        priorityColor = "red"
    } else {
        priorityColor = "green"
    }

    if (habitStatus === "In progress") {
        article = article2
        statusColor1 = "border-yellow-300"
        statusColor2 = "bg-yellow-600"
        statusColor3 = "hover:bg-yellow-700"
    } else if (habitStatus === "Completed") {
        article = article3
        statusColor1 = "border-green-300"
        statusColor2 = "bg-green-600"
        statusColor3 = "hover:bg-green-700"
    } else {
        article = article1
        statusColor1 = "border-gray-300"
        statusColor2 = "bg-gray-600"
        statusColor3 = "hover:bg-gray-700"
    }

    const habitCard = document.createElement("div")
    habitCard.className = `md:w-full h-full border-2 ${statusColor1} border-opacity-60 rounded-lg`;
    habitCard.dataset.id = habitId;
    habitCard.innerHTML =
        `<div class="p-6">
            <div class="flex flex-row place-content-between">
                <h1 class="tracking-widest text title-font font-medium text-black mb-1">${habitTitle}</h1>
                <div class="hover:bg-white flex justify-center rounded-lg">
                    <button class="px-4 rounded-lg hover:bg-gradient-to-br from-sky-400/25 to-purple-900/25">
                        <img src="assets/icons/pencil-fill.svg" alt="" class="h-5 my-1">
                    </button>
                </div>
                <div class="hover:bg-white flex justify-center rounded-lg">
                    <button id="delete-btn" class="text-white px-4 rounded-lg hover:bg-gradient-to-br from-sky-400/25 to-purple-900/25">
                        <img src="assets/icons/trash-fill.svg" alt="" class="h-5">
                    </button>
            </div>
            </div>
            <h2 class="title-font text-lg font-medium text-sky-500 my-3">${habitFrequency}
            </h2>
            <h3 class="title-font text-lg font-medium text-${priorityColor}-700 my-3">${habitPriority}</h3>
            <div class="flex flex-row gap-3 place-content-between">
            <h4 class="title-font text-sm text-gray-700 pt-3">${habitDate}</h4>
            <button class="${statusColor2} text-white px-4 py-2 rounded ${statusColor3}">
                    <p>${habitStatus}</p>
                </button>
            </div>
        </div>`
    article.appendChild(habitCard);


    const deleteBtn = habitCard.querySelector('#delete-btn');

    deleteBtn.addEventListener('click', () => {
        storage.deleteHabit(habit.id, usersList, actualUser);
        habitCard.remove();
        location.reload();
    });



    // const statusBtn = habitCard.querySelector('#status-btn')

    // statusBtn.addEventListener("click", () => {
    //     let newStatus;

    //     if (habit.status === "Pending") {
    //         newStatus = "In progress";
    //     } else if (habit.status === "In progress") {
    //         newStatus = "Completed";
    //     } else {
    //         newStatus = "Pending";
    //     }

    //     habit.status = newStatus;

    //     storage.updateHabit(habit.id, { status: newStatus }, usersList, actualUser);
    //     // renderHabits()
    //     location.reload();
    // });


});



habitsForm.addEventListener(`submit`, (e) => {
    e.preventDefault();

    const title = titleHabit.value.trim();
    const frequency = frequencyHabit.value;
    const priority = priorityHabit.value;
    const day = dayHabit.value;
    const month = monthHabit.value;
    const year = yearHabit.value;
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
        status: "Pending",
        date,
    }

    storage.saveHabit(habits, habit, usersList, actualUser)
    createHabit(habit)
})

function createHabit(habit) {

    let priorityColor;

    if (habit.priority === "Medium") {
        priorityColor = "yellow"
    } else if (habit.priority === "High") {
        priorityColor = "red"
    } else {
        priorityColor = "green"
    }

    const habitCard = document.createElement("div")
    habitCard.className = `md:w-full h-full border-2 "border-gray-300" border-opacity-60 rounded-lg`;
    habitCard.dataset.id = habit.id;
    habitCard.innerHTML =
        `<div class="p-6">
            <div class="flex flex-row place-content-between">
                <h1 class="tracking-widest text title-font font-medium text-black mb-1">${habit.title}</h1>
                <div class="hover:bg-white flex justify-center rounded-lg">
                    <button class="px-4 rounded-lg hover:bg-gradient-to-br from-sky-400/25 to-purple-900/25">
                        <img src="assets/icons/pencil-fill.svg" alt="" class="h-5 my-1">
                    </button>
                </div>
                <div class="hover:bg-white flex justify-center rounded-lg">
                    <button class="text-white px-4 rounded-lg hover:bg-gradient-to-br from-sky-400/25 to-purple-900/25">
                        <img src="assets/icons/trash-fill.svg" alt="" class="h-5">
                    </button>
            </div>
            </div>
            <h2 class="title-font text-lg font-medium text-sky-500 my-3">${habit.frequency}
            </h2>
            <h3 class="title-font text-lg font-medium text-${priorityColor}-700 my-3">${habit.priority}</h3>
            <div class="flex flex-row gap-3 place-content-between">
            <h4 class="title-font text-sm text-gray-700 pt-3">${habit.date}</h4>
            <button class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                    <p>Pending</p>
                </button>
            </div>
        </div>`

    article1.appendChild(habitCard)
    location.reload()
}

logout.addEventListener(`click`, () => {
    storage.clearSession();
    window.location.href = 'index.html'
})