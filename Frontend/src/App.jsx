import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { PlayerProvider } from './context/PlayerContext';
import Home from './pages/Home';
import Search from './pages/Search';
import Signup from './pages/Signup'
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Trending from './pages/Trending';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <PlayerProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
         <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <div className="flex h-screen bg-dark">
                  <Sidebar />
                  <main className="flex-1 overflow-auto custom-scrollbar">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/playlist/:id" element={<Playlist />} />
                      <Route path='/trending' element={<Trending/>}/>
                    </Routes>
                  </main>
                 
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </PlayerProvider>
  );
}

export default App;
