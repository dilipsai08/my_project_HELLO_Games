import React from "react";
import { createRoot } from "react-dom/client";
// import Dice from "../Games/Dice Roller/dice";
import "../public/my_style.css";
// import MathGame from "../Games/Math Flashcards/maths_Fc";
// import ReactSpeedGame from "../Games/Reaction Time Tester/reaction_speed";
// import SimonSays from "../Games/Simon Says/SSays";
// import LavaEscape from "../Games/Lava/lava";
// import { RouterProvider } from "react-router-dom";
// import router from "./app.jsx";
// import About from './about';
// import Profile from "../Components/Protected compo/profile";
// import Home_page from "../Components/Protected compo/home";
import NewGamePraposal from "../Components/Protected compo/new_game_praposal";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NewGamePraposal />
  </React.StrictMode>
);