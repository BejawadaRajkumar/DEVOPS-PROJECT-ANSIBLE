import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaRegHeart,
  FaList,
  FaThLarge,
} from "react-icons/fa";

import { PlayerContext } from "../context/PlayerContext";

function Trending() {
  const {
    handlePlay,
    handlePause,
    handleResume,
    currentSrc,
    isPlaying,
    likedSongs,
    setLikedSongs,
  } = useContext(PlayerContext);

  // -------------------------------------------------------------
  // STATES
  // -------------------------------------------------------------
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [hindiSongs, setHindiSongs] = useState([]);
  const [teluguSongs, setTeluguSongs] = useState([]);
  const [englishSongs, setEnglishSongs] = useState([]);

  const [loading, setLoading] = useState(false);

  const [activeSections, setActiveSections] = useState({
    trending: true,
    hindi: false,
    telugu: false,
    english: false,
  });

  const [viewMode, setViewMode] = useState("grid");

  // -------------------------------------------------------------
  // FALLBACK SONGS (static)
  // -------------------------------------------------------------
  const fallback = {
    trending: [
      {
        id: "t1",
        name: "Blinding Lights",
        artistNames: "The Weeknd",
        imageUrl: "/songs/blinding-lights.jpg",
        audioUrl: "/songs/Blinding Lights.mp3",
      },
      {
        id: "t2",
        name: "Believer",
        artistNames: "Imagine Dragons",
        imageUrl: "/songs/believer.jpg",
        audioUrl: "/songs/Believer.mp3",
      },
    ],
    hindi: [
      {
        id: "h1",
        name: "Kesariya",
        artistNames: "Arijit Singh",
        imageUrl: "/songs/kesariya.jpg",
        audioUrl: "/songs/kesariya.mp3",
      },
    ],
    telugu: [
      {
        id: "te1",
        name: "Naatu Naatu",
        artistNames: "Rahul Sipligunj, Kaala Bhairava",
        imageUrl: "/songs/naatu.jpg",
        audioUrl: "/songs/naatu.mp3",
      },
    ],
    english: [
      {
        id: "e1",
        name: "Shape of You",
        artistNames: "Ed Sheeran",
        imageUrl: "/songs/shape-of-you.jpg",
        audioUrl: "/songs/Shape_Of_You.mp3",
      },
    ],
  };

  // -------------------------------------------------------------
  // FETCH SONGS (optimized + returns promise!)
  // -------------------------------------------------------------
  const fetchSongs = async (query, setter, fallbackList) => {
    try {
      const res = await fetch(
        `https://sai-song-api.vercel.app/api/search/songs?query=${query}&limit=20&page=1`
      );
      const data = await res.json();

      const results = data?.data?.results || [];
      const mapped =
        results.length > 0
          ? results.map((song) => ({
              id: song.id,
              name: song.name,
              artistNames:
                song.artists?.primary?.map((a) => a.name).join(", ") ||
                "Unknown",
              imageUrl:
                song.image?.find((i) => i.quality === "500x500")?.url ||
                "https://via.placeholder.com/300",
              audioUrl:
                song.downloadUrl?.find((a) => a.quality === "320kbps")?.url ||
                "",
            }))
          : fallbackList;

      setter(mapped);
    } catch {
      setter(fallbackList);
    }

    return true; // IMPORTANT
  };

  // -------------------------------------------------------------
  // FETCH ALL SONGS SAFELY
  // -------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const loadAll = async () => {
      setLoading(true);

      await Promise.all([
        fetchSongs("Trending", setTrendingSongs, fallback.trending),
        fetchSongs("Hindi", setHindiSongs, fallback.hindi),
        fetchSongs("Telugu", setTeluguSongs, fallback.telugu),
        fetchSongs("English", setEnglishSongs, fallback.english),
      ]);

      if (mounted) setLoading(false);
    };

    loadAll();

    return () => {
      mounted = false;
    };
  }, []);

  // -------------------------------------------------------------
  // LIKE TOGGLE
  // -------------------------------------------------------------
  const toggleLike = (song) => {
    setLikedSongs((prev) =>
      prev?.some((s) => s.id === song.id)
        ? prev.filter((s) => s.id !== song.id)
        : [...prev, song]
    );
  };

  // -------------------------------------------------------------
  // GRID CARD (No heavy animations)
  // -------------------------------------------------------------
  const GridCard = ({ song }) => {
    const isCurrent = currentSrc === song.audioUrl;

    return (
      <div className="p-4 rounded-xl bg-[#181818] border border-gray-700 shadow-lg hover:scale-[1.03] hover:-translate-y-1 transition">
        <div className="relative">
          <img
            src={song.imageUrl}
            className="w-full h-44 object-cover rounded-lg"
            alt=""
          />

          <button
            onClick={() =>
              isCurrent
                ? isPlaying
                  ? handlePause()
                  : handleResume()
                : handlePlay(song.audioUrl, song)
            }
            className="absolute bottom-3 right-3 p-3 bg-green-500 rounded-full hover:bg-green-400"
          >
            {isCurrent && isPlaying ? (
              <FaPause className="text-black" />
            ) : (
              <FaPlay className="text-black" />
            )}
          </button>
        </div>

        <h3 className="font-bold mt-3 truncate">{song.name}</h3>
        <p className="text-sm text-gray-400 truncate">{song.artistNames}</p>

        <button onClick={() => toggleLike(song)} className="text-lg mt-2">
          {likedSongs?.some((s) => s.id === song.id) ? (
            <FaHeart className="text-green-400" />
          ) : (
            <FaRegHeart className="text-gray-400 hover:text-green-300" />
          )}
        </button>
      </div>
    );
  };

  // -------------------------------------------------------------
  // LIST ROW (simple + fast)
  // -------------------------------------------------------------
  const ListRow = ({ song }) => {
    const isCurrent = currentSrc === song.audioUrl;

    return (
      <div className="flex items-center p-3 rounded-lg bg-[#161616] border border-gray-700 hover:bg-[#1f1f1f] transition">
        <img
          src={song.imageUrl}
          className="w-16 h-16 object-cover rounded-md"
          alt=""
        />

        <div className="ml-4 flex-1">
          <h3 className="font-semibold">{song.name}</h3>
          <p className="text-xs text-gray-400">{song.artistNames}</p>
        </div>

        <button
          onClick={() =>
            isCurrent
              ? isPlaying
                ? handlePause()
                : handleResume()
              : handlePlay(song.audioUrl, song)
          }
          className="p-3 bg-green-500 rounded-full mr-3 hover:bg-green-400"
        >
          {isCurrent && isPlaying ? (
            <FaPause className="text-black" />
          ) : (
            <FaPlay className="text-black" />
          )}
        </button>

        <button onClick={() => toggleLike(song)} className="text-xl">
          {likedSongs?.some((s) => s.id === song.id) ? (
            <FaHeart className="text-green-400" />
          ) : (
            <FaRegHeart className="text-gray-400 hover:text-green-300" />
          )}
        </button>
      </div>
    );
  };

  // -------------------------------------------------------------
  // PLAYLIST SECTION
  // -------------------------------------------------------------
  const PlaylistSection = ({ title, id, songs }) => (
    <div className="mb-16">
      <div
        className="flex justify-between items-center cursor-pointer mb-4"
        onClick={() =>
          setActiveSections((prev) => ({ ...prev, [id]: !prev[id] }))
        }
      >
        <h2 className="text-3xl font-bold text-green-400">{title}</h2>
        <span className="text-sm opacity-70">
          {activeSections[id] ? "▲ Hide" : "▼ Show"}
        </span>
      </div>

      <AnimatePresence>
        {activeSections[id] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {songs.map((song) => (
                  <GridCard key={song.id} song={song} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {songs.map((song) => (
                  <ListRow key={song.id} song={song} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // -------------------------------------------------------------
  // UI
  // -------------------------------------------------------------
  return (
    <div className="p-6 md:p-10 bg-[#0b0b0b] text-white min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-400">
          🎧 Explore Playlists
        </h1>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-3 rounded-full ${
              viewMode === "grid" ? "bg-green-500 text-black" : "bg-[#222]"
            }`}
          >
            <FaThLarge />
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={`p-3 rounded-full ${
              viewMode === "list" ? "bg-green-500 text-black" : "bg-[#222]"
            }`}
          >
            <FaList />
          </button>
        </div>
      </div>

      <PlaylistSection
        title="🔥 Trending Worldwide"
        id="trending"
        songs={trendingSongs}
      />

      <PlaylistSection title="🎵 Hindi Playlist" id="hindi" songs={hindiSongs} />

      <PlaylistSection title="🎶 Telugu Music" id="telugu" songs={teluguSongs} />

      <PlaylistSection title="🌍 English Hits" id="english" songs={englishSongs} />
    </div>
  );
}

export default Trending;