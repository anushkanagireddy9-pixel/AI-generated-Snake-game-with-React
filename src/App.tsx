import React from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { motion } from 'motion/react';
import { Terminal, Cpu, Share2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 font-sans overflow-x-hidden p-4 md:p-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay" />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                 <div className="w-2 h-2 rounded-full bg-cyan-500" />
                 <div className="w-2 h-2 rounded-full bg-pink-500" />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-gray-500">Neural Distribution v2.04</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase whitespace-nowrap">
              Neon <span className="text-cyan-500 text-stroke-sm">Pulse</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-mono uppercase leading-none">Latency</span>
              <span className="text-xs font-mono text-green-400">12ms_STABLE</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-mono uppercase leading-none">Kernel</span>
              <span className="text-xs font-mono text-cyan-400">0xEF42A</span>
            </div>
          </div>
        </header>

        {/* Content Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Side Panel L: System Stats (Decorative) */}
          <div className="hidden xl:flex lg:col-span-2 flex-col gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Terminal size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Logs</span>
              </div>
              <div className="space-y-3 font-mono text-[9px] text-gray-500">
                <div className="flex justify-between">
                  <span>INIT_SYSTEM...</span>
                  <span className="text-green-500/50">OK</span>
                </div>
                <div className="flex justify-between">
                  <span>LOAD_ASSETS...</span>
                  <span className="text-green-500/50">OK</span>
                </div>
                <div className="flex justify-between">
                  <span>BOOT_MUSIC...</span>
                  <span className="text-yellow-500/50">WAIT</span>
                </div>
                <div className="flex justify-between">
                  <span>LINK_PLAYERS...</span>
                  <span className="text-cyan-500/50">SYNC</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Cpu size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Hardware</span>
              </div>
              <div className="h-12 w-full flex items-end gap-1">
                 {[40, 70, 45, 90, 65, 30, 80, 50].map((h, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, repeatType: "reverse" }}
                      className="flex-1 bg-cyan-500/20 rounded-t-sm"
                    />
                 ))}
              </div>
            </div>
          </div>

          {/* Center: Snake Game */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-[500px]">
               <SnakeGame />
            </div>
          </div>

          {/* Right: Music Player */}
          <div className="lg:col-span-12 xl:col-span-5 h-full">
            <div className="h-[600px]">
              <MusicPlayer />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5 opacity-50">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
            © 2026 NEON PULSE SYSTEMS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.1em] hover:text-cyan-400 transition-colors">
              <Share2 size={12} />
              Share Link
            </button>
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
