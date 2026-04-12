import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiBook, FiFileText, FiHeadphones, FiVideo, FiImage, FiLogIn, FiUserPlus, FiX } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';

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
    const icons = {
      book: <FiBook size={14} />,
      poem: <FiFileText size={14} />,
      story: <FiFileText size={14} />,
      audiobook: <FiHeadphones size={14} />,
      video: <FiVideo size={14} />,
      image: <FiImage size={14} />
    };
    return icons[type] || <FiBook size={14} />;
  };

  const getTypeLabel = (type) => {
    const labels = {
      book: 'Book', poem: 'Poem', story: 'Story',
      audiobook: 'Audiobook', video: 'Video', image: 'Image'
    };
    return labels[type] || type;
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      book: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      poem: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
      story: 'bg-green-50 text-green-600 hover:bg-green-100',
      audiobook: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
      video: 'bg-red-50 text-red-600 hover:bg-red-100',
      image: 'bg-pink-50 text-pink-600 hover:bg-pink-100'
    };
    return colors[type] || 'bg-gray-50 text-gray-600';
  };

  const handleContentClick = (e) => {
    e.preventDefault();
    setShowLoginModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredFeed = filter === 'all' ? feed : feed.filter(item => item.type === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Twitter-Style Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img src="/logo.png" alt="Mimanasa" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover" />
              <div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                  मीमांसा
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link 
                to="/login" 
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-gray-700 hover:bg-gray-100 rounded-full font-semibold transition-colors text-sm sm:text-base"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors text-sm sm:text-base"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner - Twitter Style */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              Discover Indian Literature
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6">
              भारतीय साहित्य का डिजिटल संग्रह - Books, Poems, Stories & More
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link 
                to="/register" 
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-primary text-white rounded-full font-bold hover:bg-orange-600 transition-colors text-sm sm:text-base"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="px-4 sm:px-6 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto lg:flex">
        {/* Left Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-56 xl:w-64 border-r border-gray-200 min-h-screen sticky top-16">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
            <div className="space-y-1">
              {['all', 'book', 'poem', 'story', 'audiobook', 'video', 'image'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`w-full text-left px-4 py-3 rounded-full font-semibold text-base transition-all ${
                    filter === type
                      ? 'bg-orange-50 text-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {type === 'all' ? 'All Content' : getTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 min-h-screen lg:border-r border-gray-200 lg:max-w-3xl">
          {/* Mobile Filter Tabs */}
          <div className="lg:hidden sticky top-14 sm:top-16 bg-white/95 backdrop-blur-md border-b border-gray-200 z-10">
            <div className="flex overflow-x-auto scrollbar-hide">
              {['all', 'book', 'poem', 'story', 'audiobook', 'video', 'image'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition-all relative ${
                    filter === type ? 'text-gray-900' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span>{type === 'all' ? 'All' : getTypeLabel(type)}</span>
                  {filter === type && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-primary rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Feed */}
          <div className="divide-y divide-gray-200">
            {filteredFeed.map((item) => (
              <article
                key={`${item.type}-${item.id}`}
                onClick={handleContentClick}
                className="px-2 sm:px-3 py-2.5 sm:py-3 hover:bg-gray-50/50 transition-colors cursor-pointer"
              >
                <div className="flex space-x-2">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {item.author_photo ? (
                      <img 
                        src={item.author_photo} 
                        alt={item.author_name}
                        className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-gray-100"
                      />
                    ) : (
                      <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-sm">
                        {item.author_name?.[0]?.toUpperCase() || 'A'}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-0.5 sm:mb-1">
                      <div className="flex items-center space-x-1 min-w-0 flex-wrap">
                        <span className="font-bold text-gray-900 hover:underline text-xs sm:text-sm md:text-base truncate">
                          {item.author_name || 'Anonymous'}
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm truncate">
                          @{item.author_name?.toLowerCase().replace(/\s+/g, '') || 'anonymous'}
                        </span>
                        <span className="text-gray-500 text-xs sm:text-sm">·</span>
                        <span className="text-gray-500 text-xs sm:text-sm">{formatDate(item.created_at)}</span>
                      </div>
                      <button className="text-gray-400 hover:text-primary hover:bg-orange-50 p-1 sm:p-1.5 rounded-full transition-all flex-shrink-0">
                        <BsThreeDots size={16} className="sm:hidden" />
                        <BsThreeDots size={18} className="hidden sm:block" />
                      </button>
                    </div>

                    {/* Type Badge */}
                    <div className="mb-1.5 sm:mb-2">
                      <span className={`inline-flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold transition-colors ${getTypeBadgeColor(item.type)}`}>
                        {getIcon(item.type)}
                        <span>{getTypeLabel(item.type)}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xs sm:text-sm md:text-[15px] font-normal text-gray-900 mb-1.5 sm:mb-2 break-words leading-normal">
                      {item.title}
                    </h3>

                    {/* Cover Image */}
                    {item.cover_image && (
                      <div className="mt-2 sm:mt-3 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200">
                        <img
                          src={item.cover_image}
                          alt={item.title}
                          className="w-full max-h-[400px] sm:max-h-[500px] object-cover"
                        />
                      </div>
                    )}

                    {/* Login CTA */}
                    <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">
                      <span className="text-primary hover:underline font-semibold">Login to view full content</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {filteredFeed.length === 0 && (
            <div className="text-center py-12 sm:py-16 px-4">
              <p className="text-gray-500 text-sm sm:text-base">No posts yet</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Check back later for new content</p>
            </div>
          )}
        </main>

        {/* Right Sidebar - Desktop Only */}
        <aside className="hidden xl:block w-72 2xl:w-80 min-h-screen sticky top-16 p-4">
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Join Mimanasa</h2>
            <p className="text-sm text-gray-600 mb-4">
              Access thousands of books, poems, and stories in Hindi and other Indian languages.
            </p>
            <Link 
              to="/register" 
              className="block w-full px-4 py-2.5 bg-primary text-white rounded-full font-bold text-center hover:bg-orange-600 transition-colors mb-2"
            >
              Create account
            </Link>
            <Link 
              to="/login" 
              className="block w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-full font-semibold text-center hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
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
        </aside>
      </div>

      {/* Login Modal - Twitter Style */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setShowLoginModal(false)}
        >
          <div 
            className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
              <h2 className="text-base sm:text-lg font-bold">Login Required</h2>
              <button 
                onClick={() => setShowLoginModal(false)} 
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX size={18} className="sm:hidden" />
                <FiX size={20} className="hidden sm:block" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Please login or create an account to access this content
              </p>
              
              <div className="space-y-2 sm:space-y-3">
                <Link
                  to="/login"
                  className="flex items-center justify-center w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-full font-bold hover:bg-orange-600 transition-all text-sm sm:text-base"
                >
                  <FiLogIn className="mr-2" size={18} />
                  Login to Continue
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center w-full px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all text-sm sm:text-base"
                >
                  <FiUserPlus className="mr-2" size={18} />
                  Create Account
                </Link>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 text-gray-600 hover:bg-gray-100 rounded-full font-semibold transition-all text-sm sm:text-base"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
