import React, { useState, useEffect } from "react";
import axios from "axios";
function SignUp() {
    const [otpSent, setOtpSent] = useState(false);
    const [otpSentText, setOtpSentText] = useState("Send OTP");
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        if (otpSent) {
            const interval = setInterval(() => {
                if (timer === 0) {
                    clearInterval(interval);
                    setOtpSent(false);
                    setTimer(60);
                    setOtpSentText("Send OTP");
                }
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [otpSent]);

    const handleSendOTP = () => {

        setOtpSent(true);
        setOtpSentText(`OTP Sent ${timer} sec`);
    }

    const handleSignUp = () => {
        setOtpSent(false);
        setOtpSentText("Send OTP");
    }
    const handleGoogleSignUp = async () => {
        await axios.get('http://localhost:3000/auth/google')
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }
    const handleAmazonSignUp = async () => {
        await axios.get('http://localhost:3000/auth/amazon')
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }
    return (
        <div>
            <form >
                <div>
                    <h3>Enter your Name</h3>
                    <input type="text" placeholder="Name" />
                </div>
                <div>
                    <h3>Enter your Email</h3>
                    <input type="email" placeholder="Email" />
                </div>
                <div>
                    <h3>Enter your Phone Number</h3>
                    <input type="number" placeholder="Phone Number" />
                </div>
                <div>
                    <h3>Enter your Username</h3>
                    <input type="text" placeholder="Set User Name" />
                </div>
                <div>
                    <h3>Enter your Password</h3>
                    <input type="password" placeholder="Password" />
                </div>
                <div>
                    <h3>Confirm your Password</h3>
                    <input type="password" placeholder="Confirm Password" />
                </div>
                <div>
                    <h3>Enter your OTP</h3>
                    <input type="number" placeholder="Enter OTP" />
                    <button type="button" onClick={handleSendOTP}>{otpSentText}</button>
                </div>
                <button type="submit" onClick={handleSignUp}>Sign Up</button>
            </form>
            <button onClick={handleGoogleSignUp}>Sign up with Google</button>
            <button onClick={handleAmazonSignUp}>Sign up with Amazon</button>
            <p>Already have an account? <a href="#">Login</a></p>
        </div>
    );
}
export default SignUp;  