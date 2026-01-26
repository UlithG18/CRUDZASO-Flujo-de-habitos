export const storage = {
    saveUsers(users) {
        localStorage.setItem("users", JSON.stringify(users));
    },

    getUsers() {
        const users = localStorage.getItem("users");
        return users ? JSON.parse(users) : [];
    },

    saveHabits(habits) {
        localStorage.setItem(`crudzaso_habitflow_habits_${userId}`, JSON.stringify(habits));
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
        return session ? JSON.parse(session) : "Hola"
    },

    clearSession() {
        localStorage.removeItem("actual_email");
    },
};
