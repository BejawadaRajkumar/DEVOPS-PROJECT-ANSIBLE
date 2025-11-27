import { Link } from 'react-router-dom';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  FireIcon, // 🔥 for Trending
} from '@heroicons/react/24/outline';

function Sidebar() {
  const playlists = ['Liked Songs', 'Daily Mix 1', 'Discover Weekly'];

  return (
    <aside className="w-64 h-full bg-secondary p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">MelodyStream</h1>
      </div>

      <nav className="space-y-4 mb-6">
        <Link
          to="/"
          className="flex items-center space-x-3 text-light hover:text-white"
        >
          <HomeIcon className="w-6 h-6" />
          <span>Home</span>
        </Link>

        <Link
          to="/search"
          className="flex items-center space-x-3 text-light hover:text-white"
        >
          <MagnifyingGlassIcon className="w-6 h-6" />
          <span>Search</span>
        </Link>

        <Link
          to="/library"
          className="flex items-center space-x-3 text-light hover:text-white"
        >
          <BookmarkIcon className="w-6 h-6" />
          <span>Your Library</span>
        </Link>

        {/* 🔥 New Trending Section */}
        <Link
          to="/trending"
          className="flex items-center space-x-3 text-light hover:text-white"
        >
          <FireIcon className="w-6 h-6" />
          <span>Trending</span>
        </Link>
      </nav>

      <div className="mt-4">
        <h2 className="text-sm font-semibold text-light mb-4">PLAYLISTS</h2>
        <div className="space-y-2">
          {playlists.map((name, index) => (
            name === 'Liked Songs' ? (
              <Link key={index} to="/liked" className="block text-light hover:text-white">
                {name}
              </Link>
            ) : (
              <a key={index} href="#" className="block text-light hover:text-white">
                {name}
              </a>
            )
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;