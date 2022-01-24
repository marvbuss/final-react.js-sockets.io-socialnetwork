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
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

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

const cookieSessionMiddleware = cookieSession({
    secret: "NorthKiteboarding",
    maxAge: 1000 * 60 * 30,
    sameSite: true,
});

app.use(cookieSessionMiddleware);

io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
            db.addUser(first, last, email, hashedPw)
                .then((row) => {
                    req.session.userId = row.rows[0].id;
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

app.get(`/api/user/:id`, function (req, res) {
    const loggedInId = req.params.id;
    if (loggedInId == req.session.userId) {
        console.log("err in /api/user/:id -> same userID");
        res.json({ success: false });
    } else {
        db.getUserInfoById(loggedInId)
            .then(({ rows }) => {
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log("err in /api/user/:id", err);
                res.json({ success: false });
            });
    }
});

app.get(`/api/friendship/:id`, function (req, res) {
    const loggedInId = req.session.userId;
    const viewedId = req.params.id;
    db.checkFriendshipStatus(loggedInId, viewedId)
        .then(({ rows }) => {
            if (rows.length === 0) {
                res.json("Send Friend Request");
            } else if (rows[0].accepted) {
                res.json("Unfriend");
            } else if (rows[0].sender_id == loggedInId) {
                res.json("Cancel Friend Request");
            } else {
                res.json("Accept Friend Request");
            }
        })
        .catch((err) => {
            console.log("err in /api/friendship/:id", err);
            res.json({ success: false });
        });
});

app.post(`/api/friendship/status/:id`, (req, res) => {
    const loggedInId = req.session.userId;
    const viewedId = req.params.id;

    if (req.body.btnText === "Send Friend Request") {
        db.startFriendship(loggedInId, viewedId)
            .then(res.json("Cancel Friend Request"))
            .catch((err) => console.log(err));
    } else if (req.body.btnText === "Cancel Friend Request") {
        db.endFriendship(loggedInId, viewedId)
            .then(res.json("Send Friend Request"))
            .catch((err) => console.log(err));
    } else if (req.body.btnText === "Accept Friend Request") {
        db.updateFriendshipStatus(loggedInId, viewedId)
            .then(res.json("Unfriend"))
            .catch((err) => console.log(err));
    } else {
        db.endFriendship(loggedInId, viewedId)
            .then(res.json("Send Friend Request"))
            .catch((err) => console.log(err));
    }
});

app.get("/friends-and-wannabees.json", (req, res) => {
    db.getFriendsAndWannabees(req.session.userId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("err in /friends-and-wannabees", err));
});

app.post("/friendship/accept", (req, res) => {
    const loggedInId = req.session.userId;
    db.updateFriendshipStatus(loggedInId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => console.log("err in /friendhip/accept", err));
});

app.post("/friendship/end", (req, res) => {
    const loggedInId = req.session.userId;
    db.endFriendship(loggedInId)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => console.log("err in /friendship/end", err));
});

app.get("/users/latest", (req, res) => {
    db.showLatestUsers()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => console.log("err in /users/latest", err));
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

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

io.on("connection", (socket) => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    db.getLastTenChatMessages()
        .then(({ rows }) => {
            socket.emit("chatMessages", rows);
        })
        .catch((err) => {
            console.log("err getting last 10 messages: ", err);
        });

    socket.on("newChatMessage", (message) => {
        db.addChatMessage(socket.request.session.userId, message)
            .then(() => {
                db.getUserInfoById(socket.request.session.userId).then(
                    ({ rows }) => {
                        let merged = { message, ...rows[0] };
                        io.emit("chatMessage", merged);
                    }
                );
            })
            .catch((err) => {
                console.log("err inserting newMessage: ", err);
            });
    });
});
