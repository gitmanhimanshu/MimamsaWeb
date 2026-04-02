import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FiBook, FiFileText, FiHeadphones, FiVideo, FiClock, FiUser, FiImage, FiX } from 'react-icons/fi';

const Home = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, book, poem, story, audiobook, video, image
  const [selectedImage, setSelectedImage] = useState(null);

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
      case 'image': return <FiImage className="text-primary" size={24} />;
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
      case 'image': return 'Image';
      default: return type;
    }
  };

  const filteredFeed = filter === 'all' ? feed : feed.filter(item => item.type === filter);

  const handleItemClick = (item) => {
    if (item.type === 'image') {
      setSelectedImage(item);
    } else {
      // Navigate to detail page for other types
      if (item.type === 'book') {
        window.location.href = `/book/${item.id}`;
      } else if (item.type === 'poem') {
        window.location.href = '/poems';
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-orange-500 to-orange-600 bg-clip-text text-transparent mb-3 sm:mb-4">
          📚 Discover Literature
        </h1>
        <p className="text-gray-700 text-sm sm:text-base md:text-lg">
          Explore books, poems, stories, audiobooks, and videos - all in one place
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 sm:mb-8 flex flex-wrap gap-2 sm:gap-3">
        {['all', 'book', 'poem', 'story', 'audiobook', 'video', 'image'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all shadow-md ${
              filter === type
                ? 'bg-primary text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            {type === 'all' ? 'All Content' : getTypeLabel(type)}
          </button>
        ))}
      </div>

      {/* Feed Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredFeed.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            onClick={() => handleItemClick(item)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-orange-200 hover:border-primary overflow-hidden group cursor-pointer"
          >
            {/* Cover Image */}
            {item.cover_image && (
              <div className="h-40 sm:h-48 overflow-hidden bg-orange-100">
                <img
                  src={item.cover_image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="p-3 sm:p-4">
              {/* Type Badge */}
              <div className="flex items-center space-x-2 mb-2">
                {getIcon(item.type)}
                <span className="text-xs sm:text-sm font-semibold text-gray-600">
                  {getTypeLabel(item.type)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>

              {/* Author */}
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <FiUser size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">{item.author_name}</span>
              </div>

              {/* Date */}
              <div className="flex items-center space-x-2 text-gray-500 text-xs sm:text-sm">
                <FiClock size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFeed.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-600 text-base sm:text-lg">No content found</p>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
          >
            <FiX size={24} />
          </button>
          
          <div className="max-w-6xl max-h-[90vh] w-full flex flex-col">
            {/* Image */}
            <div className="flex-1 flex items-center justify-center mb-4">
              <img
                src={selectedImage.cover_image}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {/* Image Info */}
            <div 
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {selectedImage.title}
              </h2>
              <div className="flex items-center space-x-4 text-white/80 text-sm sm:text-base">
                <div className="flex items-center space-x-2">
                  <FiUser size={16} />
                  <span>{selectedImage.author_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiClock size={16} />
                  <span>{new Date(selectedImage.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
