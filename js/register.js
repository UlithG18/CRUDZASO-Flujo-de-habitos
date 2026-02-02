import { storage } from "./storage.js";

const registerForm = document.getElementById("register-form");
const currentUser = storage.getSession()


if (currentUser) {
    window.location.href = 'habits.html'
}

// Función para registrar un nuevo usuario

async function userRegister() {
    const usersList = await storage.getUsers()

    const username = document.getElementById("input-register-username").value.trim();
    const userRegEmail = document.getElementById("input-register-email").value;
    const userRegPassword = document.getElementById("input-register-password").value;
    const userRepeatPassword = document.getElementById("input-register-confirm-password").value;
    const errorMessage = document.getElementById('warning-msg');

    const findUser = usersList.find(user => user.email === userRegEmail);

    if (findUser) {
        errorMessage.innerHTML =
            `<div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 my-5">
                <p class="font-bold">ALERT!</p>
                <p>You alredy have an account</p>
            </div>`;
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }

    if (!userRegEmail || !userRegPassword) {
        errorMessage.innerHTML =
            `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-5">
                <p class="font-bold">Missing information...</p>
                <p>You need to fill all the blanks</p>
            </div>`;
        return;
    }

    if (userRegPassword !== userRepeatPassword) {
        errorMessage.innerHTML =
            `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-5">
                <p class="font-bold">Missing information...</p>
                <p>The passwords doesn't match</p>
            </div>`;
        return;
    }

    const newUser = {
        id: Date.now(),
        username,
        email: userRegEmail,
        password: userRegPassword,
    };

    storage.saveSession(newUser)
    storage.saveUser(newUser)
    window.location.href = 'habits.html'
}

// Event listener para el formulario de registro
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await userRegister()
})