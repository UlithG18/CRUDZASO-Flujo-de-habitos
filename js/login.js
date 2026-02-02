import { storage } from "./storage.js";

const currentUser = storage.getSession()
const loginForm = document.getElementById("login-form")

if (currentUser) {
    window.location.href = 'habits.html'
}

async function userLogin() {
    const usersList = await storage.getUsers()

    const userEmail = document.getElementById("input-email").value;
    const userPassword = document.getElementById("input-password").value;
    const errorMessage = document.getElementById('warning-msg');

    const findUser = usersList.find(user => user.email === userEmail);

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
                <p>Your don't have an account</p>
            </div>`;
        setTimeout(() => {
            window.location.href = 'register.html';
        }, 2000);
        return;
    }

    if (findUser.email !== userEmail || findUser.password !== userPassword) {
        errorMessage.innerHTML =
            `<div class="bg-purple-100 border-l-4 border-purple-500 text-fuchsia-700 p-4 mt-5" role="alert">
                <p class="font-bold">ALERT!</p>
                <p>Your information doesn't match with the storeged data</p>
            </div>`;
        return;
    }

    storage.saveSession(findUser)
    if (findUser.role = "admin") {
        window.location.href = 'habits-admin.html';
    } else {
        window.location.href = 'habits.html';
    }

}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await userLogin()
})