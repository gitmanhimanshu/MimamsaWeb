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
  FiImage
} from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar - Fixed Navigation */}
        <aside className="w-20 xl:w-64 h-screen sticky top-0 border-r border-gray-200 flex flex-col">
          {/* Logo */}
          <div className="p-4 xl:p-6">
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
          <nav className="flex-1 px-2 xl:px-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path + item.label}
                to={item.path}
                className={`flex items-center justify-center xl:justify-start space-x-4 px-4 py-3 rounded-full font-semibold text-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-orange-50 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={26} />
                <span className="hidden xl:block">{item.label}</span>
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center xl:justify-start space-x-4 px-4 py-3 rounded-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all font-semibold text-lg"
            >
              <FiLogOut size={26} />
              <span className="hidden xl:block">Logout</span>
            </button>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
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
        <main className="flex-1 min-h-screen border-r border-gray-200 max-w-2xl">
          {children}
        </main>

        {/* Right Sidebar - Trending/Stats */}
        <aside className="hidden lg:block w-80 xl:w-96 h-screen sticky top-0 p-4">
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
    </div>
  );
};

export default Layout;
