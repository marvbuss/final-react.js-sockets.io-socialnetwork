const spicedPg = require("spiced-pg");
const database = "onion-socialnetwork";
const username = "postgres";
const password = "postgres";

// ------------------------------- LINE OF COMMUNICATION to DATABASE --------------------------------
let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg(
        `postgres:${username}:${password}@localhost:5432/${database}`
    );
}

console.log(`[db] connecting to:${database}`);

module.exports.addUser = (firstName, lastName, emailAdress, userPassword) => {
    const q = `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id`;
    const params = [firstName, lastName, emailAdress, userPassword];
    return db.query(q, params);
};

module.exports.compareFromUsersTable = (emailAddress) => {
    const q = `SELECT * FROM users WHERE email=$1`;
    const params = [emailAddress];
    return db.query(q, params);
};

module.exports.addResetCode = (resetCode, emailAdress) => {
    const q = `INSERT INTO password_reset_codes (code, email) VALUES ($1, $2) RETURNING code`;
    const params = [resetCode, emailAdress];
    return db.query(q, params);
};

module.exports.compareResetCode = (resetCode) => {
    const q = `SELECT * FROM users WHERE code=$1`;
    const params = [resetCode];
    return db.query(q, params);
};
