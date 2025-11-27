import { useState, useEffect, useContext } from 'react';
import { MagnifyingGlassIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import { PlayerContext } from '../context/PlayerContext';
import { motion } from 'framer-motion';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [bgColor, setBgColor] = useState('bg-black');
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [tracks, setTracks] = useState([]);
  // no local audioRef; global player in PlayerContext is used

  const { handlePlay, handlePause, handleResume, currentSrc, isPlaying } = useContext(PlayerContext);

  const categories = [
    "Pop", "Rock", "Hip-Hop", "Electronic", "Jazz", "Classical",
    "R&B", "Country", "Latin", "Metal", "Folk", "Blues"
  ];

  // tracks state will be populated from external API

  const filteredTracks = tracks; // results come from API already filtered by query

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTrackClick = (track) => {
    // use global player
    if (!track.audioUrl) return;
    if (currentSrc === track.audioUrl) {
      if (isPlaying) handlePause();
      else handleResume();
    } else {
      handlePlay(track.audioUrl, track);
    }
    const colorMap = ['bg-pink-900', 'bg-indigo-900', 'bg-green-900', 'bg-yellow-900'];
    setBgColor(colorMap[track.id?.toString().length % colorMap.length]);
  };

  // fetch results from external search API when searchQuery changes (debounced)
  useEffect(() => {
    const controller = new AbortController();
    const q = searchQuery.trim();
    if (!q) {
      setTracks([]);
      setError(null);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsFetching(true);
      setError(null);
      try {
        const res = await fetch(
          `https://sai-song-api.vercel.app/api/search/songs?query=${encodeURIComponent(q)}&page=0&limit=12`,
          { signal: controller.signal }
        );
        const data = await res.json();
        const results = (data?.data?.results || []);
        const mapped = results.map((song) => {
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
            title: song.name,
            artist: artistNames,
            album: song.album?.name || "",
            image: imageUrl,
            audioUrl,
          };
        });
        setTracks(mapped);
      } catch (err) {
        if (err.name !== 'AbortError') setError('Failed to fetch results');
      } finally {
        setIsFetching(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  return (
    <div className={`p-8 min-h-screen transition-colors duration-500 ${bgColor}`}>
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light" />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 rounded-full text-white placeholder-light focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {!searchQuery && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Browse All</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg cursor-pointer hover:scale-105 transition bg-gradient-to-br ${
                  index % 2 === 0 ? "from-pink-500 to-yellow-500" : "from-purple-500 to-blue-500"
                }`}
              >
                <h3 className="text-lg font-bold text-white">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchQuery && (
        <div className="space-y-8">
          {filteredCategories.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Matched Categories</h2>
              <div className="flex flex-wrap gap-4">
                {filteredCategories.map((cat, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-green-500 to-blue-500 p-3 px-6 rounded-full text-white font-medium cursor-pointer hover:scale-105 transition"
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Search Results</h2>
            {filteredTracks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredTracks.map((track) => (
                          <div
                            key={track.id}
                            onClick={() => handleTrackClick(track)}
                            className="flex items-center space-x-4 bg-secondary/50 p-4 rounded-lg hover:bg-secondary cursor-pointer"
                          >
                            <img
                              src={track.image}
                              alt={track.title}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-white">{track.title}</h3>
                              <p className="text-light text-sm">{track.artist} • {track.album}</p>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              className="text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTrackClick(track);
                              }}
                            >
                              {currentSrc === track.audioUrl && isPlaying ? (
                                <PauseIcon className="w-6 h-6" />
                              ) : (
                                <PlayIcon className="w-6 h-6" />
                              )}
                            </motion.button>
                          </div>
                        ))}
              </div>
            ) : (
              <p className="text-light">No tracks found matching “{searchQuery}”.</p>
            )}
          </div>
        </div>
      )}

      {/* playback handled by global PlayerContext; no local audio element needed */}
    </div>
  );
}

export default Search;
