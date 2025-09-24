import { createContext, useState, useEffect, useRef } from "react";

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSrc, setCurrentSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [teluguSongs, setTeluguSongs] = useState([]);

  const [volume, setVolume] = useState(1); // full volume
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio());

  // 🔹 Play a song
  const handlePlay = (src, songObj) => {
    if (!src) return;
    if (currentSrc !== src) {
      // load new song
      audioRef.current.src = src;
      audioRef.current.load();
      setCurrentSrc(src);
      setCurrentSong(songObj);
    }
    audioRef.current.play();
  };

  // 🔹 Pause
  const handlePause = () => {
    audioRef.current.pause();
  };

  // 🔹 Resume
  const handleResume = () => {
    audioRef.current.play();
  };

  // 🔹 Stop
  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
  };

  // 🔹 Volume control
  const handleVolume = (val) => {
    setVolume(val);
    audioRef.current.volume = val;
  };

  // 🔹 Seek
  const handleSeek = (val) => {
    audioRef.current.currentTime = val;
    setProgress(val);
  };

  // 🔹 Setup audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentSrc(null);
      setCurrentSong(null);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        currentSrc,
        isPlaying,
        teluguSongs,
        setTeluguSongs,
        handlePlay,
        handlePause,
        handleResume,
        handleStop,
        handleVolume,
        handleSeek,
        progress,
        duration,
        volume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
