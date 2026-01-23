export const storage = {
    getUsers() {
        const users = localStorage.getItem("app_users");
        return users ? JSON.parse(users) : [];
    },

    saveUsers(users) {
        localStorage.setItem("app_users", JSON.stringify(users));
    },

    getIdeas() {
        const ideas = localStorage.getItem("app_ideas");
        return ideas ? JSON.parse(ideas) : [];
    },

    saveIdeas(ideas) {
        localStorage.setItem("app_ideas", JSON.stringify(ideas));
    },

    getSession() {
        return localStorage.getItem("app_session");
    },

    saveSession(session) {
        localStorage.setItem("app_session", session);
    },

    clearSession() {
        localStorage.removeItem("app_session");
    },
};
