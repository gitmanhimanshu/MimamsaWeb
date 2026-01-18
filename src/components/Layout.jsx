import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiBook, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX
} from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: FiHome, label: 'Home', path: '/' },
    { icon: FiBook, label: 'कविताएँ', path: '/poems' },
    { icon: FiUser, label: 'Profile', path: '/profile' },
  ];

  if (isAdmin) {
    menuItems.push({ 
      icon: MdAdminPanelSettings, 
      label: 'Admin Panel', 
      path: '/admin' 
    });
  }

  return (
    <div className="min-h-screen bg-darker">
      {/* Header */}
      <header className="bg-dark border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-4 text-gray-400 hover:text-white"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <Link to="/" className="text-2xl font-bold text-primary">
                Mimanasa
              </Link>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400 hidden sm:block">
                {user?.username}
              </span>
              {user?.profile_photo && (
                <img
                  src={user.profile_photo}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-dark border-r border-gray-800
            transform transition-transform duration-300 ease-in-out z-40
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-900/20 hover:text-red-400 transition-colors"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
