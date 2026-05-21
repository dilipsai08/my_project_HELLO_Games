import React, { useState, useEffect } from "react";

function ReactSpeedGame() {
  const [status, setStatus] = useState("menu"); 
  const [timeTaken, setTimeTaken] = useState(0);
  const [score, setScore] = useState(0);
  
  const [timerId, setTimerId] = useState(null); 
  const [startTime, setStartTime] = useState(0); 

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
      if (timeInSeconds >= 1.0) {
        setScore(0);
      } else {
        let mathScore = 1000 * Math.pow(1 - timeInSeconds, 1.2);
        setScore(Math.floor(mathScore)); 
      }

      setStatus("result"); 
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white font-mono p-4 m-0">
      
      <div className="bg-gray-800 border-4 border-gray-700 rounded-xl p-8 text-center max-w-md w-full shadow-2xl">
        <h1 className="text-orange-500 text-3xl font-bold tracking-widest uppercase mb-8 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">
        HELLO, REFLEX!
        </h1>

        <div className="flex justify-center space-x-3 mb-8">
          {[1, 2, 3, 4, 5].map((num) => (
            <div 
              key={num} 
              className={`w-12 h-12 rounded-full border-4 border-black transition-colors duration-75
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
              <h2 className="text-green-400 text-4xl font-bold">Score: {score}</h2>
            </div>
          )}

        </div>

        <button 
          onClick={handleAction}
          className={`w-full font-bold text-2xl py-5 rounded-lg uppercase tracking-wider transition-all duration-200 text-white shadow-lg
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