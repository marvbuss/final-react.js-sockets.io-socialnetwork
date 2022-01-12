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
    // Once you've setup your cookie middleware you
    // can comment in the below answer!!
    res.json({
        userId: req.session.userId,
    });
    // HARD CODED DEMO DELETE CODE BELOW LATER!!!!!
    // mocking a user having an id in their cookie
    // res.json({
    //     userId: 57,
    // });
    // mocking a user NOT to have an id in their cookie
});

// add an app.post to run when your clientside wants to register a user
// in this route you want to
/* 
      register your users:
          hash their password (remember to setup bcrypt!)
          and then insert all values submitted to the db -> need to setup our database 
          stuff (module, as well as db) check your petition project !!
          IF the user registers successfully let the client side know 
          IF sth goes wrong let the client side know
  */

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
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                db.addResetCode(secretCode, req.body.email).then(() => {
                    res.json({ success: true });
                });
            } else {
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("err in email", err);
        });
});

app.post("/password/reset/confirm.json", (req, res) => {
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

// any routes that we are adding where the client is requesting or sending over
// data to store in the database have to go ABOVE the star route below!!!!
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
