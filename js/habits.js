import { storage } from "./storage.js";
import { adminUsers } from "./auth.js"


const habits = [
    {
        id: 2,
        title: "title",
        frequency: "",
        priority: "",
        status: "",
        createdAt: ""
    },
    {
        id: 1,
        title: "title",
        frequency: "",
        priority: "",
        status: "",
        createdAt: ""
    }
]

usersList = storage.getUsers();
actualUser = usersList.find(user => user.email === userEmail && user.password === userPassword);
const titleName = document.getElementById("user-name")
titleName.textContent = storage.userName


