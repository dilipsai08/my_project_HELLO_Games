import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import passport from "passport";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import session from "express-session";
import GoogleStrategy from "passport-google-oauth2";
import AmazonStrategy from "passport-amazon";
import { Strategy as localStrategy } from "passport-local";
import morgan from "morgan";
import helmet from "helmet";
import connectPgSimple from "connect-pg-simple";
import { Resend } from "resend";
import db from "./db.js";
import { isAuthenticated } from "./Middlewares/auth_middleware.js";
import is_Valid from "./Middlewares/Validation_middleware.js";
import Error_handler from "./Middlewares/error_middleware.js";
import { Rate_limiter, OAuth_rate_limiter, ban_check } from "./Middlewares/RateLimiter_middleware.js";
import { registerOAuthUser } from "./Middlewares/oauth_helper.js";
import logger from "./utils/logger.js";

const err_msg = (msg, statusCode, next) => {
    const err = new Error(msg);
    err.statusCode = statusCode;
    return next(err);
};

dotenv.config();
const app = express();
const port = 3000;
const saltRounds = 10;
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
const backendURL = process.env.BACKEND_URL || `http://localhost:${port}`;

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: frontendURL,
    credentials: true,
}));
const pgSession = connectPgSimple(session);

app.set("trust proxy", 1);
app.use(ban_check);

app.use(
    session({
        secret: process.env.SESSION_SECRET || "default_session_secret",
        resave: false,
        saveUninitialized: false,
        store: new pgSession({
            pool: db,
            tableName: process.env.PG_SESSION,
            pruneSessionInterval: 60 * 60,
        }),
        cookie: {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        }
    })
);

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);

app.use(Passport.initialize());
app.use(Passport.session());
app.use(morgan("dev"));

function get_email(profile) {
    const email = profile?.email || profile?.emails?.[0]?.value || profile?._json?.email;
    if (Array.isArray(email)) {
        return email[0] || null;
    }
    if (typeof email === 'string') {
        return email;
    }
    return null;
}

function get_name(profile) {
    if (typeof profile?.displayName === 'string' && profile.displayName) {
        return profile.displayName;
    }
    if (typeof profile?.name?.givenName === 'string' && profile.name.givenName) {
        return profile.name.givenName;
    }
    if (typeof profile?.name === 'string' && profile.name) {
        return profile.name;
    }
    if (typeof profile?._json?.name === 'string' && profile._json.name) {
        return profile._json.name;
    }
    return `HELLO Player${Math.floor(100 + Math.random() * 1000)}`;
}

app.post("/register", Rate_limiter, is_Valid, async (req, res, next) => {
    const { email, password, username, name, phone } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const result = await db.query(
            "INSERT INTO users (email, password, username, name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [email, hashedPassword, username, name, phone]
        );
        const user = result.rows[0];

        req.session.otp = null;

        req.login(user, (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }
            req.session.save((saveErr) => {
                if (saveErr) {
                    logger.error("Error saving session on auto-sign-in", saveErr);
                    return next(saveErr);
                }
                return res.status(200).json({ success: true, message: "User registered successfully" });
            });
        });
    } catch (err) {
        next(err);
    }
});

app.post("/api/otp", Rate_limiter, async (req, res, next) => {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();
    if (!email || !email.includes('@')) {
        return err_msg("Invalid email", 400, next);
    }
    const email_domain = ["gmail.com", "icloud.com", "outlook.com", "zoho.com", "yahoo.com"];
    if (!email_domain.includes(email.split('@')[1])) {
        return err_msg("Invalid email domain", 400, next);
    }

    try {
        const result = await resend.emails.send({
            from: process.env.EMAIL_FROM_ADDRESS || "HELLO Games <onboarding@resend.dev>",
            to: [email],
            subject: "Verification Code for HELLO Games",
            html: `
                <p>Your verification code (OTP) is: <strong>${otp}</strong></p>
                <p>This code is valid for 10 minutes only.</p>
                <p>For your security, please do not share this OTP with anyone.</p>
                <p>Regards,</p>
                <p>The HELLO Games Team</p>
            `,
        });

        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

        req.session.otp = {
            otp: hashedOtp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            email: email,
        };
        req.session.save((err) => {
            if (err) {
                return next(err);
            }
            logger.info("Hashed OTP stored successfully in session.");
            return res.status(200).json({ success: true, message: "OTP sent successfully" });
        });

    } catch (err) {
        next(err);
    }
});

app.post("/sign-in", Rate_limiter, async (req, res, next) => {
    passport.authenticate('local',(err, user, info)=>{
        if(err) return next(err);
        if(!user) return err_msg(info.message||"invalid credentials",400,next);

        req.login(user,(loginErr)=>{
            if(loginErr) return next(loginErr);
            req.session.save((saveErr)=>{
                if(saveErr) return next(saveErr);
                return res.status(200).json({success:true,message:"Login successfull 🎉"});
                
            })
        })
    })(req, res, next);
});

app.get("/logout", async (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        return res.status(200).json({ success: true, message: "logout successfull" });
    });
});

app.get("/api/check-auth", isAuthenticated, (req, res) => {
    res.status(200).json({ isAuthenticated: true, user: req.user });
});

app.get("/auth/google", OAuth_rate_limiter, passport.authenticate('google', {
    scope: ['profile', 'email'],
}));

app.get('/auth/google/callback', OAuth_rate_limiter, passport.authenticate('google', {
    failureRedirect: `${frontendURL}/sign-up`,
}), (req, res) => {
    res.redirect(`${frontendURL}/home`);
});

app.get("/auth/amazon", OAuth_rate_limiter, passport.authenticate('amazon', {
    scope: ['profile'],
}));

app.get('/auth/amazon/callback', OAuth_rate_limiter, passport.authenticate('amazon', {
    failureRedirect: `${frontendURL}/sign-up`,
}), (req, res) => {
    res.redirect(`${frontendURL}/home`);
});

passport.use("local", new localStrategy({ usernameField: 'email' }, async function verify(email, password, cb) {
    try {
        const user_check = await db.query("SELECT * FROM users WHERE email=$1", [email]);
        if (user_check.rows.length == 0) {
            return cb(null, false, "user not found");
        } else {
            bcrypt.compare(password, user_check.rows[0].password, (err, result) => {
                if (err) {
                    logger.error("Local strategy authentication comparison failed", err);
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
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: `${backendURL}/auth/google/callback`,
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        const user_email = get_email(profile);
        if (!user_email) {
            return cb(null, false, { message: "Google did not return an email address." });
        }

        const user_check = await db.query("SELECT * FROM users WHERE email=$1", [user_email]);
        if (user_check.rows.length === 0) {
            const uniqueUsername = await registerOAuthUser(user_email);
            const insertResult = await db.query(
                `INSERT INTO users (email, password, username, name, phone) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING *`,
                [user_email, 'via Google OAuth', uniqueUsername, get_name(profile), null]
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
    callbackURL: `${backendURL}/auth/amazon/callback`,
    userProfileURL: "https://api.amazon.com/auth/userinfo",
}, async (accessToken, refreshToken, profile, cb) => {
    try {
        const user_email = get_email(profile);
        if (!user_email) {
            return cb(null, false, { message: "Amazon did not return an email address." });
        }

        const user_check = await db.query("SELECT * FROM users WHERE email=$1", [user_email]);
        if (user_check.rows.length === 0) {
            const uniqueUsername = await registerOAuthUser(user_email);
            const insertResult = await db.query(
                `INSERT INTO users (email, password, username, name, phone) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING *`,
                [user_email, 'via Amazon OAuth', uniqueUsername, get_name(profile), null]
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




app.post("/api/update-high-score", isAuthenticated, async (req, res, next) => {
    const { score } = req.body;
    const userId = req.user.id;
    try {
        const userQuery = await db.query("SELECT high_score, total_played FROM users WHERE id = $1", [userId]);
        if (userQuery.rows.length > 0) {
            const currentHighScore = userQuery.rows[0].high_score || 0;
            const currentTotalPlayed = userQuery.rows[0].total_played || 0;

            const newHighScore = Math.max(currentHighScore, Number(score));
            const newTotalPlayed = currentTotalPlayed + 1;

            await db.query(
                "UPDATE users SET high_score = $1, total_played = $2 WHERE id = $3",
                [newHighScore, newTotalPlayed, userId]
            );

            req.user.high_score = newHighScore;
            req.user.total_played = newTotalPlayed;

            return res.status(200).json({
                message: "High score updated successfully",
                highScore: newHighScore,
                totalPlayed: newTotalPlayed
            });
        } else {
            return err_msg("User not found", 404, next);
        }
    } catch (err) {
        next(err);
    }
});

app.use(Error_handler);

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
