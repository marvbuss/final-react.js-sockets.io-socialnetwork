const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { compare, hash } = require("./bc");
const cookieSession = require("cookie-session");
const db = require("./db");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses.js");

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

// any routes that we are adding where the client is requesting or sending over
// data to store in the database have to go ABOVE the star route below!!!!
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
