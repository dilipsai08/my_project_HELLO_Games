import db from "../db.js";
import crypto from "crypto";

const vali_error = (msg, next) => {
    const err = new Error(msg);
    err.statusCode = 400;
    return next(err);
};

async function is_Valid(req, res, next) {
    try {
        const { email, password, username, name, phone, otp } = req.body;
        
        if (!email || !email.includes('@')) {
            return vali_error("Invalid email", next);
        }
        
        const email_domain = ["gmail.com", "icloud.com", "outlook.com", "zoho.com","yahoo.com"];
        const domain = email.split('@')[1];
        if (!domain || !email_domain.includes(domain.toLowerCase())) {
            return vali_error("The application is limited to Gmail, Outlook, Yahoo, Zoho, and iCloud email domains only.", next);
        }

        if (!otp) {
            return vali_error("OTP is required", next);
        }

        const sessionOtp = req.session?.otp;
        if (!sessionOtp) {
            return vali_error("Error in OTP validation. Please request a new OTP.", next);
        }

        if (new Date() > new Date(sessionOtp.expiresAt)) {
            req.session.otp = null;
            req.session.save();
            return vali_error("OTP has expired", next);
        }

        const InputOtp = crypto.createHash("sha256").update(otp).digest("hex");
        if (sessionOtp.email !== email || sessionOtp.otp !== InputOtp) {
            return vali_error("Invalid OTP", next);
        }

        if (!username) {
            return vali_error("Username is required", next);
        }
        
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            return vali_error("Username can only contain letters, numbers, and underscores", next);
        }
        
        if (!phone || !phone.match(/^[0-9]{10}$/)) {
            return vali_error("Phone number is required and must be 10 digits", next);
        }
        
        if (!password || password.length < 8) {
            return vali_error("Password must be at least 8 characters long", next);
        }   
        
        if (!name || name.length < 2) {
            return vali_error("Name is too short", next);
        }
        
        if (!name.match(/^[a-zA-Z ]+$/)) {
            return vali_error("Name can only contain letters with space", next);
        }

        const unq_email = await db.query("SELECT * FROM users WHERE email=$1", [email]);
        if (unq_email.rows.length > 0) {
            return vali_error("User already exists with this email", next);
        }

        const check_username = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        if (check_username.rows.length > 0) {
            return vali_error("Username is already taken", next);
        }
        next();
    } catch (err) {
        next(err);
    }
}

export default is_Valid;