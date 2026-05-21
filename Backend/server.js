import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import Passport from "passport";
import bcrypt, { hash } from "bcrypt";
import bodyParser from "body-parser";
import { Strategy as localStrategy } from "passport-local";
import session from "express-session";
import GoogleStrategy from "passport-google-oauth2";
import AmazonStrategy, { Strategy as AmazonStrategyClass } from "passport-amazon";
import passport from "passport";
import socketIO from "socket.io";
import db from "./db.js";
import { isAuthenticated } from "./Middlewares/auth_middleware.js";
import is_Valid from "./Middlewares/Validation_middleware.js";
import Error_handler from "./Middlewares/error_middleware.js";
import { registerOAuthUser } from "./Middlewares/oauth_helper.js";
import { rateLimit } from "express-rate-limit";

dotenv.config();
const app = express();
const port = 3000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: "#",//we need to provide the url of the frontend here to communicate with backend
    credentials: true,
}));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_session_secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false, //it should be true while deploying to real server
            sameSite: "lax",
        }
    })
);

app.use(Passport.initialize());
app.use(Passport.session());

app.post("/register", is_Valid, async (req, res, next) => {
    const { email, password, username, name, phone } = req.body;
    try {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                return next(err);
            }
            try {
                await db.query(
                    "INSERT INTO users (email, password, username, name, phone) VALUES ($1, $2, $3, $4, $5)", 
                    [email, hash, username, name, phone]
                );
                return res.status(200).send("User registered successfully");
            } catch (dbErr) {
                return next(dbErr);
            }
        });
    } catch (err) {
        next(err);
    }
});

app.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const check_user = await db.query("SELECT * FROM users WHERE email=$1", [email]);
        if (check_user.rows.length > 0) {
            const user = check_user.rows[0];
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return next(err);
                }
                if (result) {
                    req.login(user, (loginErr) => {
                        if (loginErr) {
                            return next(loginErr);
                        }
                        return res.status(200).send("Login successful🎉");
                    });
                } else {
                    return res.status(400).send("Invalid credentials😭");
                }
            });
        } else {
            return res.status(400).send("NO user found, Register to continue...");
        }
    } catch (err) {
        next(err);
    }
});

app.get("/api/check-auth", isAuthenticated, (req, res) => {
    res.status(200).json({ isAuthenticated: true, user: req.user });
});

app.get("/auth/google", passport.authenticate('google', {
    scope: ['email', 'profile'],
}));

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: "/register",
}), (req, res) => {
    res.status(200).send("Login successful🎉");
});

app.get("/auth/amazon", passport.authenticate('amazon', {
    scope: ['profile', 'email'],
}));

app.get('/auth/amazon/callback', passport.authenticate('amazon', {
    failureRedirect: "/register",
}), (req, res) => {
    res.status(200).send("Login successful🎉");
});

passport.use("local", new localStrategy(async function verify(email, password, cb) {
    try {
        const user_check = await db.query("SELECT * FROM users WHERE email=$1", [email]);
        if (user_check.rows.length == 0) {
            return cb(null, false, "user not found");
        } else {
            bcrypt.compare(password, user_check.rows[0].password, (err, result) => {
                if (err) {
                    console.log(err);
                    return cb(err);
                }
                else {
                    if (result) {
                        return cb(null, user_check.rows[0]);
                    } else {
                        return cb(null, false, "invalid credentials");
                    }
                }
            })
        }
    } catch (error) {
        return cb(error);
    }
}));

passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        const userEmail = profile.email || profile.email[0];
        const user_check = await db.query("SELECT * FROM users WHERE email=$1", [userEmail]);
        if (user_check.rows.length === 0) {
            const uniqueUsername = await registerOAuthUser(userEmail);
            const insertResult = await db.query(
                `INSERT INTO users (email, password, username, name, phone) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING *`,
                [userEmail, 'via Google OAuth', uniqueUsername, profile.name || profile.displayName, null]
            );
            return cb(null, insertResult.rows[0]);
        } else {
            return cb(null, user_check.rows[0]);
        }
    } catch (err) {
        return cb(err);
    }
}));

passport.use("amazon", new AmazonStrategy({
    clientID: process.env.AMAZON_CLIENT_ID || "",
    clientSecret: process.env.AMAZON_CLIENT_SECRET || "",
    callbackURL: "http://localhost:3000/auth/amazon/callback",
    userProfileURL: "https://api.amazon.com/auth/userinfo",
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        const userEmail = profile.email || profile.email[0];
        const user_check = await db.query("SELECT * FROM users WHERE email=$1", [userEmail]);
        if (user_check.rows.length === 0) {
            const uniqueUsername = await registerOAuthUser(userEmail);
            const insertResult = await db.query(
                `INSERT INTO users (email, password, username, name, phone) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING *`,
                [userEmail, 'via Amazon OAuth', uniqueUsername, profile.name || profile.displayName, null]
            );
            return cb(null, insertResult.rows[0]);
        } else {
            return cb(null, user_check.rows[0]);
        }
    } catch (err) {
        return cb(err);
    }
}));

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
    try {
        const user_check = await db.query("SELECT * FROM users WHERE id=$1", [id]);
        cb(null, user_check.rows[0]);
    } catch (err) {
        cb(err);
    }
});




app.use(Error_handler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});