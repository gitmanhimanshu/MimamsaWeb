import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const StoriesBar = ({ onViewStory, onCreateStory }) => {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchStories();
    // Refresh every 2 minutes
    const interval = setInterval(fetchStories, 120000);
    // Listen for manual refresh
    const handleRefresh = () => fetchStories();
    window.addEventListener('refresh-stories', handleRefresh);
    return () => {
      clearInterval(interval);
      window.removeEventListener('refresh-stories', handleRefresh);
    };
  }, [user?.id]);

  const fetchStories = async () => {
    try {
      const response = await api.get(`/stories/?user_id=${user?.id || ''}`);
      setStories(response.data.bar_stories || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1.5">
              <div className="w-16 h-16 rounded-full bg-gray-100 animate-pulse" />
              <div className="w-12 h-3 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative border-b border-gray-100 bg-white">
      {/* Left Arrow - desktop only */}
      <button
        onClick={() => scroll('left')}
        className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur rounded-full shadow-md items-center justify-center text-gray-600 hover:text-primary transition-colors"
      >
        <FiChevronLeft size={20} />
      </button>

      {/* Stories Scroll */}
      <div
        ref={scrollRef}
        className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Add Story Button */}
        {user && (
          <button
            onClick={onCreateStory}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
          >
            <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px]">
              {user.profile_photo ? (
                <img
                  src={user.profile_photo}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover border-2 border-dashed border-gray-300 group-hover:border-primary transition-colors p-0.5"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-lg border-2 border-dashed border-gray-300 group-hover:border-primary transition-colors">
                  {user.username?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <FiPlus size={14} className="text-white" />
              </div>
            </div>
            <span className="text-[11px] font-medium text-gray-600 truncate max-w-[64px]">Your Story</span>
          </button>
        )}

        {/* Story Items */}
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => onViewStory(story.user)}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
          >
            <div className={`relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full p-[3px] ${
              story.is_viewed
                ? 'bg-gray-200'
                : 'bg-gradient-to-tr from-yellow-400 via-primary to-purple-500'
            }`}>
              <div className="w-full h-full rounded-full bg-white p-[2px]">
                {story.user_photo ? (
                  <img
                    src={story.user_photo}
                    alt={story.user_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                    {story.user_name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <span className="text-[11px] font-medium text-gray-700 truncate max-w-[64px] group-hover:text-primary transition-colors">
              {story.user_name}
            </span>
          </button>
        ))}

        {stories.length === 0 && !user && (
          <div className="flex-shrink-0 text-center py-2 text-gray-400 text-sm">
            No stories yet
          </div>
        )}
      </div>

      {/* Right Arrow - desktop only */}
      <button
        onClick={() => scroll('right')}
        className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur rounded-full shadow-md items-center justify-center text-gray-600 hover:text-primary transition-colors"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
};

export default StoriesBar;
