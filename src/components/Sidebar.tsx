import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, PlusCircle, Settings } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onClose]);
  
  // Navigation items
  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/clients/new', icon: <PlusCircle size={20} />, label: 'Add Client' },
  ];
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-5 md:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-10 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:h-screen md:pt-16 
        `}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 md:hidden">
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex-1 px-2 py-5 bg-white space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  group flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                }}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <NavLink
              to="/settings"
              className={({ isActive }) => `
                group flex items-center px-4 py-2 text-sm font-medium rounded-md
                ${isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <Settings size={20} className="mr-3" />
              Settings
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;