import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'; 
import Header from '../Components/header';
import Footer from '../Components/footer';
import Dice from "../Games/Dice Roller/dice";
import MathGame from "../Games/Math Flashcards/maths_Fc";
import ReactSpeedGame from "../Games/Reaction Time Tester/reaction_speed";
import SimonSays from "../Games/Simon Says/SSays";
import LavaEscape from "../Games/Lava/lava";
import axios from 'axios';
import SignUp from './Sign up';
import Login from './login';
import Home from '../Components/Protected compo/home';
import Profile from '../Components/Protected compo/profile';
import ProtectedRoute from './ProtectedRoute';
import About from './about';
import './my_style.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Login/>,
    },
    {
        path: '/sign-up',
        element: <SignUp />,
    },
    {
        path: '/log-in',
        element: <Login />,
    },
    {
        path: '/home',
        element: <ProtectedRoute><Home/></ProtectedRoute>,
    },
    {
        path:'/profile',
        element:<ProtectedRoute><Profile/></ProtectedRoute>,
    },
    {
        path:'/Dice',
        element:<ProtectedRoute><Dice/></ProtectedRoute>,
    },
    {
        path:'/MathGame',
        element:<ProtectedRoute><MathGame/></ProtectedRoute>,
    },
    {
        path:'/ReactSpeedGame',
        element:<ProtectedRoute><ReactSpeedGame/></ProtectedRoute>,
    },
    {
        path:'/SimonSays',
        element:<ProtectedRoute><SimonSays/></ProtectedRoute>,
    },
    {
        path:'/LavaEscape',
        element:<ProtectedRoute><LavaEscape/></ProtectedRoute>,
    },
    {
        path:'/about',
        element:<About/>
    },
    {
        path :'*',
        element:<Navigate to="/" replace/>,
    }
]);

export default router;