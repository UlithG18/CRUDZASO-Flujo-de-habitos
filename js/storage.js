export const storage = {
    saveUsers(users) {
        localStorage.setItem("users", JSON.stringify(users));
    },

    getUsers() {
        const users = localStorage.getItem("users");
        //return Array.isArray(users) ? users : [];
        return users ? JSON.parse(users) : [];
    },

    saveHabit(habitslist, habit, users, sessionUser) {
        habitslist.push(habit)
        sessionUser.habits = habitslist

        const userIndex = users.findIndex(user => user.email === sessionUser.email);
        users[userIndex] = sessionUser;
        saveUsers(users);
    },

    getHabits() {
        const habits = localStorage.getItem(`crudzaso_habitflow_habits_${userId}`);
        return habits ? JSON.parse(habits) : [];
    },

    saveSession(session) {
        localStorage.setItem("actual_email", JSON.stringify(session));
    },

    getSession() {
        const session = localStorage.getItem("actual_email");
        return session ? JSON.parse(session) : "unkwon"
    },

    clearSession() {
        localStorage.removeItem("actual_email");
    },
};
