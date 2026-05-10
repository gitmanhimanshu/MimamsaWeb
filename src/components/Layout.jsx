import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiBook, 
  FiUser, 
  FiLogOut,
  FiFileText,
  FiTrendingUp,
  FiMusic,
  FiVideo,
  FiImage,
  FiMenu,
  FiX,
  FiBookmark
} from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';
import { useState } from 'react';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: FiHome, label: 'Home', path: '/home' },
    { icon: FiTrendingUp, label: 'Explore', path: '/home' },
    { icon: FiFileText, label: 'Poems', path: '/poems' },
    { icon: FiBook, label: 'Books', path: '/home' },
    { icon: FiMusic, label: 'Audio', path: '/home' },
    { icon: FiVideo, label: 'Videos', path: '/home' },
    { icon: FiImage, label: 'Images', path: '/home' },
    { icon: FiBookmark, label: 'Saved', path: '/saved' },
    { icon: FiUser, label: 'Profile', path: '/profile' },
  ];

  if (isAdmin) {
    menuItems.push({ 
      icon: MdAdminPanelSettings, 
      label: 'Admin', 
      path: '/admin'
    });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          
          <Link to="/home" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Mimanasa" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              मीमांसा
            </span>
          </Link>

          <Link to="/profile" className="p-2">
            {user?.profile_photo ? (
              <img
                src={user.profile_photo}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-gray-200">
          <Link to="/home" className="flex items-center space-x-3" onClick={() => setMobileMenuOpen(false)}>
            <img 
              src="/logo.png" 
              alt="Mimanasa" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              मीमांसा
            </span>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path + item.label}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-4 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-orange-50/80 text-primary shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={24} />
              <span>{item.label}</span>
            </Link>
          ))}

          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center space-x-4 px-4 py-3 rounded-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all font-semibold text-base"
          >
            <FiLogOut size={24} />
            <span>Logout</span>
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 hover:bg-gray-100 rounded-full p-2 transition-colors">
            {user?.profile_photo ? (
              <img
                src={user.profile_photo}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user?.username}</p>
              <p className="text-sm text-gray-500 truncate">@{user?.username}</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="lg:max-w-7xl lg:mx-auto lg:flex">
        {/* Desktop Left Sidebar */}
        <aside className="hidden lg:block w-16 xl:w-56 h-screen sticky top-0 border-r border-gray-200 flex-col">
          {/* Logo */}
          <div className="p-2 xl:p-4">
            <Link to="/home" className="flex items-center justify-center xl:justify-start space-x-3">
              <img 
                src="/logo.png" 
                alt="Mimanasa" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="hidden xl:block text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                मीमांसा
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-1 xl:px-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path + item.label}
                to={item.path}
                className={`flex items-center justify-center xl:justify-start space-x-4 px-2 xl:px-4 py-2.5 xl:py-3 rounded-xl font-semibold text-base xl:text-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-orange-50/80 text-primary shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={22} className="xl:w-[26px] xl:h-[26px]" />
                <span className="hidden xl:block">{item.label}</span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center xl:justify-start space-x-4 px-2 xl:px-4 py-2.5 xl:py-3 rounded-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all font-semibold text-base xl:text-lg"
            >
              <FiLogOut size={22} className="xl:w-[26px] xl:h-[26px]" />
              <span className="hidden xl:block">Logout</span>
            </button>
          </nav>

          {/* User Profile */}
          <div className="p-2 xl:p-4 border-t border-gray-200">
            <Link to="/profile" className="flex items-center justify-center xl:justify-start space-x-3 hover:bg-gray-100 rounded-full p-2 transition-colors">
              {user?.profile_photo ? (
                <img
                  src={user.profile_photo}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="hidden xl:block flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{user?.username}</p>
                <p className="text-sm text-gray-500 truncate">@{user?.username}</p>
              </div>
            </Link>
          </div>
        </aside>

        {/* Main Content - Center Feed */}
        <main className="flex-1 min-h-screen lg:border-r border-gray-200 lg:max-w-3xl">
          {children}
        </main>

        {/* Right Sidebar - Trending/Stats */}
        <aside className="hidden xl:block w-72 2xl:w-80 h-screen sticky top-0 p-4">
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What's happening</h2>
            <div className="space-y-4">
              <div className="hover:bg-gray-100 p-3 rounded-xl cursor-pointer transition-colors">
                <p className="text-xs text-gray-500">Trending in Literature</p>
                <p className="font-bold text-gray-900">#HindiPoetry</p>
                <p className="text-xs text-gray-500">2.5K posts</p>
              </div>
              <div className="hover:bg-gray-100 p-3 rounded-xl cursor-pointer transition-colors">
                <p className="text-xs text-gray-500">Trending</p>
                <p className="font-bold text-gray-900">#IndianAuthors</p>
                <p className="text-xs text-gray-500">1.8K posts</p>
              </div>
              <div className="hover:bg-gray-100 p-3 rounded-xl cursor-pointer transition-colors">
                <p className="text-xs text-gray-500">Literature · Trending</p>
                <p className="font-bold text-gray-900">Mimanasa</p>
                <p className="text-xs text-gray-500">5.2K posts</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Who to follow</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-orange-600"></div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Hindi Sahitya</p>
                    <p className="text-xs text-gray-500">@hindisahitya</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-gray-900 text-white rounded-full font-semibold text-sm hover:bg-gray-800">
                  Follow
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600"></div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Poetry Corner</p>
                    <p className="text-xs text-gray-500">@poetrycorner</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-gray-900 text-white rounded-full font-semibold text-sm hover:bg-gray-800">
                  Follow
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2">
          <Link to="/home" className={`p-3 ${isActive('/home') ? 'text-primary' : 'text-gray-600'}`}>
            <FiHome size={24} />
          </Link>
          <Link to="/poems" className={`p-3 ${isActive('/poems') ? 'text-primary' : 'text-gray-600'}`}>
            <FiFileText size={24} />
          </Link>
          <Link to="/home" className="p-3 text-gray-600">
            <FiTrendingUp size={24} />
          </Link>
          <Link to="/saved" className={`p-3 ${isActive('/saved') ? 'text-primary' : 'text-gray-600'}`}>
            <FiBookmark size={24} />
          </Link>
          <Link to="/profile" className={`p-3 ${isActive('/profile') ? 'text-primary' : 'text-gray-600'}`}>
            <FiUser size={24} />
          </Link>
        </div>
      </div>

      {/* Add padding bottom for mobile to prevent content being hidden by bottom nav */}
      <div className="lg:hidden h-16"></div>
    </div>
  );
};

export default Layout;
