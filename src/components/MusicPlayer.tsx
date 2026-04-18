import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Music,
  ListMusic,
  Activity,
  Disc
} from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'AI Gen Sync',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Neural Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425
  },
  {
    id: '3',
    title: 'Synth Horizon',
    artist: 'Silicon Soul',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 312
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
      setProgress(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrackIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = audioRef.current ? audioRef.current.currentTime : 0;
  const duration = audioRef.current ? audioRef.current.duration || currentTrack.duration : currentTrack.duration;

  return (
    <div className="w-full h-full flex flex-col bg-black/40 backdrop-blur-2xl rounded-3xl border border-pink-500/20 overflow-hidden shadow-[0_0_40px_rgba(236,72,153,0.05)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />

      {/* Album Art / Visualizer Area */}
      <div className="relative flex-1 p-6 flex items-center justify-center overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-0 -left-20 w-64 h-64 bg-pink-600/10 blur-[80px] rounded-full" />
        <div className="absolute bottom-0 -right-20 w-64 h-64 bg-cyan-600/10 blur-[80px] rounded-full" />
        
        <div className="relative z-10 text-center space-y-6">
          <motion.div
            animate={{ 
              rotate: isPlaying ? 360 : 0,
              scale: isPlaying ? [1, 1.05, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-48 h-48 mx-auto rounded-full border-2 border-pink-500/30 p-1 bg-black/40 flex items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.2)]"
          >
            <div className="w-full h-full rounded-full border-2 border-cyan-500/20 flex items-center justify-center relative bg-gradient-to-br from-pink-500/10 to-transparent">
              <Disc className={`w-24 h-24 ${isPlaying ? 'text-pink-500' : 'text-gray-700'} transition-colors duration-500`} />
              <div className="absolute w-4 h-4 bg-black rounded-full border border-gray-800" />
            </div>
          </motion.div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">{currentTrack.title}</h1>
            <p className="text-pink-400 font-mono text-xs uppercase tracking-widest opacity-80">{currentTrack.artist}</p>
          </div>

          <div className="flex items-center justify-center gap-2">
             <Activity size={14} className="text-cyan-500 animate-pulse" />
             <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">Audio Streaming...</span>
          </div>
        </div>
      </div>

      {/* Playlist Grid (Subtle) */}
      <div className="px-6 py-4 bg-white/5 border-t border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-gray-400">
            <ListMusic size={14} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Queue</span>
          </div>
        </div>
        <div className="flex gap-2">
          {DUMMY_TRACKS.map((track, i) => (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(i);
                setIsPlaying(true);
              }}
              className={`flex-1 group relative p-3 rounded-xl border transition-all duration-300 text-left ${
                currentTrackIndex === i 
                  ? 'bg-pink-500/10 border-pink-500/50' 
                  : 'bg-black/20 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="text-[10px] text-gray-500 font-mono mb-1">0{i + 1}</div>
              <div className={`text-[11px] font-bold truncate ${currentTrackIndex === i ? 'text-pink-400' : 'text-white'}`}>
                {track.title}
              </div>
              {currentTrackIndex === i && isPlaying && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-2 right-2 flex gap-0.5 items-end h-3"
                >
                  {[0.4, 0.8, 0.6, 1].map((h, j) => (
                    <motion.div 
                      key={j}
                      animate={{ height: [`${h * 100}%`, `${(1-h) * 100}%`, `${h * 100}%`] }}
                      transition={{ duration: 0.5 + j * 0.1, repeat: Infinity }}
                      className="w-0.5 bg-pink-500 rounded-full" 
                    />
                  ))}
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Area */}
      <div className="p-8 bg-black/60 border-t border-white/5 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="relative group p-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer accent-pink-500 group-hover:bg-gray-700 transition-colors"
            />
            <div 
              className="absolute left-1 top-1 h-1.5 bg-pink-500 rounded-full pointer-events-none transition-all duration-100 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
              style={{ width: `calc(${progress}% - 8px)` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-8">
          {/* Main Controls */}
          <div className="flex items-center gap-6">
            <button 
              onClick={skipBackward}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack size={24} />
            </button>
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-pink-500 text-black flex items-center justify-center hover:bg-pink-400 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(236,72,153,0.3)]"
            >
              {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
            </button>
            <button 
              onClick={skipForward}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward size={24} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 group">
            <Volume2 size={16} className="text-gray-500 group-hover:text-pink-400 transition-colors" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-gray-800 rounded-full appearance-none cursor-pointer accent-pink-500"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/5 bg-white/5">
            <div className="w-1 h-1 rounded-full bg-pink-500" />
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Master.Out_L/R</span>
          </div>
        </div>
      </div>
    </div>
  );
};
