import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaShareAlt, FaComment } from "react-icons/fa";

function Trending() {
  const [likedSongs, setLikedSongs] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(new Audio());

  const trendingSongsInitial = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      image: "/songs/blinding-lights.jpg",
      src: "/songs/Blinding Lights.mp3",
      plays: 3200,
      shares: 150,
      comments: 45,
      streamsToday: 1200,
      popularity: 85,
    },
    {
      id: 2,
      title: "Levitating",
      artist: "Dua Lipa",
      image: "/songs/levitating.jpg",
      src: "/songs/Levitating.mp3",
      plays: 2800,
      shares: 90,
      comments: 35,
      streamsToday: 950,
      popularity: 78,
    },
    {
      id: 3,
      title: "Believer",
      artist: "Imagine Dragons",
      image: "/songs/believer.jpg",
      src: "/songs/Believer.mp3",
      plays: 5000,
      shares: 210,
      comments: 60,
      streamsToday: 2200,
      popularity: 92,
    },
    {
      id: 4,
      title: "Shape of You",
      artist: "Ed Sheeran",
      image: "/songs/shape-of-you.jpg",
      src: "/songs/Shape_Of_You.mp3",
      plays: 4500,
      shares: 180,
      comments: 55,
      streamsToday: 2000,
      popularity: 90,
    },
    {
      id: 5,
      title: "Senorita",
      artist: "Shawn Mendes",
      image: "/songs/senorita.jpg",
      src: "/songs/Senorta.mp3",
      plays: 3800,
      shares: 120,
      comments: 40,
      streamsToday: 1600,
      popularity: 82,
    },
  ];

  const [trendingSongs, setTrendingSongs] = useState(trendingSongsInitial);

  // Play / Pause handler
  const handlePlay = (song) => {
    if (currentPlaying === song.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      audioRef.current.pause();
      audioRef.current = new Audio(song.src);
      audioRef.current.play();
      setCurrentPlaying(song.id);
      setIsPlaying(true);

      audioRef.current.onended = () => {
        setCurrentPlaying(null);
        setIsPlaying(false);
      };
    }
  };

  // Toggle like and update like count dynamically
  const toggleLike = (song) => {
    setTrendingSongs((prev) =>
      prev.map((s) =>
        s.id === song.id
          ? {
              ...s,
              likes: likedSongs.some((l) => l.id === song.id)
                ? s.likes - 1
                : (s.likes || s.plays) + 1,
            }
          : s
      )
    );

    setLikedSongs((prev) =>
      prev.some((s) => s.id === song.id)
        ? prev.filter((s) => s.id !== song.id)
        : [...prev, song]
    );
  };

  return (
    <div className="p-6 md:p-10 bg-gray-100 dark:bg-dark text-black dark:text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">🔥 Trend Songs</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {trendingSongs.map((song) => (
          <motion.div
            key={song.id}
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl shadow hover:shadow-lg transition bg-white dark:bg-secondary"
          >
            <img
              src={song.image}
              alt={song.title}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h4 className="text-base font-bold truncate">{song.title}</h4>
            <p className="text-sm truncate opacity-70">{song.artist}</p>

            {/* Analytics */}
            <div className="flex flex-col text-xs opacity-70 mt-1 mb-2 space-y-1">
              <div>Plays: {song.plays}</div>
              <div>Likes: {song.likes || song.plays}</div>
              <div>Shares: {song.shares}</div>
              <div>Comments: {song.comments}</div>
              <div>Streams Today: {song.streamsToday}</div>
              <div>Popularity Score: {song.popularity}%</div>
            </div>

            <div className="flex mt-2 space-x-2">
              <button
                onClick={() => handlePlay(song)}
                className="bg-primary text-white text-sm px-3 py-1 rounded-full hover:bg-primary/80 transition"
              >
                {currentPlaying === song.id && isPlaying ? "⏸️ Pause" : "▶️ Play"}
              </button>
              <button
                onClick={() => toggleLike(song)}
                className="text-red-500 text-lg"
              >
                {likedSongs.some((s) => s.id === song.id) ? (
                  <FaHeart />
                ) : (
                  <FaRegHeart />
                )}
              </button>
              <button className="text-blue-500 text-lg">
                <FaShareAlt />
              </button>
              <button className="text-green-500 text-lg">
                <FaComment />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Trending;
