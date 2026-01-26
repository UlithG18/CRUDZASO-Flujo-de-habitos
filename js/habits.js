import { storage } from "./storage.js";

document.addEventListener('DOMContentLoaded', function () {
    const usersList = storage.getUsers();
    const userName = usersList.userName
    const titleName = document.getElementById("user-name");
    titleName.textContent = userName;
})


