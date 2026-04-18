import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';
import { Point, GameStatus } from '../types';
import confetti from 'canvas-confetti';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;
const MIN_SPEED = 60;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const nextDirection = useRef<Point>({ x: 0, y: -1 });

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection({ x: 0, y: -1 });
    nextDirection.current = { x: 0, y: -1 };
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setStatus('PLAYING');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) nextDirection.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (direction.y === 0) nextDirection.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (direction.x === 0) nextDirection.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (direction.x === 0) nextDirection.current = { x: 1, y: 0 };
          break;
        case ' ':
          if (status === 'IDLE' || status === 'GAME_OVER') resetGame();
          else if (status === 'PLAYING') setStatus('PAUSED');
          else if (status === 'PAUSED') setStatus('PLAYING');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, status]);

  const handleGameOver = useCallback(() => {
    setStatus('GAME_OVER');
    if (score > highScore && score > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ffff', '#ff00ff', '#ffffff']
      });
    }
  }, [score, highScore]);

  useEffect(() => {
    if (status !== 'PLAYING') return;

    const move = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newDirection = nextDirection.current;
        setDirection(newDirection);
        
        const newHead = {
          x: (head.x + newDirection.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + newDirection.y + GRID_SIZE) % GRID_SIZE,
        };

        // Collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
          setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(move, speed);
    return () => clearInterval(interval);
  }, [status, food, speed, generateFood]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid (subtle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Snake
    snake.forEach((segment, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#00ffff' : '#00ccff';
      ctx.shadowBlur = isHead ? 20 : 10;
      ctx.shadowColor = '#00ffff';
      
      const padding = 1;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative group">
      {/* Floating Label */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20">
        <div className="px-4 py-1 border border-cyan-500/50 bg-black/50 backdrop-blur-sm">
          <span className="text-cyan-400 font-mono text-sm tracking-[0.2em]">snake game</span>
        </div>
      </div>

      <div className="relative p-5 bg-gray-900/80 rounded-2xl border border-cyan-500/20 backdrop-blur-xl shadow-[0_0_50px_rgba(0,255,255,0.05)] overflow-hidden">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* Game Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-cyan-400 font-mono text-[10px] tracking-[0.4em] font-bold">SYSTEM.SNAKE_GAME</h2>
            <div className="flex gap-6 mt-2">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Current Score</span>
                <span className="text-3xl font-mono text-cyan-400 font-black tracking-[0.1em]">{score.toString().padStart(4, '0')}</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-6 gap-1">
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">High Score</span>
                <span className="text-3xl font-mono text-pink-500 font-black tracking-[0.1em]">{highScore.toString().padStart(4, '0')}</span>
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1">Status</span>
            <span className={`text-[10px] font-mono tracking-[0.2em] font-black px-2 py-0.5 rounded border ${
              status === 'PLAYING' ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'
            }`}>
              {status}
            </span>
          </div>
        </div>

      {/* Canvas Area */}
      <div className="relative overflow-hidden rounded-lg bg-black border border-cyan-500/20">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full max-w-[400px] aspect-square block"
        />

        <AnimatePresence>
          {status !== 'PLAYING' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm"
            >
              {status === 'IDLE' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-mono text-cyan-400 tracking-[0.4em] font-black drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">READY PLAYER ONE</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold">Use arrows to move & space to play</p>
                  </div>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-3 mx-auto px-12 py-4 bg-cyan-400 text-black font-black uppercase tracking-[0.4em] text-sm group/btn transition-all hover:bg-cyan-300 shadow-[0_0_40px_rgba(34,211,238,0.4)] relative"
                  >
                    <div className="absolute -inset-1 bg-cyan-400/20 blur-lg group-hover/btn:bg-cyan-400/40 transition-all" />
                    <Play size={16} fill="currentColor" className="relative z-10" />
                    <span className="relative z-10">Start Link</span>
                  </button>
                </div>
              )}

              {status === 'PAUSED' && (
                <div className="space-y-6">
                  <h3 className="text-4xl font-mono text-cyan-400 italic">SYSTEM_PAUSED</h3>
                  <button
                    onClick={() => setStatus('PLAYING')}
                    className="px-8 py-3 border border-cyan-500 text-cyan-500 font-bold uppercase tracking-widest rounded-full hover:bg-cyan-500/10 transition-colors"
                  >
                    Resume
                  </button>
                </div>
              )}

              {status === 'GAME_OVER' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-mono text-pink-500 uppercase italic">Connection.Lost</h3>
                    <p className="text-xl text-cyan-300 font-mono tracking-tight">Final Score: {score}</p>
                  </div>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 mx-auto px-8 py-3 bg-pink-500 text-white font-bold uppercase tracking-widest rounded-full hover:bg-pink-400 transition-colors shadow-[0_0_20px_rgba(236,72,153,0.4)]"
                  >
                    <RotateCcw size={18} />
                    Respawn
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Instructions footer */}
      <div className="mt-4 flex justify-between items-center text-[10px] text-gray-500 font-mono uppercase tracking-widest">
        <span>[SPACE] PAUSE/PLAY</span>
        <span>[ARROWS] NAVIGATION</span>
        <div className="flex items-center gap-1 text-cyan-500">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          ACTIVE_SESSION
        </div>
      </div>
      </div>
    </div>
  );
};
