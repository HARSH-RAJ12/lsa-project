const db = require('../config/db');

const User = {
    create: async (username, hashedPassword) => {
        return await db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
    },
    findByUsername: async (username) => {
        const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        return rows[0];
    }
};

module.exports = User;