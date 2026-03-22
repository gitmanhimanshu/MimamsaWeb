import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FiBook, FiFileText, FiHeadphones, FiVideo, FiClock, FiUser } from 'react-icons/fi';

const Home = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, book, poem, story, audiobook, video

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

  const filteredFeed = filter === 'all' ? feed : feed.filter(item => item.type === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
          📚 Discover Literature
        </h1>
        <p className="text-gray-700 text-lg">
          Explore books, poems, stories, audiobooks, and videos - all in one place
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-8 flex flex-wrap gap-3">
        {['all', 'book', 'poem', 'story', 'audiobook', 'video'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFeed.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            to={item.type === 'book' ? `/book/${item.id}` : item.type === 'poem' ? '/poems' : '/home'}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 border-orange-200 hover:border-primary overflow-hidden group"
          >
            {/* Cover Image */}
            {item.cover_image && (
              <div className="h-48 overflow-hidden bg-orange-100">
                <img
                  src={item.cover_image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="p-4">
              {/* Type Badge */}
              <div className="flex items-center space-x-2 mb-2">
                {getIcon(item.type)}
                <span className="text-sm font-semibold text-gray-600">
                  {getTypeLabel(item.type)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>

              {/* Author */}
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <FiUser size={16} />
                <span className="text-sm">{item.author_name}</span>
              </div>

              {/* Date */}
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <FiClock size={14} />
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredFeed.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No content found</p>
        </div>
      )}
    </div>
  );
};

export default Home;
