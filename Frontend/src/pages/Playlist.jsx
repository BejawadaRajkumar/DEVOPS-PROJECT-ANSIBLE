import { useParams } from 'react-router-dom';
import { PlayIcon, HeartIcon, ClockIcon } from '@heroicons/react/24/solid';

function Playlist() {
  const { id } = useParams();

  const songs = [
    { id: 1, title: "Song 1", artist: "Artist 1", album: "Album 1", duration: "3:45" },
    { id: 2, title: "Song 2", artist: "Artist 2", album: "Album 2", duration: "4:20" },
    { id: 3, title: "Song 3", artist: "Artist 3", album: "Album 3", duration: "3:15" },
    { id: 4, title: "Song 4", artist: "Artist 4", album: "Album 4", duration: "3:50" },
  ];

  return (
    <div className="text-white min-h-screen">
      {/* Header */}
      <div className="relative h-96 w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-dark">
          <div className="absolute bottom-0 p-8 flex flex-col sm:flex-row items-start sm:items-end space-x-0 sm:space-x-6 space-y-4 sm:space-y-0">
            <img
              src="https://via.placeholder.com/300"
              alt="Playlist Cover"
              className="w-40 h-40 sm:w-60 sm:h-60 object-cover shadow-2xl rounded"
            />
            <div>
              <p className="text-sm font-semibold text-light mb-2">PLAYLIST</p>
              <h1 className="text-4xl sm:text-7xl font-bold mb-4 sm:mb-6">
                Playlist {id}
              </h1>
              <p className="text-light text-sm">
                Created by User • {songs.length} songs, ~16 min
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Song Table */}
      <div className="p-6 sm:p-8">
        {/* Buttons */}
        <div className="flex items-center space-x-4 mb-8">
          <button className="w-14 h-14 flex items-center justify-center bg-primary rounded-full hover:scale-105 transition-transform">
            <PlayIcon className="w-8 h-8 text-black" />
          </button>
          <button className="text-light hover:text-white transition-colors">
            <HeartIcon className="w-8 h-8" />
          </button>
        </div>

        {/* Song List */}
        <table className="w-full text-left">
          <thead>
            <tr className="text-light text-sm border-b border-white/10 uppercase">
              <th className="pb-4 pl-4">#</th>
              <th className="pb-4">Title</th>
              <th className="pb-4 hidden sm:table-cell">Album</th>
              <th className="pb-4 pr-4 text-right">
                <ClockIcon className="w-5 h-5 inline-block" />
              </th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, index) => (
              <tr
                key={song.id}
                className="group hover:bg-white/10 cursor-pointer transition"
              >
                <td className="py-4 pl-4">{index + 1}</td>
                <td className="py-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={`https://via.placeholder.com/40?text=${song.title.charAt(0)}`}
                      alt={song.title}
                      className="w-10 h-10 rounded"
                    />
                    <div>
                      <p className="font-medium">{song.title}</p>
                      <p className="text-light text-sm">{song.artist}</p>
                    </div>
                  </div>
                </td>
                <td className="text-light hidden sm:table-cell">{song.album}</td>
                <td className="text-light text-right pr-4">{song.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Playlist;
