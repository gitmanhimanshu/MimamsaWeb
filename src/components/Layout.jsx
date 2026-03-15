import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiBook, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiFileText
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
    { icon: FiFileText, label: '📝 कविताएँ', path: '/poems', highlight: true },
    { icon: FiHome, label: 'Home', path: '/home', highlight: false },
    { icon: FiUser, label: 'Profile', path: '/profile', highlight: false },
    { icon: FiBook, label: 'Books', path: '/home', highlight: false },
  ];

  if (isAdmin) {
    menuItems.push({ 
      icon: MdAdminPanelSettings, 
      label: 'Admin Panel', 
      path: '/admin',
      highlight: false
    });
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-primary border-b border-orange-600 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-4 text-white hover:text-orange-100"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <Link to="/poems" className="flex items-center space-x-3">
                <img 
                  src="/logo.png" 
                  alt="Mimanasa Logo" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-2xl font-bold text-white">Mimanasa</span>
              </Link>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white hidden sm:block font-semibold">
                {user?.username}
              </span>
              {user?.profile_photo && (
                <img
                  src={user.profile_photo}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
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
            fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-orange-200
            transform transition-transform duration-300 ease-in-out z-40 shadow-lg
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  item.highlight 
                    ? 'bg-gradient-to-r from-primary via-orange-500 to-orange-600 text-white shadow-xl transform hover:scale-105 border-2 border-orange-300 animate-pulse' 
                    : 'text-gray-700 hover:bg-orange-100 hover:text-primary'
                }`}
              >
                <item.icon size={20} />
                <span className={item.highlight ? 'font-bold text-lg' : ''}>{item.label}</span>
                {item.highlight && <span className="ml-auto text-orange-200">✨</span>}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors font-medium"
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
