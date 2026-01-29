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
        storage.saveUsers(users);
    },

    getHabits(user) {
        return user.habits || [];
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

    generateId() {
        let lastId = localStorage.getItem("lastUserId");

        if (!lastId) {
            lastId = 0;
        }

        const newId = Number(lastId) + 1;
        localStorage.setItem("lastUserId", newId);

        return newId;
    },

    updateHabit(habitId, updates, usersList, actualUser) {
        const habits = actualUser.habits;

        const habit = habits.find(habit => habit.id === habitId);

        if (!habit) return;

        for (const key in updates) {
            habit[key] = updates[key];
        }

        localStorage.setItem("users", JSON.stringify(usersList));
    },

    deleteHabit(habitIdToDelete, usersList, actualUser) {
        const habitsList = actualUser.habits;

        for (let habitIndex = 0; habitIndex < habitsList.length; habitIndex++) {
            const currentHabit = habitsList[habitIndex];

            if (currentHabit.id === habitIdToDelete) {
                habitsList.splice(habitIndex, 1);
                break;
            }
        }

        storage.saveUsers(usersList);
    }


};
