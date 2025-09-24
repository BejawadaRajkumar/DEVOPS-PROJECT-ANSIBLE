import { useState } from 'react';
import { motion } from 'framer-motion';

function Library() {
  const [activeTab, setActiveTab] = useState('playlists');

  const tabs = [
    { id: 'playlists', label: 'Playlists' },
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums' },
  ];

  const playlistImages = [
    "https://th.bing.com/th/id/OIP.EQWfd5Ycs61U3Ni7RtGrZAHaHa?w=210&h=210&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.Qyi2IuhELN8674IbvSl9iAHaHa?w=210&h=210&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.SoUCGwOZv8UeGUmi-T_yjAHaHa?w=210&h=210&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.tcun9wlpzLVmOsyg-ZCH_gAAAA?w=209&h=210&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.1h2x5qEu8-po1RmYXHdYxgHaEK?w=305&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.nqxe74G0w38w2l0UeD1kNgHaHa?w=171&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.J0_vGdnUTvZCqmwFdr6lawHaHa?w=186&h=186&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.6SlNVF5DrLXSEk_Cch0gkQHaHa?w=186&h=186&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.s7Vlh1QfW8VqQFsWxtMQJwHaFi?w=249&h=187&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.QdlIarOSvmaUsT0dd1S9_AHaHa?w=180&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
  ];

  const artistImages = [
    "https://th.bing.com/th/id/OIP.vyD5nPuTJmy5JT00tIqVCQHaE7?w=292&h=194&c=7&r=0&o=5&dpr=1.3&pid=1.7", // Ed Sheeran
    "https://th.bing.com/th/id/OIP.U3jU3JPR-13Vof2ceB2XhgHaKd?w=182&h=257&c=7&r=0&o=5&dpr=1.3&pid=1.7", // Dua Lipa
    "https://th.bing.com/th/id/OIP.feX2SiAAYeRhhubkRmuGpgHaHa?w=162&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7", // The Weeknd
    "https://th.bing.com/th/id/OIP.Sqh-E0h-Mb1vag-W1J-DHQHaJq?w=134&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7", // SP Balasubramanyam 
    "https://th.bing.com/th/id/OIP.EJhAQbZ7Flfwk5Rw2cXX2QHaEK?w=315&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7", // Billie Eilish
  ];

  const albumImages = [
    "https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png", // ÷ by Ed Sheeran
    "https://th.bing.com/th/id/OIP.Tkwf7QCN9zNmUJRVK8GWrgHaHa?w=160&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7", // the love songs
    "https://th.bing.com/th/id/OIP._ngVqHW4nIHIlGt1nyjPewHaHa?w=183&h=183&c=7&r=0&o=5&dpr=1.3&pid=1.7", // the pop songs
    "https://th.bing.com/th/id/OIP.i0EtD40dU9C5WWS2jpnDggHaE8?w=258&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7", // the rock songs
    "https://th.bing.com/th/id/OIP.Q8HYqvj0wGJR4Lq-RXbg8QHaGK?w=210&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7", // the folk songs
    "https://th.bing.com/th/id/OIP.-6c3MuzwkviRWLCiW-rlGQHaHW?w=169&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7", // the country songs
  ];

  const renderPlaylists = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {playlistImages.map((url, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-secondary rounded-lg p-4 cursor-pointer hover:bg-secondary/80 shadow-sm hover:shadow-lg"
        >
          <img
            src={url}
            alt={'Playlist Cover ${index + 1}'}
            className="w-full aspect-square object-cover rounded-md mb-4"
          />
          <h3 className="font-medium truncate text-white">My Playlist #{index + 1}</h3>
          <p className="text-light text-sm">32 songs</p>
        </motion.div>
      ))}
    </div>
  );
  const renderArtists = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {artistImages.map((url, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="text-center"
        >
          <img
            src={url}
            alt={'Artist ${index + 1}'}
            className="w-full aspect-square object-cover rounded-full mb-4"
          />
          <h3 className="font-medium text-white">Artist {index + 1}</h3>
          <p className="text-light text-sm">Popular Artist</p>
        </motion.div>
      ))}
    </div>
  );

  const renderAlbums = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {albumImages.map((url, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-secondary rounded-lg p-4 cursor-pointer hover:bg-secondary/80 shadow-sm hover:shadow-lg"
        >
          <img
            src={url}
            alt={'Album Cover ${index + 1}'}
            className="w-full aspect-square object-cover rounded-md mb-4"
          />
          <h3 className="font-medium truncate text-white">Album {index + 1}</h3>
          <p className="text-light text-sm">Famous Artist • 2023</p>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-4xl font-bold mb-8 text-white">Your Library</h1>

      <div className="mb-10">
        <div className="flex space-x-4 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-4 relative focus:outline-none transition-colors ${
                activeTab === tab.id ? 'text-white font-semibold' : 'text-light'
              }`}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === 'playlists' && renderPlaylists()}
        {activeTab === 'artists' && renderArtists()}
        {activeTab === 'albums' && renderAlbums()}
      </div>
    </div>
  );
}

export default Library;