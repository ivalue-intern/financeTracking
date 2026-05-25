const Database = require("better-sqlite3");

const db = new Database("finance.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount INTEGER NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

module.exports = db;
