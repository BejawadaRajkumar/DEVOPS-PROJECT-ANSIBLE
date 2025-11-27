import { useContext } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaPause, FaHeart, FaRegHeart } from "react-icons/fa";
import { PlayerContext } from "../context/PlayerContext";

function LikedSongs() {
  const {
    likedSongs,
    handlePlay,
    handlePause,
    handleResume,
    currentSrc,
    isPlaying,
    likeSong,
    unlikeSong,
    likedLoading,
  } = useContext(PlayerContext);

  const toggleLike = (song) => {
    const isLiked = likedSongs && likedSongs.some((s) => s.id === song.id);
    if (isLiked) unlikeSong(song);
    else likeSong(song);
  };

  return (
    <div className="p-6 md:p-10 bg-transparent text-white min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold mb-6"
      >
        Your Liked Songs
      </motion.h1>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {likedLoading && (
            <div className="text-gray-400">Loading liked songs...</div>
          )}
          {(!likedSongs || likedSongs.length === 0) && !likedLoading && (
            <div className="text-gray-400">You have no liked songs yet.</div>
          )}

          {likedSongs &&
            likedSongs.map((song) => {
              const isCurrent = currentSrc === song.audioUrl;
              return (
                <div
                  key={song.id}
                  className="p-4 rounded-xl shadow transition bg-secondary"
                >
                  <img
                    src={song.imageUrl}
                    alt={song.name}
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                  <h4 className="text-base font-bold truncate">{song.name}</h4>
                  <p className="text-sm truncate opacity-70">{song.artistNames}</p>
                  <div className="flex mt-2 space-x-2 items-center">
                    <button
                      onClick={() => {
                        if (!song.audioUrl) return;
                        if (isCurrent) {
                          if (isPlaying) handlePause();
                          else handleResume();
                        } else {
                          handlePlay(song.audioUrl, song);
                        }
                      }}
                      className="bg-primary text-white text-sm px-3 py-1 rounded-full hover:bg-primary/80 transition"
                      disabled={!song.audioUrl}
                    >
                      {isCurrent && isPlaying ? <FaPause /> : <FaPlay />}
                    </button>

                    <button onClick={() => toggleLike(song)} className="text-red-500 text-lg">
                      {likedSongs && likedSongs.some((s) => s.id === song.id) ? (
                        <FaHeart />
                      ) : (
                        <FaRegHeart />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}

export default LikedSongs;
