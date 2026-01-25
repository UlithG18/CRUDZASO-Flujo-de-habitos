export const storage = {
    getUsers() {
        const users = localStorage.getItem("users");
        return users ? JSON.parse(users) : [];
    },

    saveUsers(users) {
        localStorage.setItem("app_users", JSON.stringify(users));
    },

    getHabits() {
        const habits = localStorage.getItem("crudzaso_habitflow_habits_${userId}");
        return habits ? JSON.parse(habits) : [];
    },

    saveHabits(habits) {
        localStorage.setItem("crudzaso_habitflow_habits_${userId}", JSON.stringify(habits));
    },

    // getSession() {
    //     return localStorage.getItem("app_session");
    // },

    // saveSession(session) {
    //     localStorage.setItem("app_session", session);
    // },

    // clearSession() {
    //     localStorage.removeItem("app_session");
    // },
};
