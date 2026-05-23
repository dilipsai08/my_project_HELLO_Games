import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Components/Protected compo/api";

const gamePage =
  "relative flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-green-950 to-gray-950 text-white font-mono p-4 m-0";
const leaveButton =
  "absolute top-4 left-4 px-4 py-2 rounded-xl bg-black/40 border border-orange-500/20 text-orange-400 font-bold hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer z-50 text-sm";
const gameCard =
  "bg-gray-800 border-4 border-gray-700 rounded-xl p-8 text-center max-w-md w-full shadow-2xl";
const lightBase =
  "w-12 h-12 rounded-full border-4 border-black transition-colors duration-75";
const actionButton =
  "w-full font-bold text-2xl py-5 rounded-lg uppercase tracking-wider transition-all duration-200 text-white shadow-lg";

function ReactSpeedGame() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("menu"); 
  const [timeTaken, setTimeTaken] = useState(0);
  const [score, setScore] = useState(0);
  
  const [timerId, setTimerId] = useState(null); 
  const [startTime, setStartTime] = useState(0); 

  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('reaction_time_high_score') || '0', 10);
  });

  // Fetch current high score on mount from backend if available
  useEffect(() => {
    API.get("/api/check-auth")
      .then(res => {
        if (res.data.isAuthenticated && res.data.user) {
          const backendHighScore = res.data.user.high_score || 0;
          setHighScore(prev => Math.max(prev, backendHighScore));
        }
      })
      .catch(err => {
        console.log("Could not fetch high score from server, using local storage", err);
      });
  }, []);

  const updateHighScore = (finalScore) => {
    const localHighScore = parseInt(localStorage.getItem('reaction_time_high_score') || '0', 10);
    const newHigh = Math.max(localHighScore, finalScore, highScore);
    setHighScore(newHigh);
    localStorage.setItem('reaction_time_high_score', newHigh.toString());

    API.post("/api/update-high-score", { score: finalScore })
    .then(res => {
      console.log("High score updated on server:", res.data);
      if (res.data && typeof res.data.highScore === 'number') {
        setHighScore(prev => Math.max(prev, res.data.highScore));
      }
    })
    .catch(err => {
      console.error("Failed to update high score on server:", err);
    });
  };

  function handleAction() {
    if (status === "menu" || status === "result" || status === "early") {
      setStatus("red");
      setScore(0);
      setTimeTaken(0);

      const randomWaitTime = Math.floor(Math.random() * 5000) + 1000; 

      const newTimerId = setTimeout(() => {
        setStatus("green");
        setStartTime(Date.now()); 
      }, randomWaitTime);

      setTimerId(newTimerId); 
    } 
    else if (status === "red") {
      clearTimeout(timerId); 
      setStatus("early");
    } 
    else if (status === "green") {
      const reactionTimeMs = Date.now() - startTime;
      setTimeTaken(reactionTimeMs);

      let timeInSeconds = reactionTimeMs / 1000;
      let finalScore = 0;
      if (timeInSeconds < 1.0) {
        let mathScore = 1000 * Math.pow(1 - timeInSeconds, 1.2);
        finalScore = Math.floor(mathScore);
      }
      setScore(finalScore);
      setStatus("result"); 
      updateHighScore(finalScore);
    }
  }

  useEffect(() => {
    function checkKey(event) {
      if (event.key === " " || event.key === "5" || event.key === "k" || event.key === "K") {
        event.preventDefault(); 
        handleAction(); 
      }
    }
    window.addEventListener("keydown", checkKey);
    return () => window.removeEventListener("keydown", checkKey);
  }, [status, timerId, startTime]); 


  return (
    <div className={gamePage}>
      
      {/* Elegant Floating Escape Button */}
      <button 
        onClick={() => navigate("/play")}
        className={leaveButton}
      >
        ← Leave Game
      </button>
      
      <div className={gameCard}>
        <h1 className="text-orange-500 text-3xl font-bold tracking-widest uppercase mb-2 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">
        HELLO, REFLEX!
        </h1>
        <p className="text-yellow-400 text-sm font-bold tracking-wide uppercase mb-6">
          High Score: {highScore}
        </p>

        <div className="flex justify-center space-x-3 mb-8">
          {[1, 2, 3, 4, 5].map((num) => (
            <div 
              key={num} 
              className={`${lightBase}
                ${status === 'red' ? 'bg-red-600 shadow-[0_0_20px_#dc2626]' : 
                  status === 'green' ? 'bg-green-500 shadow-[0_0_20px_#22c55e]' : 
                  'bg-gray-900'}
              `}
            ></div>
          ))}
        </div>

        <div className="bg-black border-2 border-gray-600 rounded-lg h-40 flex flex-col items-center justify-center mb-8 shadow-inner">
          
          {status === "menu" && (
             <p className="text-gray-400 text-lg">Press button to start</p>
          )}

          {status === "red" && (
            <h2 className="text-red-500 text-5xl font-bold tracking-widest">WAIT...</h2>
          )}

          {status === "early" && (
            <h2 className="text-yellow-400 text-4xl font-bold underline drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">FALSE START!</h2>
          )}

          {status === "green" && (
            <h2 className="text-green-500 text-5xl font-bold tracking-widest drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">GO!</h2>
          )}

          {status === "result" && (
            <div className="animate-pulse">
              <p className="text-white text-2xl mb-2">Time: <span className="text-yellow-400">{timeTaken} ms</span></p>
              <h2 className="text-green-400 text-4xl font-bold mb-2">Score: {score}</h2>
              <p className="text-yellow-400 text-sm font-bold">HIGH SCORE: {highScore}</p>
            </div>
          )}

        </div>

        <button 
          onClick={handleAction}
          className={`${actionButton}
            ${status === "menu" || status === "early" || status === "result" 
                ? "bg-orange-600 hover:bg-orange-500 hover:shadow-[0_0_15px_#ea580c]" 
                : "bg-red-600 hover:bg-red-500"}
          `}
        >
          {status === "menu" ? "START ENGINE" : 
           status === "red" || status === "green" ? "TAP TO STOP!" : 
           "PLAY AGAIN"}
        </button>

        <p className="text-gray-400 text-sm mt-5">
          Or press <span className="font-bold text-yellow-500">Spacebar</span>, <span className="font-bold text-yellow-500">5</span>, or <span className="font-bold text-yellow-500">K</span>
        </p>

      </div>
    </div>
  );
}

export default ReactSpeedGame;
