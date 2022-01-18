const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { compare, hash } = require("./bc");
const cookieSession = require("cookie-session");
const db = require("./db");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses.js");
const s3 = require("./s3.js");
const multer = require("multer");
const uidSafe = require("uid-safe");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

const s3LocationDomain =
    "https://onionxsocialnetworkxmonopoly.s3.us-east-1.amazonaws.com/";

app.use(
    cookieSession({
        secret: "NorthKiteboarding",
        maxAge: 1000 * 60 * 30,
        sameSite: true,
    })
);

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(express.json());

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.post("/register.json", (req, res) => {
    const { first, last, email, password } = req.body;
    hash(password)
        .then((hashedPw) => {
            console.log("hashedPWd :", hashedPw);
            db.addUser(first, last, email, hashedPw)
                .then((row) => {
                    req.session.userId = row.rows[0].id;
                    console.log(req.session.userId);
                    console.log("---------User registred---------");
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ success: false });
                });
        })
        .catch((err) => console.log("err in hash", err));
});

app.post("/login.json", (req, res) => {
    db.compareFromUsersTable(req.body.email).then((userInput) => {
        compare(req.body.password, userInput.rows[0].password)
            .then((match) => {
                console.log("do provided PW and db stored hash match?", match);
                if (match) {
                    req.session.userId = userInput.rows[0].id;
                    console.log("---------User Logged-In---------");
                    res.json({ success: true });
                } else {
                    res.json({ success: false });
                }
            })
            .catch((err) => {
                console.log("err in password", err);
            });
    });
});

app.post("/password/reset/start.json", (req, res) => {
    db.compareFromUsersTable(req.body.email)
        .then((userInput) => {
            if (userInput.rows.length) {
                console.log("---------User exists---------");
                const secretCode = cryptoRandomString({ length: 6 });
                console.log(secretCode);
                db.addResetCode(secretCode, req.body.email).then(() => {
                    console.log("---------Secret Code generated---------");
                    sendEmail(
                        req.body.email,
                        "Reset Password",
                        secretCode
                    ).then(() => {
                        res.json({ success: true });
                    });
                });
            } else {
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("err in /password/reset/start.json", err);
        });
});

app.post("/password/reset/confirm.json", (req, res) => {
    db.compareResetCode(req.body.email)
        .then(({ rows }) => {
            if (req.body.resetCode == rows[0].code) {
                hash(req.body.password)
                    .then((hashedPw) => {
                        db.updateUsersPassword(req.body.email, hashedPw);
                    })
                    .then(() => {
                        res.json({ success: true });
                    });
            } else {
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("err in /password/reset/confirm.json", err);
            res.json({ success: false });
        });
});

app.get("/user", (req, res) => {
    db.getUserInfoById(req.session.userId)
        .then(({ rows }) => {
            res.json(rows[0]);
        })
        .catch((err) => {
            console.log("err in /user", err);
            res.json({ success: false });
        });
});

app.get("/api/user/:id", function (req, res) {
    const id = req.params.id;
    if (id == req.session.userId) {
        console.log("err in /api/user/:id -> same userID");
        res.json({ success: false });
    } else {
        db.getUserInfoById(id)
            .then(({ rows }) => {
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log("err in /api/user/:id", err);
                res.json({ success: false });
            });
    }
});

app.get("/api/friendship/:id", function (req, res) {
    const userId = req.session.userId;
    const id = req.params.id;
    db.checkFriendshipStatus(userId, id)
        .then(({ rows }) => {
            if (rows[0] == []) {
                return res.json({ friendship: false });
            } else if (rows[0].accepted == true) {
                return res.json({ friendship: true });
            } else if (
                rows[0].accepted == false &&
                rows[0].recipient_id == userId
            ) {
                return res.json({
                    friendship: false,
                    friendshipStatus: "accept",
                });
            } else {
                return res.json({
                    friendship: false,
                    friendshipStatus: "cancel",
                });
            }
        })
        .catch((err) => {
            console.log("/api/friendship/:id", err);
            res.json({ success: false });
        });
});

app.get("/users/latest", (req, res) => {
    db.showLatestUsers()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("err in /users/latest ", err));
});

app.get(`/users/:search`, (req, res) => {
    const search = req.params.search;
    db.getMatchingUsersList(search)
        .then(({ rows }) => res.json(rows))
        .catch((err) => console.log("err in /users/:search: ", err));
});

app.post("/upload.json", uploader.single("file"), s3.upload, (req, res) => {
    console.log("*****************");
    console.log("POST /upload.json Route");
    console.log("*****************");
    console.log("file:", req.file);
    console.log("input:", req.body);
    console.log("our file will be reachable at its bucket's url");
    console.log("with the addition of the filename");
    if (req.file) {
        const s3Url = `${s3LocationDomain}${req.file.filename}`;
        db.postImages(s3Url, req.session.userId)
            .then(({ rows }) => {
                res.json(rows[0].image_url);
            })
            .catch(console.log);
    } else {
        res.json({ success: false });
    }
});

app.post("/update/bio.json", (req, res) => {
    console.log("*****************");
    console.log("POST /update/bio Route");
    console.log("*****************");
    db.postBio(req.body.bioDraft, req.session.userId)
        .then(({ rows }) => {
            res.json(rows[0].bio);
        })
        .catch(console.log);
});

// any routes that we are adding where the client is requesting or sending over
// data to store in the database have to go ABOVE the star route below!!!!
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
