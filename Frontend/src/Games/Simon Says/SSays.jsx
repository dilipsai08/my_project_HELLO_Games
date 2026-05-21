import React, { useState, useEffect } from "react";
import correctMp3 from "./Correct.mp3";
import gameOverMp3 from "./GameOver.mp3";

const correctSound = new Audio(correctMp3);
const wrongSound = new Audio(gameOverMp3);

const color = ["red", "yellow", "blue", "green"];
const tailwindColors = {
    red: "bg-red-500",
    yellow: "bg-yellow-400",
    blue: "bg-blue-500",
    green: "bg-green-500",
};

function SimonSays() {
    const [seq, setseq] = useState([]);
    const [Useq, setUseq] = useState([]);
    const [Score, setScore] = useState(0);
    const [lvl, setlvl] = useState(0); 
    const [activeColor, setActiveColor] = useState(""); 
    const [isAuthorTapping, setIsAuthorTapping] = useState(false);

    useEffect(() => {
        initialize_game();
    }, []);

    useEffect(() => {
        if (seq.length > 0) {
            playSequence();
        }
    }, [seq]);


    async function playSequence() {
        setIsAuthorTapping(true);
        for (let i = 0; i < seq.length; i++) {
            await new Promise((res) => setTimeout(res, 500)); 
            setActiveColor(seq[i]);
            correctSound.cloneNode(true).play().catch(()=>console.log("audio error")); 
            await new Promise((res) => setTimeout(res, 500));
            setActiveColor(""); 
        }
        setIsAuthorTapping(false);
    }

    function initialize_game() {
        setseq([]); 
        setUseq([]);
        setScore(0);
        setlvl(0);
    }

    function handle_next_seq() {
        let idx = Math.floor(Math.random() * 4);
        setseq((prev) => {
            return [...prev, color[idx]]; 
        });
    }

    function handle_nxt_round() {
        handle_next_seq();
        setlvl((prev) => prev + 1);
        setUseq([]);
    }

    function handle_game_end() {
        initialize_game();
    }

    function handle_score(roundLength) {
        let temp = roundLength;
        if (lvl % 5 === 0 && lvl !== 0) {
            temp *= 5;
        }
        setScore((prev) => prev + temp);
    }

    function handle_tap(e) {
        if (isAuthorTapping || seq.length === 0) return;

        let tapped_color = e.target.name;        
        correctSound.cloneNode(true).play().catch(()=>console.log("audio error"));
        
        const tempseq = [...Useq, tapped_color];
        const idx = tempseq.length - 1;
        
        if (tempseq[idx] !== seq[idx]) {
            wrongSound.cloneNode(true).play().catch(()=>console.log("audio error"));

            let dyna_emoji = "😊";
            if (Score > 25 && Score < 50) {
                dyna_emoji = "🥳";
            } else if (Score >= 50 && Score < 100) {
                dyna_emoji = "🥳🎉";
            } else if(Score>=100){
                dyna_emoji = "Great! 🎉🎉🎉";
            }
            
            setTimeout(() => { 
                alert(`Wrong tap, Game Over🙃 And You Scored ${Score} points ${dyna_emoji}`);
                handle_game_end();
            }, 100);
            
            return;
        }

        if (tempseq.length === seq.length) {
            setUseq([]); 
            setTimeout(() => {
                handle_score(seq.length);
                handle_nxt_round();
            }, 800);
        } else {
            setUseq(tempseq); 
        }
    }

    return (
        <div className="flex flex-col items-center min-h-screen pt-16 font-sans bg-gray-900 text-gray-100">
            
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight">HELLO, Simon!</h1>
            
            <div className="flex gap-8 mb-8 text-2xl font-semibold">
                <h2>Level: {lvl}</h2>
                <h2>Score: {Score}</h2>
            </div>
            
            <button 
                onClick={handle_nxt_round} 
                className="px-6 py-3 mb-10 text-lg font-bold text-white transition-colors duration-200 bg-green-600 rounded-lg shadow-lg hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-800"
            >
                Start Game
            </button>

            <div className="grid grid-cols-2 gap-4 p-6 shadow-2xl bg-gray-800 rounded-full">
                {color.map((col) => (
                    <button
                        key={col}
                        name={col}
                        onClick={handle_tap}
                        className={`
                            w-36 h-36 border-4 border-gray-950 rounded-3xl transition-opacity duration-150
                            ${tailwindColors[col]} 
                            ${activeColor === col ? "opacity-100 scale-105" : "opacity-40"} 
                            ${isAuthorTapping ? "cursor-not-allowed" : "cursor-pointer hover:opacity-75"}
                        `}
                    />
                ))}
            </div>
        </div>
    );
}

export default SimonSays;