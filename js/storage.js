export const storage = {
    async saveUser(user) {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        return response.json();
    },

    // Loads products from API
    async getUsers() {
        try {
            const data = await fetch(`http://localhost:3000/users`);
            const users = await data.json();
            return users || []
        } catch (error) {
            warningMsg.textContent = "Error connecting to server";
            console.error("Error loading products:", error);
        }
    },

    async updateUser(user) {
        await fetch(`http://localhost:3000/users/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
    },

    async updateUserHabits(userId, habits) {
        await fetch(`http://localhost:3000/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ habits })
        });
    },

    async saveHabit(user, habit) {
        user.habits = user.habits || [];
        user.habits.push(habit);
        await this.updateUserHabits(user.id, user.habits);
    },

    getHabits(user) {
        if (!user) return [];
        return user.habits || [];
    },

    async updateHabit(user, habitId, updates) {
        const habit = user.habits.find(habit => habit.id === habitId);
        if (!habit) return;

        for (const key in updates) {
            habit[key] = updates[key];
        }

        await this.updateUserHabits(user.id, user.habits);
    },

    async deleteHabit(user, habitId) {
        user.habits = user.habits.filter(habit => habit.id !== habitId);
        await this.updateUserHabits(user.id, user.habits);
    },

    saveSession(session) {
        localStorage.setItem("actual_user", JSON.stringify(session));
    },

    getSession() {
        const session = localStorage.getItem("actual_user");
        return session ? JSON.parse(session) : null
    },

    clearSession() {
        localStorage.removeItem("actual_user");
    },


};
