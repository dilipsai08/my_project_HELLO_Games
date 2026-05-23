import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'; 
import Header from '../Components/header';
import Footer from '../Components/footer';
import Dice from "../Games/Dice Roller/dice";
import MathGame from "../Games/Math Flashcards/maths_Fc";
import ReactSpeedGame from "../Games/Reaction Time Tester/reaction_speed";
import SimonSays from "../Games/Simon Says/SSays";
import MagmaMaze from "../Games/Magma Maze/magma_maze";
import SignUp from './Sign up';
import SignIn from './Sign in';
import PublicHome from './public_home';
import Home from '../Components/Protected compo/home';
import Profile from '../Components/Protected compo/profile';
import Play from '../Components/Protected compo/play';
import ProtectedRoute from './ProtectedRoute';
import About from './about';
import NewGamePraposal from '../Components/Protected compo/new_game_praposal';
import './my_style.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <PublicHome/>,
    },
    {
        path: '/sign-up',
        element: <SignUp />,
    },
    {
        path: '/sign-in',
        element: <SignIn />,
    },
    {
        path: '/home',
        element: <ProtectedRoute><Home/></ProtectedRoute>,
    },
    {
        path: '/play',
        element: <ProtectedRoute><Play/></ProtectedRoute>,
    },
    {
        path:'/profile',
        element:<ProtectedRoute><Profile/></ProtectedRoute>,
    },
    {
        path: '/submit-game',
        element: <ProtectedRoute><NewGamePraposal /></ProtectedRoute>,
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
        path:'/MagmaMaze',
        element:<ProtectedRoute><MagmaMaze/></ProtectedRoute>,
    },
    {
        path:'/about',
        element:<About/>
    },
    {
        path:"/publish",
        element:<ProtectedRoute><NewGamePraposal/></ProtectedRoute>,
    },
    {
        path :'*',
        element:<Navigate to="/" replace/>,
    }
]);

export default router;
