import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../Components/Protected compo/api";
import {
    authCard,
    authGlowGreen,
    authGlowOrange,
    authPageShell,
    inputClass,
    labelClass,
    primaryButton,
    socialButton
} from "../Components/uiClasses";

const auth_title_gradi =
    "bg-linear-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent group-hover:from-yellow-400 group-hover:to-orange-500 transition-all duration-500";
const msg_box = "mb-6 p-4 rounded-xl text-sm font-medium";
const divider_txt =
    "relative z-10 px-4 bg-gray-950 text-xs font-semibold text-orange-200/40 uppercase tracking-widest";
const google_btn = `${socialButton} hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]`;
const amazon_btn = `${socialButton} hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)]`;
const otp_btn =
    "px-6 py-3 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-300 font-bold hover:bg-orange-500/20 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer";

function SignUp() {
    const apiURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");

    const [otpSent, setOtpSent] = useState(false);
    const [otpSentText, setOtpSentText] = useState("Send OTP");
    const [timer, setTimer] = useState(600);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (otpSent) {
            const interval = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer <= 1) {
                        clearInterval(interval);
                        setOtpSent(false);
                        setOtpSentText("Send OTP");
                        return 600;
                    }
                    setOtpSentText(`OTP Sent ${prevTimer - 1} sec`);
                    return prevTimer - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [otpSent]);

    const handleSendOTP = async () => {
        if (!email || !email.includes('@')) {
            setErrorMsg("Please enter a valid email address first.");
            return;
        }
        setErrorMsg("");
        setSuccessMsg("");
        setOtpSentText("Sending...");

        try {
            const response = await API.post("/api/otp", { email });
            if (response.data.success) {
                setOtpSent(true);
                setTimer(600);
                setOtpSentText("OTP Sent 600 sec");
                setSuccessMsg("OTP sent successfully to your email!");
            } else {
                setErrorMsg(response.data.message || "Failed to send OTP.");
                setOtpSentText("Send OTP");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            const serverMsg = error.response?.data?.message || error.response?.data;
            setErrorMsg(typeof serverMsg === 'string' ? serverMsg : "Failed to send OTP. Please check your connection.");
            setOtpSentText("Send OTP");
        }
    };

    const handleSignUp = async (e) => {
        if (e) e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!name || !email || !phone || !username || !password || !confirmPassword || !otp) {
            setErrorMsg("All fields, including OTP, are required.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            await API.post("/register", {
                name,
                email,
                phone,
                username,
                password,
                otp
            });

            setSuccessMsg("User registered successfully! 🎉 Redirecting to Home...");
            setOtpSent(false);
            setOtpSentText("Send OTP");

            setTimeout(() => {
                navigate("/home");
            }, 2000);
        } catch (error) {
            console.error("Registration error:", error);
            const serverMsg = error.response?.data?.message || error.response?.data;
            setErrorMsg(typeof serverMsg === 'string' ? serverMsg : "Failed to register user. Please check your details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        window.location.href = `${apiURL}/auth/google`;
    };

    const handleAmazonSignUp = () => {
        window.location.href = `${apiURL}/auth/amazon`;
    };

    return (
        <div className={`${authPageShell} py-12`}>
            <div className={authGlowOrange}></div>
            <div className={authGlowGreen}></div>

            {/* Sign_Up_Card */}
            <div className={`${authCard} max-w-2xl`}>

                <div className="flex flex-col items-center text-center mb-8 group">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white">
                        Create an <span className={auth_title_gradi}>HELLO Account</span>
                    </h2>
                    <p className="text-orange-200/60 text-sm mt-2 font-medium">
                        Join the HELLO Games community to start brainstorming
                    </p>
                </div>

                {/* Error*/}
                {errorMsg && (
                    <div className={`${msg_box} border border-red-500/30 bg-red-500/10 text-red-300`}>
                        ⚠️ {errorMsg}
                    </div>
                )}

                {/* Success*/}
                {successMsg && (
                    <div className={`${msg_box} border border-green-500/30 bg-green-500/10 text-green-300`}>
                        ✅ {successMsg}
                    </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-6">
                    {/* user data input */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <h3 className={labelClass}>Enter your Name</h3>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Name"
                                className={`w-full ${inputClass}`}
                            />
                        </div>
                        <div>
                            <h3 className={labelClass}>Enter your Email</h3>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className={`w-full ${inputClass}`}
                            />
                        </div>
                        <div>
                            <h3 className={labelClass}>Enter your Phone Number</h3>
                            <input
                                type="text"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Phone Number"
                                className={`w-full ${inputClass}`}
                            />
                        </div>
                        <div>
                            <h3 className={labelClass}>Enter your Username</h3>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Set User Name"
                                className={`w-full ${inputClass}`}
                            />
                        </div>
                        <div>
                            <h3 className={labelClass}>Enter your Password</h3>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className={`w-full ${inputClass}`}
                            />
                        </div>
                        <div>
                            <h3 className={labelClass}>Confirm your Password</h3>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                className={`w-full ${inputClass}`}
                            />
                        </div>
                    </div>

                    {/* OTP verification */}
                    <div className="border-t border-orange-500/10 pt-5 mt-4">
                        <h3 className={labelClass}>Enter your OTP</h3>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                className={`flex-1 ${inputClass}`}
                            />
                            <button
                                type="button"
                                onClick={handleSendOTP}
                                disabled={otpSent}
                                className={otp_btn}
                            >
                                {otpSentText}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3.5 mt-4 ${primaryButton}`}
                    >
                        {isLoading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                {/* or sign up with */}
                <div className="relative my-8 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-orange-500/10"></div>
                    </div>
                    <span className={divider_txt}>
                        Or Register with
                    </span>
                </div>

                {/* third party sign up*/}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        className={google_btn}
                    >
                        <svg className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                        </svg>
                        Google
                    </button>
                    <button
                        type="button"
                        onClick={handleAmazonSignUp}
                        className={amazon_btn}
                    >
                        <svg className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110 fill-current text-[#FF9900]" viewBox="0 0 448 512">
                            <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5c0 109.5 138.3 114 183.5 43.2c6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32C140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5c40.7-.1 35.5 29.8 35.5 69.1m0 86.8c0 80-84.2 68-84.2 17.2c0-47.2 50.5-56.7 84.2-57.8zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12m39.8 2.2c-6.5 15.8-16 26.8-21.2 31c-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2c-10.8 1-13 2-14-.3c-2.3-5.7 21.7-15.5 37.5-17.5c15.7-1.8 41-.8 46 5.7c3.7 5.1 0 27.1-6.5 43.1" />
                        </svg>
                        Amazon
                    </button>
                </div>

                <p className="text-center text-sm text-orange-200/60 mt-8">
                    Already have an account?{" "}
                    <Link
                        to="/sign-in"
                        className="text-orange-400 font-bold hover:underline transition-all cursor-pointer"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;
