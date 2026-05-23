import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const gamePage =
    "relative h-dvh w-full bg-[#013220] flex items-center justify-center font-sans text-white p-4 overflow-hidden box-border";
const leaveButton =
    "absolute top-4 left-4 px-4 py-2 rounded-xl bg-black/40 border border-orange-500/20 text-orange-400 font-bold hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer z-50 text-sm";
const gamePanel =
    "bg-[#002200] p-6 rounded-2xl border-2 border-[#FFA500] shadow-2xl w-full max-w-[400px] max-h-full flex flex-col justify-between";
const scoreBox =
    "p-3 rounded-xl flex-1 border-2 text-center transition-all duration-300 ease-in-out";
const rollButton =
    "w-full py-3 mt-2 text-xl font-bold text-white bg-[#FF3B3F] rounded-xl shadow-[0_4px_15px_rgba(255,59,63,0.4)] transition-all duration-100 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:ring-offset-2 focus:ring-offset-[#002200]";

const MAX_TURNS = 5;
const TURN_TIME = 7;
const Dice_faces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

const WinnerText = ({ winner }) => {
    const msg = useMemo(() => {
        if (winner === "tie") {
            return `It's a tie! 🤝`;
        } else if (winner) {
            return `Player ${winner} wins! 🎉`;
        } else {
            return `Player 1 starts!`;
        }
    }, [winner]);
    
    return <p className="text-lg font-bold text-[#FFA500] m-0">{msg}</p>;
};
const Dice = () => {
    const navigate = useNavigate();
    const [p1, setp1] = useState(0);
    const [p2, setp2] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TURN_TIME);
    const [gameOver, setGameOver] = useState(false);
    const [isRolling, setIsRolling] = useState(false);
    const [winner, setWinner] = useState(null);
    const [p1_turns, setp1_turns] = useState(0);
    const [p2_turns, setp2_turns] = useState(0);
    const [animFace, setAnimFace] = useState(null);

    useEffect(() => {
        if (isRolling || gameOver || timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [isRolling, gameOver, timeLeft]);

    useEffect(() => {
        if (timeLeft === 0 && !gameOver && !isRolling) handle_timeout();
    }, [timeLeft, gameOver, isRolling]);

    function initialize_game() {
        setp1(0); setp2(0); setp1_turns(0); setp2_turns(0);
        setCurrentPlayer(0); setTimeLeft(TURN_TIME);
        setGameOver(false); setIsRolling(false); setWinner(null); setAnimFace(null);
    }

    useEffect(() => initialize_game(), []);

    function handle_game_over(score1, score2) {
        setGameOver(true);
        if (score1 > score2) setWinner(1);
        else if (score2 > score1) setWinner(2);
        else setWinner("tie");
    }

    function handle_timeout() {
        const isP1 = currentPlayer === 0;
        const newP1Turns = p1_turns + (isP1 ? 1 : 0);
        const newP2Turns = p2_turns + (!isP1 ? 1 : 0);

        if (isP1) setp1_turns(newP1Turns);
        else setp2_turns(newP2Turns);

        if (newP1Turns >= MAX_TURNS && newP2Turns >= MAX_TURNS) handle_game_over(p1, p2); 
        else {
            setCurrentPlayer((prev) => (prev === 0 ? 1 : 0));
            setTimeLeft(TURN_TIME);
        }
    }

    function handle_tap() {
        if (gameOver || isRolling) return;
        const isP1 = currentPlayer === 0;
        if ((isP1 && p1_turns >= MAX_TURNS) || (!isP1 && p2_turns >= MAX_TURNS)) return;

        setIsRolling(true);
        let cnt = 0;
        const rollAnimation = setInterval(() => {
            setAnimFace(Dice_faces[Math.floor(Math.random() * 6)]);
            cnt++;

            if (cnt >= 10) {
                clearInterval(rollAnimation);
                const rolled = Math.floor(Math.random() * 6) + 1;
                setAnimFace(Dice_faces[rolled - 1]);

                let newP1Score = p1, newP2Score = p2;
                let newP1Turns = p1_turns, newP2Turns = p2_turns;

                if (isP1) {
                    newP1Score = p1 + rolled;
                    newP1Turns = p1_turns + 1;
                    setp1(newP1Score); setp1_turns(newP1Turns);
                } else {
                    newP2Score = p2 + rolled;
                    newP2Turns = p2_turns + 1;
                    setp2(newP2Score); setp2_turns(newP2Turns);
                }

                setIsRolling(false);

                if (newP1Turns >= MAX_TURNS && newP2Turns >= MAX_TURNS) {
                    handle_game_over(newP1Score, newP2Score);
                } else {
                    setCurrentPlayer((prev) => (prev === 0 ? 1 : 0));
                    setTimeLeft(TURN_TIME);
                }
            }
        }, 60);
    }

    return (
        <div className={gamePage}>
            
            {/* Elegant Floating Escape Button */}
            <button 
                onClick={() => navigate("/play")}
                className={leaveButton}
            >
                ← Leave Game
            </button>
            
            <div className={gamePanel}>
                
                <div>
                    <h1 className="text-2xl font-bold text-[#FFD700] m-0 mb-4 tracking-wide text-center">
                        HELLO, Dice Duel!
                    </h1>
                    
                    <div className="flex justify-between space-x-3">
                        <div className={`${scoreBox} ${
                            currentPlayer === 0 && !gameOver 
                                ? "border-[#FF3B3F] bg-[rgba(255,59,63,0.15)] shadow-[0_0_10px_rgba(255,59,63,0.3)]" 
                                : "border-[#003300] bg-black/20"
                        }`}>
                            <h3 className="text-[#FFA500] text-sm md:text-base font-semibold m-0 mb-1">Player 1 Score</h3>
                            <div className="text-3xl text-[#FFD700] font-bold leading-none">{p1}</div>
                            <div className="text-xs mt-1 text-gray-400 font-medium">Turns: {p1_turns}/{MAX_TURNS}</div>
                        </div>
                        
                        <div className={`${scoreBox} ${
                            currentPlayer === 1 && !gameOver 
                                ? "border-[#FF3B3F] bg-[rgba(255,59,63,0.15)] shadow-[0_0_10px_rgba(255,59,63,0.3)]" 
                                : "border-[#003300] bg-black/20"
                        }`}>
                            <h3 className="text-[#FFA500] text-sm md:text-base font-semibold m-0 mb-1">Player 2 Score</h3>
                            <div className="text-3xl text-[#FFD700] font-bold leading-none">{p2}</div>
                            <div className="text-xs mt-1 text-gray-400 font-medium">Turns: {p2_turns}/{MAX_TURNS}</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center min-h-[140px] py-4">
                    <div className="text-[80px] leading-none text-[#FFD700] drop-shadow-[0_4px_10px_rgba(255,215,0,0.3)] select-none">
                        {animFace || "🎲"}
                    </div>
                    
                    <div className="h-[30px] flex items-center justify-center mt-2">
                        <WinnerText winner={winner} />
                    </div>
                </div>

                <div>
                    <div className={`h-[30px] text-lg font-bold tracking-wide transition-colors duration-200 flex items-center justify-center ${
                        gameOver ? "opacity-0" : timeLeft <= 3 ? "text-[#FF3B3F]" : "text-[#FFA500]"
                    }`}>
                        {!gameOver && `Time Left: ${timeLeft}s`}
                    </div>

                    <button 
                        onClick={gameOver ? initialize_game : handle_tap}
                        disabled={isRolling}
                        className={rollButton}
                    >
                        {gameOver ? "Play Again" : isRolling ? "Rolling..." : `P${currentPlayer + 1} Roll`}
                    </button>
                </div>
                
            </div>
        </div>
    );
};

export default Dice;
