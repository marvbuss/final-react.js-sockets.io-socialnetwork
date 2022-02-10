const spicedPg = require("spiced-pg");
const database = "onion-socialnetwork";
const username = "postgres";
const password = "postgres";

// ------------------------------- LINE OF COMMUNICATION to DATABASE -------------------------------- //

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg(
        `postgres:${username}:${password}@localhost:5432/${database}`
    );
}

console.log(`[db] connecting to:${database}`);

// ---------------------------------------------------- users queries-------------------------------------------------------------- //

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
    const q = `SELECT first, last, email, image_url, bio, created_at FROM users WHERE id=$1`;
    const params = [user_id];
    return db.query(q, params);
};

module.exports.postImages = (postUrl, postUserId) => {
    const q = `UPDATE users SET image_url = $1 WHERE id = $2 RETURNING image_url`;
    const params = [postUrl, postUserId];
    return db.query(q, params);
};

module.exports.postBio = (postBio, postUserId) => {
    const q = `UPDATE users SET bio = $1 WHERE id = $2 RETURNING bio`;
    const params = [postBio, postUserId];
    return db.query(q, params);
};

module.exports.getMatchingUsersList = (val) => {
    const q = `SELECT * FROM users WHERE first ILIKE $1 OR last ILIKE $1`;
    const params = [val + "%"];
    return db.query(q, params);
};

module.exports.showLatestUsers = () => {
    const q = `SELECT * FROM users ORDER BY created_at DESC LIMIT 12`;
    return db.query(q);
};

module.exports.updateUsersPassword = (email, password) => {
    const q = `UPDATE users SET password = $2 WHERE email=$1`;
    const params = [email, password];
    return db.query(q, params);
};

// ----------------------------------------------------password_reset_codes queries-------------------------------------------------------------- //

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

// ----------------------------------------------------friendships queries-------------------------------------------------------------- //

module.exports.checkFriendshipStatus = (recipient_id, sender_id) => {
    const q = `SELECT * FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [recipient_id, sender_id];
    return db.query(q, params);
};

module.exports.updateFriendshipStatus = (recipient_id, sender_id) => {
    const q = `UPDATE friendships SET accepted = true WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1) RETURNING sender_id`;
    const params = [recipient_id, sender_id];
    return db.query(q, params);
};

module.exports.endFriendship = (recipient_id, sender_id) => {
    const q = `DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [recipient_id, sender_id];
    return db.query(q, params);
};

module.exports.startFriendship = (sender_id, recipient_id) => {
    const q = `INSERT INTO friendships (sender_id, recipient_id) VALUES ($1, $2)`;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.getFriendsAndWannabees = (id) => {
    const q = `SELECT users.id, first, last, image_url, accepted FROM friendships JOIN users ON (accepted = FALSE AND recipient_id = $1 AND sender_id = users.id) OR (accepted = TRUE AND recipient_id = $1 AND sender_id = users.id) OR (accepted = TRUE AND sender_id = $1 AND recipient_id = users.id)`;
    const params = [id];
    return db.query(q, params);
};

// ----------------------------------------------------chat_messages queries-------------------------------------------------------------- //

module.exports.getLastTenChatMessages = () => {
    const q = `SELECT users.id, first, last, image_url, chat_messages.message, chat_messages.created_at FROM users JOIN chat_messages ON users.id = chat_messages.user_id ORDER BY chat_messages.created_at DESC LIMIT 10`;
    return db.query(q);
};

module.exports.addChatMessage = (user_id, message) => {
    const q = `INSERT INTO chat_messages (user_id, message) VALUES ($1, $2) RETURNING created_at, id`;
    const params = [user_id, message];
    return db.query(q, params);
};
