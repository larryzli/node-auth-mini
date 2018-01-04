const express = require("express");
const session = require("express-session");
const passport = require("passport");
const strategy = require("./strategy");

const app = express();

// app.use(cors());
// app.use(json());
// massive connection to database

app.use(
    session({
        secret: "muchSecret",
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(strategy);
passport.serializeUser(function(user, done) {
    return done(null, user); // or destructure user to send in only relavant data
});
passport.deserializeUser(function(user, done) {
    return done(null, user);
});

app.get(
    "/login",
    passport.authenticate("auth0", {
        successRedirect: "/me",
        failureRedirect: "/login",
        failureFlash: true
    })
);
app.get("/me", (req, res) => {
    if (req.user) {
        return res.status(200).json(req.user);
    } else {
        return res.redirect("/login");
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
