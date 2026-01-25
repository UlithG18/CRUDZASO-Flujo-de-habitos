import { storage } from "./storage.js";
import { adminUsers } from "./auth.js"


usersList = storage.getUsers();
actualUser = usersList.find(user => user.email === userEmail && user.password === userPassword);
const titleName = document.getElementById("user-name")
titleName.textContent = storage.userName

