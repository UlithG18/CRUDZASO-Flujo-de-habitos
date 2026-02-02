// Storage module handles CRUD operations for users, habits, and session management
export const storage = {

    // ------------------ User Management ------------------

    // Save a new user to the backend (POST request)
    async saveUser(user) {
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user) // Send user object as JSON
        });

        return response.json(); // Return created user
    },

    // Get all users from the backend (GET request)
    async getUsers() {
        try {
            const data = await fetch("http://localhost:3000/users");
            const users = await data.json();
            return users || []; // Return empty array if no users
        } catch (error) {
            // Display warning message if server fails
            warningMsg.textContent = "Error connecting to server";
            console.error("Error loading users:", error);
        }
    },

    // Update an entire user object (PUT request)
    async updateUser(user) {
        await fetch(`http://localhost:3000/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });
    },

    // Update only the habits array of a user (PATCH request)
    async updateUserHabits(userId, habits) {
        await fetch(`http://localhost:3000/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ habits }) // Send only updated habits
        });
    },

    // ------------------ Habit Management ------------------

    // Add a new habit to a user's habits array and save to backend
    async saveHabit(user, habit) {
        user.habits = user.habits || []; // Ensure habits array exists
        user.habits.push(habit); // Add new habit
        await this.updateUserHabits(user.id, user.habits); // Persist changes
    },

    // Get all habits of a user
    getHabits(user) {
        if (!user) return []; // Return empty array if user not defined
        return user.habits || [];
    },

    // Update a specific habit by ID with given updates
    async updateHabit(user, habitId, updates) {
        const habit = user.habits.find(h => h.id === habitId);
        if (!habit) return; // Exit if habit not found

        // Apply all updates from the updates object
        for (const key in updates) {
            habit[key] = updates[key];
        }

        await this.updateUserHabits(user.id, user.habits); // Persist changes
    },

    // Delete a habit by ID from user's habits array
    async deleteHabit(user, habitId) {
        user.habits = user.habits.filter(habit => habit.id !== habitId);
        await this.updateUserHabits(user.id, user.habits); // Persist changes
    },

    // ------------------ Session Management ------------------

    // Save current user session in localStorage
    saveSession(session) {
        localStorage.setItem("actual_user", JSON.stringify(session));
    },

    // Get the current session from localStorage
    getSession() {
        const session = localStorage.getItem("actual_user");
        return session ? JSON.parse(session) : null;
    },

    // Clear the current session
    clearSession() {
        localStorage.removeItem("actual_user");
    },

};
