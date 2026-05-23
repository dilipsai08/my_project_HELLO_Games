import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Components/Protected compo/api";
import completedSfx from "./completed.mp3";
import correctSfx from "./correct.mp3";
import wrongSfx from "./wrong.mp3";

const TIME = 60;
const OPS = ["+", "-", "*", "/"];
const btn = "w-full rounded-xl bg-orange-500 py-3 font-black uppercase text-white transition hover:bg-orange-400";
const panel = "rounded-xl border border-green-700/70 bg-green-950/50 p-5 text-center";
const gamePage =
    "relative flex min-h-screen items-center justify-center bg-linear-to-b from-green-950 via-[#062916] to-gray-950 p-4 text-white";
const leaveButton =
    "absolute left-4 top-4 rounded-lg border border-orange-400/30 bg-black/30 px-4 py-2 text-sm font-bold text-orange-300 hover:bg-orange-500 hover:text-white";
const gameCard =
    "w-full max-w-md rounded-2xl border border-orange-400/30 bg-[#082317] p-6 shadow-2xl";
const answerInput =
    "w-full rounded-xl border-2 border-green-700 bg-black/40 p-4 text-center text-3xl font-black text-yellow-300 placeholder:text-green-200/30 focus:border-orange-400 focus:outline-none";

function MathGame() {
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(0);
    const [started, setStarted] = useState(false);
    const [over, setOver] = useState(false);
    const [question, setQuestion] = useState({ a: 0, b: 0, op: "+", ans: 0 });
    const [given, setGiven] = useState("");
    const [best, setBest] = useState(() => Number(localStorage.getItem("math_flashcards_high_score") || 0));

    useEffect(() => {
        API.get("/api/check-auth")
            .then(res => setBest(prev => Math.max(prev, res.data.user?.high_score || 0)))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!started || over) return;
        const id = setInterval(() => setTime(t => t <= 1 ? 0 : t - 1), 1000);
        return () => clearInterval(id);
    }, [started, over]);

    useEffect(() => {
        if (started && time === 0 && !over) finishGame();
    }, [time, started, over]);

    function play(src) {
        new Audio(src).play().catch(() => {});
    }

    function makeQuestion() {
        const op = OPS[Math.floor(Math.random() * OPS.length)];
        let a = Math.floor(Math.random() * 12) + 1;
        const b = Math.floor(Math.random() * 12) + 1;
        if (op === "/") a *= b;
        const ans = op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b;
        setQuestion({ a, b, op, ans });
    }

    function startGame() {
        setScore(0);
        setTime(TIME);
        setOver(false);
        setStarted(true);
        setGiven("");
        makeQuestion();
    }

    function finishGame() {
        setOver(true);
        play(completedSfx);
        const high = Math.max(best, score);
        setBest(high);
        localStorage.setItem("math_flashcards_high_score", high);
        API.post("/api/update-high-score", { score }).catch(() => {});
    }

    function submit(e) {
        e.preventDefault();
        if (!given || over) return;
        const correct = Number(given) === question.ans;
        setScore(s => s + (correct ? 10 : -2));
        play(correct ? correctSfx : wrongSfx);
        setGiven("");
        makeQuestion();
    }

    return (
        <div className={gamePage}>
            <button onClick={() => navigate("/play")} className={leaveButton}>
                &lt;- Leave Game
            </button>

            <main className={gameCard}>
                <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-orange-300">Hello Games</p>
                <h1 className="mb-5 text-center text-3xl font-black uppercase text-yellow-400">Math Blitz</h1>

                <div className="mb-5 grid grid-cols-3 gap-3 text-center">
                    {[
                        ["Time", `${time}s`],
                        ["Score", score],
                        ["Best", best],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-black/25 p-3">
                            <p className="text-xs font-bold uppercase text-orange-200/80">{label}</p>
                            <p className="text-2xl font-black">{value}</p>
                        </div>
                    ))}
                </div>

                {!started && (
                    <div className="space-y-5">
                        <div className={panel}>
                            <p className="font-semibold">Solve quick math questions for 60 seconds.</p>
                            <p className="mt-2 text-sm text-green-100/70">Correct +10, wrong -2.</p>
                        </div>
                        <button onClick={startGame} className={btn}>Start Game</button>
                    </div>
                )}

                {started && !over && (
                    <form onSubmit={submit} className="space-y-5">
                        <div className="h-2 overflow-hidden rounded-full bg-black/40">
                            <div className="h-full rounded-full bg-orange-400" style={{ width: `${(time / TIME) * 100}%` }} />
                        </div>
                        <h2 className={`${panel} text-6xl font-black text-yellow-400`}>
                            {question.a} {question.op === "*" ? "x" : question.op} {question.b}
                        </h2>
                        <input value={given} onChange={e => setGiven(e.target.value)} autoFocus type="number" placeholder="Answer" className={answerInput} />
                        <button className={btn}>Submit</button>
                    </form>
                )}

                {over && (
                    <div className="space-y-5">
                        <div className={panel}>
                            <h2 className="text-3xl font-black uppercase text-orange-400">Time Up</h2>
                            <p className="mt-2 font-semibold">Final Score: <span className="text-yellow-400">{score}</span></p>
                            <p className="text-sm text-green-100/70">Best Score: <span className="text-yellow-400">{best}</span></p>
                        </div>
                        <button onClick={startGame} className={btn}>Play Again</button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default MathGame;
