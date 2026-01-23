import { storage } from "./storage.js";

const loginForm = document.getElementById("login-form")
const registerForm = document.getElementById("register-form");

function userLogin() {
    if (!loadUser.email && !loadUser.password) {
        console.log("You need to create an account first")
    } else {
        window.location.href = 'login.html'
    }
}

function userRegister() {
    const loadUser = storage.getUsers()
    const userEmail = document.getElementById("input-email").value;
    const userPassword = document.getElementById("input-password").value;
    const errorMessage = document.getElementById('WarningMsg');

    if (!userEmail || userPassword) {
        errorMessage.textContent = "You need to fill all the blanks"
        return;
    }

    if (loadUser.email === userEmail && loadUser.password) {
        errorMessage.innerHTML = `<p>You alredy have an account <a href="pages/login.html" class="text-sm underline">LOGIN</a> </p>`;
        return;
    } else {
        loadUser.email = userEmail

        storage.saveUsers(loadUser)
        window.location.href = 'habits.html'
    }
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userLogin()
})

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userRegister()
})