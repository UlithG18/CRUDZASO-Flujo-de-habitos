import { storage } from "./storage.js";

const usersList = storage.getUsers()
const loginForm = document.getElementById("login-form")

function userLogin() {
    const userEmail = document.getElementById("input-email").value;
    const userPassword = document.getElementById("input-password").value;
    const errorMessage = document.getElementById('warning-msg');

    const findUser = usersList.find(user => user.email === userEmail && user.password === userPassword);

    if (!userEmail || !userPassword) {
        errorMessage.innerHTML =
            `<div class="bg-purple-100 border-l-4 border-purple-500 text-fuchsia-700 p-4 mt-5" role="alert">
                <p class="font-bold">Missing information...</p>
                <p>You need to fill all the blanks</p>
            </div>`;
        return;
    }

    if (!findUser) {
        errorMessage.innerHTML =
            `<div class="bg-purple-100 border-l-4 border-purple-500 text-fuchsia-700 p-4 mt-5" role="alert">
                <p class="font-bold">ALERT!</p>
                <p>Your information doesn't match with the storeged data</p>
            </div>`;
        return;
    } else {

        storage.saveSession(userEmail)
        window.location.href = 'habits.html'
    }
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userLogin()
})