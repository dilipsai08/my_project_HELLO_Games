import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import API from "../../Components/Protected compo/api";
import SunlightOnTheTiles from './Sunlight_on_the_Tiles.mp3';
import GameWin from './Game_win.mp3';

const GRID_SIZE = 10;
const START_POS = { r: 9, c: 0 };
const EXIT_POS = { r: 0, c: 9 };
const gamePage =
  "relative min-h-screen bg-linear-to-b from-green-950 to-gray-950 flex flex-col items-center justify-center font-mono selection:bg-transparent";
const leaveButton =
  "absolute top-4 left-4 px-4 py-2 rounded-xl bg-black/40 border border-orange-500/20 text-[#ffc30b] font-bold hover:bg-[#ffc30b] hover:text-black transition-all duration-300 flex items-center gap-2 cursor-pointer z-50 text-sm";
const boardClass =
  "relative grid grid-cols-10 gap-1 bg-black p-2 border-4 border-[#b22222] shadow-[0_0_30px_rgba(178,34,34,0.3)]";
const endOverlay =
  "absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 text-center p-4";
const tileBase =
  "w-10 h-10 flex items-center justify-center transition-all duration-300";

const get_volcano_pos = (exi_vol = []) => {
  let r, c;
  let isSafe = false;
  while (!isSafe) {
    r = Math.floor(Math.random() * GRID_SIZE);
    c = Math.floor(Math.random() * GRID_SIZE);
    const dist_fSta = Math.abs(r - START_POS.r) + Math.abs(c - START_POS.c);
    const dist_fend = Math.abs(r - EXIT_POS.r) + Math.abs(c - EXIT_POS.c);
    const overlap = exi_vol.some(v => v.r === r && v.c === c);
    if (dist_fSta > 4 && dist_fend > 4 && !overlap) isSafe = true;
  }
  return { r, c };
};

const initialize_game = () => {
  const firstVolcano = get_volcano_pos();
  const secondVolcano = get_volcano_pos([firstVolcano]);
  const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  grid[firstVolcano.r][firstVolcano.c] = 1;
  grid[secondVolcano.r][secondVolcano.c] = 1;
  return { grid, volcanoes: [firstVolcano, secondVolcano] };
};

function MagmaMaze() {
  const navigate = useNavigate();
  const [playerPos, setPlayerPos] = useState(START_POS);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'win', 'lose'
  const [stage, setStage] = useState(1);
  const initialGame = useRef(initialize_game());
  const [lavaGrid, setLavaGrid] = useState(initialGame.current.grid);
  const [volcanoes, setVolcanoes] = useState(initialGame.current.volcanoes);
  const bgAudioRef = useRef(null);
  const winAudioRef = useRef(null);
  const [timer, setTimer] = useState(0);
  const [score, setscore] = useState(0);
  const [moves, setmoves] = useState(0);

  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('magma_maze_high_score') || '0', 10);
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
    const localHighScore = parseInt(localStorage.getItem('magma_maze_high_score') || '0', 10);
    const newHigh = Math.max(localHighScore, finalScore, highScore);
    setHighScore(newHigh);
    localStorage.setItem('magma_maze_high_score', newHigh.toString());

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

  const handle_audio = useCallback(() => {
    if (!bgAudioRef.current) {
      bgAudioRef.current = new Audio(SunlightOnTheTiles);
      bgAudioRef.current.loop = true;
      bgAudioRef.current.volume = 0.5;
    }

    if (!winAudioRef.current) {
      winAudioRef.current = new Audio(GameWin);
      winAudioRef.current.loop = false;
      winAudioRef.current.volume = 0.8;
    }

    if (gameState === 'playing') {
      winAudioRef.current.pause();
      winAudioRef.current.currentTime = 0;
      bgAudioRef.current.play().catch(() => { });
      return;
    }

    bgAudioRef.current.pause();
    bgAudioRef.current.currentTime = 0;

    if (gameState === 'win') {
      winAudioRef.current.currentTime = 0;
      winAudioRef.current.play().catch(() => { });
    }
  }, [gameState]);

  useEffect(() => {
    handle_audio();

    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current.currentTime = 0;
      }
      if (winAudioRef.current) {
        winAudioRef.current.pause();
        winAudioRef.current.currentTime = 0;
      }
    };
  }, [handle_audio]);

  const handle_score = useCallback((currentMoves) => {
    let temp = 900 - 25 * (currentMoves - 9) - 20 * (timer - 7);
    return Math.max(50, temp);
  }, [timer]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const eruptionInterval = setInterval(() => {
      setLavaGrid((prevGrid) => {
        const newGrid = prevGrid.map(row => [...row]);
        const spreadProbability = stage === 1 ? 0.2 : stage === 2 ? 0.6 : 0.8;

        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (prevGrid[r][c] === 1) {
              const neighbors = [
                { dr: -1, dc: 0 }, { dr: 1, dc: 0 },
                { dr: 0, dc: -1 }, { dr: 0, dc: 1 }
              ];

              neighbors.forEach(({ dr, dc }) => {
                const nr = r + dr;
                const nc = c + dc;

                if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && prevGrid[nr][nc] === 0) {
                  if (Math.random() < spreadProbability) {
                    newGrid[nr][nc] = 1;
                  }
                }
              });
            }
          }
        }
        return newGrid;
      });

      setStage(prev => prev + 1);
    }, 1200);

    return () => clearInterval(eruptionInterval);
  }, [gameState, stage]);

  useEffect(() => {
    if (gameState === 'playing' && lavaGrid[playerPos.r][playerPos.c] === 1) {
      setGameState('lose');
    }
  }, [lavaGrid, playerPos, gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const cntr = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(cntr);
  }, [gameState]);

  const handleKeyDown = useCallback((e) => {
    if (gameState !== 'playing') return;

    let { r, c } = playerPos;
    if (e.key === 'ArrowUp' || e.key === "w" || e.key === "W") r--;
    if (e.key === 'ArrowDown' || e.key === "s" || e.key === "S") r++;
    if (e.key === 'ArrowLeft' || e.key === "a" || e.key === "A") c--;
    if (e.key === 'ArrowRight' || e.key === "d" || e.key === "D") c++;

    if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
      setPlayerPos({ r, c });
      const newMoves = moves + 1;
      setmoves(newMoves);

      if (r === EXIT_POS.r && c === EXIT_POS.c) {
        const finalScore = handle_score(newMoves);
        setscore(finalScore);
        setGameState('win');
        updateHighScore(finalScore);
      }
      else if (lavaGrid[r][c] === 1) {
        setGameState('lose');
      }
    }
  }, [playerPos, gameState, lavaGrid, moves, handle_score, highScore]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const resetGame = useCallback(() => {
    const nextGame = initialize_game();
    setLavaGrid(nextGame.grid);
    setVolcanoes(nextGame.volcanoes);
    setPlayerPos(START_POS);
    setStage(1);
    setTimer(0);
    setmoves(0);
    setscore(0);
    setGameState('playing');
  }, []);

  return (
    <div className={gamePage}>
      
      {/* Elegant Floating Escape Button */}
      <button 
        onClick={() => navigate("/play")}
        className={leaveButton}
      >
        ← Leave Game
      </button>

      <div className="w-full max-w-md flex justify-between items-center mb-6 text-[#ffc30b]">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wider drop-shadow-md">MAGMA MAZE</h1>
          <p className="text-xs font-bold text-[#ff8c00]/80 mt-1">HIGH SCORE: {highScore}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[#ff8c00]">STAGE: {stage}</p>
        </div>
      </div>

      <div className={boardClass}>

        {gameState !== 'playing' && (
          <div className={endOverlay}>
            <h2 className={`text-4xl font-bold mb-4 ${gameState === 'win' ? 'text-[#ffc30b]' : 'text-[#b22222]'}`}>
              {gameState === 'win' ? 'YOU ESCAPED!' : 'INCINERATED.'}
            </h2>
            {gameState === 'win' && (
              <p className="text-white mb-4">Score: {score} | Moves: {moves} | Time: {timer}s</p>
            )}
            <p className="text-[#ffc30b] text-sm font-bold mb-4">YOUR HIGH SCORE: {highScore}</p>
            <button onClick={resetGame} className="px-6 py-2 bg-[#ff8c00] text-black font-bold hover:bg-[#ffc30b] transition-colors">
              PLAY AGAIN
            </button>
          </div>
        )}

        {lavaGrid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isPlayer = rIdx === playerPos.r && cIdx === playerPos.c;
            const isExit = rIdx === EXIT_POS.r && cIdx === EXIT_POS.c;
            const isVolcano = volcanoes.some(v => v.r === rIdx && v.c === cIdx);

            return (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`${tileBase}
                  ${isPlayer ? 'bg-[#ffc30b] shadow-[0_0_15px_#ffc30b] z-10 scale-110 rounded-sm' : ''}
                  ${!isPlayer && isExit ? 'bg-white shadow-[0_0_15px_white] animate-pulse' : ''}
                  ${!isPlayer && !isExit && cell === 1 ? 'bg-[#b22222] shadow-[inset_0_0_10px_#5a0000]' : ''}
                  ${!isPlayer && !isExit && cell === 0 ? 'bg-[#1a3b2b]' : ''}
                  ${isVolcano && !isPlayer ? 'animate-bounce border-2 border-black' : ''}
                `}
              >
                {isVolcano && !isPlayer && !isExit && <span className="text-black text-xs font-bold">V</span>}
              </div>
            );
          })
        )}
      </div>

      <p className="mt-6 text-[#ff8c00] font-bold text-sm">
        Use arrow keys to move. (Moves: {moves})
      </p>

    </div>
  );
}

export default MagmaMaze;
