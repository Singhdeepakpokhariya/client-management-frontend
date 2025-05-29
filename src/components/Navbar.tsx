import React,{useCallback, useEffect, useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import { Menu, UserCircle, LogOut, BarChart2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (!dropdownRef.current?.contains(e.target as Node)) {
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Clean up on unmount
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen, handleClickOutside]);
  
  return (
    <nav className="bg-white shadow-sm fixed top-0 inset-x-0 z-30">
      <div className="container mx-auto ">
        <div className="flex items-center justify-between h-16 mx-5">
          <div className="flex items-center">
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            >
              <Menu size={24} />
            </button>
            
            <Link to="/dashboard" className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-md">
                <BarChart2 size={22} className="text-white" />
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-800">ClientManager</span>
            </Link>
          </div>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <UserCircle size={24} />
              <span className="hidden md:block">{user?.name || 'User'}</span>
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                <button 
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;