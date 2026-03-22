import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiBook, FiFileText, FiHeadphones, FiVideo, FiClock, FiUser, FiLogIn } from 'react-icons/fi';

const LandingPage = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await api.get('/feed/');
      setFeed(response.data.items);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'book': return <FiBook className="text-primary" size={24} />;
      case 'poem': return <FiFileText className="text-orange-600" size={24} />;
      case 'story': return <FiFileText className="text-orange-500" size={24} />;
      case 'audiobook': return <FiHeadphones className="text-primary" size={24} />;
      case 'video': return <FiVideo className="text-orange-600" size={24} />;
      default: return <FiBook size={24} />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'book': return 'Book';
      case 'poem': return 'Poem';
      case 'story': return 'Short Story';
      case 'audiobook': return 'Audiobook';
      case 'video': return 'Video';
      default: return type;
    }
  };

  const handleContentClick = (e) => {
    e.preventDefault();
    setShowLoginModal(true);
  };

  const filteredFeed = filter === 'all' ? feed : feed.filter(item => item.type === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Public Header */}
      <header className="bg-gradient-to-r from-primary via-orange-500 to-orange-600 border-b-4 border-orange-700 sticky top-0 z-50 shadow-xl">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.5) 10px, rgba(255,255,255,.5) 20px)`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Mimanasa Logo" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-lg" />
              <div>
                <span className="text-2xl font-bold text-white drop-shadow-lg">मीमांसा</span>
                <span className="text-xs text-orange-100 block -mt-1">Mimanasa</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link to="/login" className="px-4 py-2 bg-white text-primary rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-md">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-orange-700 text-white rounded-lg font-semibold hover:bg-orange-800 transition-colors shadow-md">
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary via-orange-500 to-orange-600 text-white py-12 px-6 mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.5) 10px, rgba(255,255,255,.5) 20px)`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            🕉️ मीमांसा - Mimanasa
          </h1>
          <p className="text-lg md:text-xl text-orange-100 mb-2">
            भारतीय साहित्य का डिजिटल संग्रह
          </p>
          <p className="text-base md:text-lg text-white/90 mb-6">
            Discover the treasure of Indian literature - Books, Poems, Stories & More
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="px-8 py-3 bg-white text-primary rounded-xl font-bold hover:bg-orange-50 transition-all shadow-lg transform hover:scale-105">
              Get Started Free
            </Link>
            <Link to="/login" className="px-8 py-3 bg-orange-700 text-white rounded-xl font-bold hover:bg-orange-800 transition-all shadow-lg transform hover:scale-105">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Filter Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="text-primary mr-2">📖</span>
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { type: 'all', label: 'सभी / All', icon: '🌟' },
              { type: 'book', label: 'पुस्तकें / Books', icon: '📚' },
              { type: 'poem', label: 'कविताएं / Poems', icon: '✍️' },
              { type: 'story', label: 'कहानियां / Stories', icon: '📖' },
              { type: 'audiobook', label: 'ऑडियो / Audio', icon: '🎧' },
              { type: 'video', label: 'वीडियो / Videos', icon: '🎬' }
            ].map(({ type, label, icon }) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all shadow-md border-2 ${
                  filter === type
                    ? 'bg-gradient-to-r from-primary to-orange-500 text-white border-primary shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 border-orange-200 hover:bg-orange-50 hover:border-primary'
                }`}
              >
                <span className="mr-2">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mb-8 bg-white rounded-xl shadow-md border-2 border-orange-200 p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="font-semibold">
              Showing {filteredFeed.length} {filter === 'all' ? 'items' : getTypeLabel(filter)}
            </span>
            <span className="text-primary font-semibold">
              Total Collection: {feed.length} items
            </span>
          </div>
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFeed.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              onClick={handleContentClick}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-200 hover:border-primary overflow-hidden transform hover:-translate-y-2 cursor-pointer"
            >
              {/* Type Badge */}
              <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border-2 border-primary">
                <div className="flex items-center space-x-1">
                  {getIcon(item.type)}
                  <span className="text-xs font-bold text-gray-700">
                    {getTypeLabel(item.type)}
                  </span>
                </div>
              </div>

              {/* Cover Image */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
                {item.cover_image ? (
                  <>
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {item.type === 'book' ? '📚' : item.type === 'poem' ? '✍️' : item.type === 'story' ? '📖' : item.type === 'audiobook' ? '🎧' : '🎬'}
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-4 bg-gradient-to-b from-white to-orange-50/30">
                <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                  {item.title}
                </h3>

                <div className="flex items-center space-x-2 text-gray-600 mb-2 bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
                  <FiUser size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm font-medium truncate">{item.author_name}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-500 text-xs">
                  <FiClock size={12} className="text-orange-500" />
                  <span>{new Date(item.created_at).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}</span>
                </div>
              </div>

              <div className="h-1 bg-gradient-to-r from-primary via-orange-500 to-orange-600"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFeed.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-orange-200">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Content Found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full border-4 border-primary shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
              <p className="text-gray-600">Please login or register to access this content</p>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full px-6 py-3 bg-gradient-to-r from-primary to-orange-500 text-white rounded-xl font-bold text-center hover:shadow-lg transition-all transform hover:scale-105"
              >
                <FiLogIn className="inline mr-2" />
                Login to Continue
              </Link>
              <Link
                to="/register"
                className="block w-full px-6 py-3 bg-white text-primary border-2 border-primary rounded-xl font-bold text-center hover:bg-orange-50 transition-all"
              >
                Create New Account
              </Link>
              <button
                onClick={() => setShowLoginModal(false)}
                className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-200 transition-all"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
