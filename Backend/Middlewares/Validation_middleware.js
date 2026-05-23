import db from "../db.js";
import crypto from "crypto";

async function is_Valid(req, res, next) {
    const { email, password, username, name, phone, otp } = req.body;
    
    if (!email || !email.includes('@')) {
        return res.status(400).send("Invalid email");
    }
    const email_domain = ["gmail.com", "icloud.com", "outlook.com", "zoho.com"];
    if (!email_domain.includes(email.split('@')[1])) {
        return res.status(400).send("Invalid email domain");
    }

    if (!otp) {
        return res.status(400).send("OTP is required");
    }

    const sessionOtp = req.session.otp;
    if (!sessionOtp) {
        return res.status(400).send("Error in OTP validation");
    }

    if (new Date() > new Date(sessionOtp.expiresAt)) {
        req.session.otp = null;
        req.session.save();
        return res.status(400).send("OTP has expired");
    }

    const InputOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (sessionOtp.email !== email || sessionOtp.otp !== InputOtp) {
        return res.status(400).send("Invalid OTP");
    }

    const unq_email = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if (unq_email.rows.length > 0) {
        return res.status(400).send("User already exists with this email");
    }
    if (!username) {
        return res.status(400).send("Username is required");
    }
    if(!phone || !phone.match(/^[0-9]{10}$/)){
        return res.status(400).send("Phone number is required and must be 10 digits");
    }
    if(password.length < 8){
        return res.status(400).send("Password must be at least 8 characters long");
    }   
    if(!name ||name.length<2){
        return res.status(400).send("Name is too short");
    }
    if(!name.match(/^[a-zA-Z ]+$/)){
        return res.status(400).send("Name can only contain letters with space");
    }
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).send("Username can only contain letters, numbers, and underscores");
    }
    try {
        const check_username = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        if (check_username.rows.length > 0) {
            return res.status(400).send("Username is already taken");
        }
    } catch (err) {
        return next(err);
    }

    next();
}

export default is_Valid;