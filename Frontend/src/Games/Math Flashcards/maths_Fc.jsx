import React, { useState, useEffect } from "react";
import completedSfx from "./completed.mp3";
import correctSfx from "./correct.mp3";
import wrongSfx from "./wrong.mp3";

const Total_time = 60;
const math_operators = ["+", "-", "*", "/"];

function MathGame() {
    const [score, setscore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [ans, setans] = useState(null);
    const [gvnANS, setgvnANS] = useState("");
    const [num1, setnum1] = useState(0);
    const [num2, setnum2] = useState(0);
    const [Operator, setOperator] = useState("");

    function initialize_game() {
        setscore(0);
        setGameOver(false);
        setGameStarted(true);
        setTimeLeft(Total_time);
        setgvnANS("");
        handle_question();
    }

    function playSound(e) {
        let src = "";
        if (e === "correct") {
            src = correctSfx;
        } else if (e === "wrong") {
            src = wrongSfx;
        } else if (e === "completed") {
            src = completedSfx;
        }
        if (!src) return;
        const audio = new Audio(src);
        audio.play().catch(() => {});
    }

    useEffect(() => {
        if (!gameStarted || gameOver) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameStarted, gameOver]);

    useEffect(() => {
        if (gameStarted && timeLeft === 0 && !gameOver) {
            setGameOver(true);
            playSound("completed");
        }
    }, [timeLeft, gameStarted, gameOver]);

    function handle_submission(e) {
        e.preventDefault();
        if (gameOver || !gameStarted) return;
        if (gvnANS === "") return;

        if (Number(gvnANS) === ans) {
            setscore((prev) => prev + 10);
            playSound("correct");
        } else {
            setscore((prev) => prev - 2);
            playSound("wrong");
        }

        setgvnANS("");
        handle_question();
    }

    function handle_input(e) {
        let temp = e.target.value;
        setgvnANS(temp);
    }

    function handle_question() {
        let oper = math_operators[Math.floor(Math.random() * 4)];
        let nu1 = Math.floor(Math.random() * 12 + 1);
        let nu2 = Math.floor(Math.random() * 12 + 1);

        if (oper === "/") {
            nu1 = nu1 * nu2;
        }

        setnum1(nu1);
        setnum2(nu2);
        setOperator(oper);

        if (oper === "+") setans(nu1 + nu2);
        else if (oper === "-") setans(nu1 - nu2);
        else if (oper === "*") setans(nu1 * nu2);
        else setans(nu1 / nu2);
    }

    return (
        <div style={{ textAlign: "center", fontFamily: "sans-serif", marginTop: "50px" }}>
            <h1>60-Second Math Blitz</h1>

            {!gameStarted && (
                <div>
                    <h2>Ready to test your math skills?</h2>
                    <button onClick={initialize_game} style={{ fontSize: "1.5rem", padding: "10px 30px", cursor: "pointer" }}>
                        Start Game
                    </button>
                </div>
            )}

            {gameStarted && !gameOver && (
                <div>
                    <h2>Time Left: {timeLeft}s</h2>
                    <h3>Score: {score}</h3>
                    <form onSubmit={handle_submission}>
                        <h1 style={{ fontSize: "3rem" }}>
                            {num1} {Operator} {num2} = ?
                        </h1>
                        <input
                            type="number"
                            value={gvnANS}
                            onChange={handle_input}
                            autoFocus
                            style={{ fontSize: "2rem", width: "150px", textAlign: "center" }}
                        />
                        <br /><br />
                        <button type="submit" style={{ fontSize: "1.2rem", padding: "10px 20px" }}>
                            Submit
                        </button>
                    </form>
                </div>
            )}

            {gameOver && (
                <div>
                    <h2>Game Over! Your final score is {score}.</h2>
                    <button onClick={initialize_game} style={{ fontSize: "1.5rem", padding: "10px 30px", cursor: "pointer" }}>
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
}

export default MathGame;