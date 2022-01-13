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

// ---------------------------------------------------- users queries-------------------------------------------------------------- /

module.exports.addUser = (firstName, lastName, emailAdress, userPassword) => {
    const q = `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id;`;
    const params = [firstName, lastName, emailAdress, userPassword];
    return db.query(q, params);
};

module.exports.compareFromUsersTable = (emailAddress) => {
    const q = `SELECT * FROM users WHERE email=$1`;
    const params = [emailAddress];
    return db.query(q, params);
};

module.exports.getUserInfoById = (user_id) => {
    const q = `SELECT first, last, email, created_at FROM users WHERE id=$1`;
    const params = [user_id];
    return db.query(q, params);
};

// ----------------------------------------------------password_reset_codes queries-------------------------------------------------------------- /

module.exports.addResetCode = (resetCode, emailAdress) => {
    const q = `INSERT INTO password_reset_codes (code, email) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET code = $1`;
    const params = [resetCode, emailAdress];
    return db.query(q, params);
};

module.exports.compareResetCode = (emailAdress) => {
    const q = `SELECT code FROM password_reset_codes WHERE email=$1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`;
    const params = [emailAdress];
    return db.query(q, params);
};

module.exports.updateUsersPassword = (email, password) => {
    const q = `UPDATE users SET password = $2 WHERE email=$1`;
    const params = [email, password];
    return db.query(q, params);
};
