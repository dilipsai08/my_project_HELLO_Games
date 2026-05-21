import React from "react";
import axios from "axios";
function Login (){

    const handleLogin = () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        axios.post('http://localhost:3000/login', { email, password })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }
    const handleGoogleLogin = () => {
        axios.get('http://localhost:3000/auth/google')
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }   
    const handleAmazonLogin = () => {
        axios.get('http://localhost:3000/auth/amazon')
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }   
    
    return(
        <div>
            <form >
                <input type="text" placeholder="Username" />
                <input type="password" placeholder="Password" />
                <button type="submit" onClick={handleLogin}>Login</button>
            </form>
            <button id="google-login" onClick={handleGoogleLogin}>Login with Google</button>
            <button id="amazon-login" onClick={handleAmazonLogin}>Login with Amazon</button>


            <button>Didn't have an account? <a href="#">Register</a></button>
        </div>
    );
}
export default Login;