import React from 'react';
import { Home } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg shadow-md">
          <Home className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-wide font-sans">
          Gharkul
        </h2>
      </div>
    </nav>
  );
};

export default Navbar;
