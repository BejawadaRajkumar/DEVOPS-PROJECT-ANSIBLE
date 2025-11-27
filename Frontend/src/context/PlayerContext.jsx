import { createContext, useState, useEffect, useRef } from "react";

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSrc, setCurrentSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [teluguSongs, setTeluguSongs] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [likedLoading, setLikedLoading] = useState(false);

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

  // 🔹 Helpers for liked songs (persisted in backend)
  const fetchSongById = async (id) => {
    try {
      const res = await fetch(`https://sai-song-api.vercel.app/api/songs/${id}`);
      const data = await res.json();
      // the external API sometimes returns data as an array (e.g. data: [ { ... } ])
      // or as an object (data: { ... }). Normalize both cases.
      let song = null;
      if (Array.isArray(data?.data)) {
        song = data.data[0];
      } else {
        song = data?.data;
      }
      if (!song) return null;

      // normalize to the same shape the app uses
      let imageUrl = "";
      if (Array.isArray(song.image)) {
        const img500 = song.image.find((img) => img.quality === "500x500");
        const img150 = song.image.find((img) => img.quality === "150x150");
        const img50 = song.image.find((img) => img.quality === "50x50");
        imageUrl = img500?.url || img150?.url || img50?.url || "https://via.placeholder.com/300x160?text=No+Image";
      }

      let audioUrl = "";
      if (Array.isArray(song.downloadUrl)) {
        const aud320 = song.downloadUrl.find((aud) => aud.quality === "320kbps");
        const aud160 = song.downloadUrl.find((aud) => aud.quality === "160kbps");
        const aud96 = song.downloadUrl.find((aud) => aud.quality === "96kbps");
        const aud48 = song.downloadUrl.find((aud) => aud.quality === "48kbps");
        const aud12 = song.downloadUrl.find((aud) => aud.quality === "12kbps");
        audioUrl = aud320?.url || aud160?.url || aud96?.url || aud48?.url || aud12?.url || "";
      }

      let artistNames = "Unknown Artist";
      if (song.artists && song.artists.primary && Array.isArray(song.artists.primary)) {
        artistNames = song.artists.primary.map((a) => a.name).join(", ");
      }

      return {
        id: song.id,
        name: song.name,
        imageUrl,
        audioUrl,
        artistNames,
      };
    } catch (err) {
      console.error('Failed to fetch song by id', id, err);
      return null;
    }
  };

  const fetchLikedSongsForUser = async (userId) => {
    if (!userId) return;
    try {
      setLikedLoading(true);
      const res = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/likes/${encodeURIComponent(userId)}`);
      if (!res.ok) return;
      const data = await res.json();
      // backend returns an object with likedSongIds array
      const likedIds = data?.likedSongIds || [];
      // fetch details in parallel for speed
      const promises = likedIds.map((id) => fetchSongById(id));
      const results = await Promise.all(promises);
      const songs = results.filter((s) => s !== null);
      setLikedSongs(songs);
    } catch (err) {
      console.error('Failed to fetch liked songs for user', userId, err);
    }
    finally {
      setLikedLoading(false);
    }
  };

  const likeSong = async (song) => {
    const userId = localStorage.getItem('email');
    if (!userId) {
      console.warn('No user id/email in localStorage. Please login.');
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/likes/add/${encodeURIComponent(userId)}/${encodeURIComponent(song.id)}`, {
        method: 'POST',
      });
      if (res.ok) {
        setLikedSongs((prev) => {
          if (prev.some((s) => s.id === song.id)) return prev;
          return [...prev, song];
        });
      }
    } catch (err) {
      console.error('Failed to like song', err);
    }
  };

  const unlikeSong = async (song) => {
    const userId = localStorage.getItem('email');
    if (!userId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/likes/remove/${encodeURIComponent(userId)}/${encodeURIComponent(song.id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setLikedSongs((prev) => prev.filter((s) => s.id !== song.id));
      }
    } catch (err) {
      console.error('Failed to unlike song', err);
    }
  };

  // fetch liked songs on mount if user present
  useEffect(() => {
    const userId = localStorage.getItem('email');
    if (userId) {
      fetchLikedSongsForUser(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        currentSrc,
        isPlaying,
        teluguSongs,
        setTeluguSongs,
        likedSongs,
        setLikedSongs,
        likeSong,
        unlikeSong,
        likedLoading,
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
