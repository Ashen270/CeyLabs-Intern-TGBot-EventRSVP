const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./src/database/event_bot.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the event_bot database.');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    tickets INTEGER,
    userId INTEGER UNIQUE
)`);

const insertUser = (name, email, tickets, userId, callback) => {
    db.run(`INSERT INTO users (name, email, tickets, userId) VALUES (?, ?, ?, ?)`, [name, email, tickets, userId], function (err) {
        if (err) {
            return callback(err);
        }
        callback(null, this.lastID);
    });
};

export default {
    db,
    insertUser
};
