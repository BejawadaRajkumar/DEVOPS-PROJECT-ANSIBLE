// src/components/MainLayout.jsx
import Sidebar from './Sidebar';

import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="flex h-screen bg-dark">
      <Sidebar />
      <main className="flex-1 overflow-auto custom-scrollbar">
        <Outlet />
      </main>
      
    </div>
  );
}

export default MainLayout;
