import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  FiBook, FiFileText, FiHeadphones, FiVideo, FiImage,
  FiHeart, FiMessageCircle, FiBookmark, FiArrowLeft, FiTrash2
} from 'react-icons/fi';

const SavedItems = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      const response = await api.get(`/bookmarks/?user_id=${user.id}`);
      const bookmarksWithDetails = await Promise.all(
        response.data.bookmarks.map(async (bm) => {
          try {
            let detailRes;
            switch (bm.content_type) {
              case 'book': detailRes = await api.get(`/books/${bm.content_id}/`); break;
              case 'poem': detailRes = await api.get(`/poems/${bm.content_id}/`); break;
              case 'story': detailRes = await api.get(`/stories/${bm.content_id}/`); break;
              case 'audiobook': detailRes = await api.get(`/audiobooks/${bm.content_id}/`); break;
              case 'video': detailRes = await api.get(`/videos/${bm.content_id}/`); break;
              case 'image': detailRes = await api.get(`/images/${bm.content_id}/`); break;
              default: return { ...bm, detail: null };
            }
            return { ...bm, detail: detailRes.data };
          } catch (err) {
            return { ...bm, detail: null };
          }
        })
      );
      setBookmarks(bookmarksWithDetails.filter(bm => bm.detail !== null));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      addToast('Failed to load saved items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (bookmark) => {
    setRemovingId(bookmark.id);
    try {
      await api.post('/bookmarks/toggle/', {
        user_id: user.id,
        content_type: bookmark.content_type,
        content_id: bookmark.content_id
      });
      setTimeout(() => {
        setBookmarks(prev => prev.filter(bm => bm.id !== bookmark.id));
        setRemovingId(null);
        addToast('Removed from saved', 'info');
      }, 300);
    } catch (error) {
      console.error('Error unsaving:', error);
      setRemovingId(null);
      addToast('Failed to remove', 'error');
    }
  };

  const getIcon = (type) => {
    const icons = {
      book: <FiBook size={16} />,
      poem: <FiFileText size={16} />,
      story: <FiFileText size={16} />,
      audiobook: <FiHeadphones size={16} />,
      video: <FiVideo size={16} />,
      image: <FiImage size={16} />
    };
    return icons[type] || <FiBook size={16} />;
  };

  const getTypeLabel = (type) => {
    const labels = {
      book: 'Book', poem: 'Poem', story: 'Story',
      audiobook: 'Audiobook', video: 'Video', image: 'Image'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      book: 'bg-blue-50 text-blue-600 border-blue-100',
      poem: 'bg-purple-50 text-purple-600 border-purple-100',
      story: 'bg-green-50 text-green-600 border-green-100',
      audiobook: 'bg-orange-50 text-orange-600 border-orange-100',
      video: 'bg-red-50 text-red-600 border-red-100',
      image: 'bg-pink-50 text-pink-600 border-pink-100',
    };
    return colors[type] || 'bg-gray-50 text-gray-600 border-gray-100';
  };

  const filteredBookmarks = filter === 'all'
    ? bookmarks
    : bookmarks.filter(bm => bm.content_type === filter);

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'book', label: 'Books' },
    { value: 'poem', label: 'Poems' },
    { value: 'story', label: 'Stories' },
    { value: 'audiobook', label: 'Audio' },
    { value: 'video', label: 'Videos' },
    { value: 'image', label: 'Images' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50/50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-white pb-12 sm:pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center space-x-3">
          <button
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Saved Items</h1>
            <p className="text-xs text-gray-500">{bookmarks.length} items in your collection</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                filter === f.value
                  ? 'bg-primary text-white shadow-lg shadow-orange-200 scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmarks Grid */}
      <div className="max-w-3xl mx-auto px-3 sm:px-4">
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-16 sm:py-24 px-4">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center shadow-inner">
              <FiBookmark size={32} className="text-primary/60" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {filter === 'all' ? 'No saved items yet' : `No saved ${getTypeLabel(filter)}s`}
            </h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              {filter === 'all'
                ? 'Tap the bookmark icon on any post to save it here for later'
                : `You haven't saved any ${getTypeLabel(filter)}s yet`}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {filteredBookmarks.map(bookmark => {
              const detail = bookmark.detail;
              const isRemoving = removingId === bookmark.id;
              return (
                <div
                  key={bookmark.id}
                  className={`group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${isRemoving ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'}`}
                >
                  <div className="flex p-3 sm:p-4 gap-3 sm:gap-4">
                    {/* Cover Image */}
                    <div className="flex-shrink-0">
                      {detail.cover_image_url || detail.background_image_url || detail.thumbnail_url || detail.image_url ? (
                        <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden shadow-sm">
                          <img
                            src={detail.cover_image_url || detail.background_image_url || detail.thumbnail_url || detail.image_url}
                            alt={detail.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center shadow-sm">
                          {getIcon(bookmark.content_type)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getTypeColor(bookmark.content_type)} mb-2`}>
                            {getIcon(bookmark.content_type)}
                            {getTypeLabel(bookmark.content_type)}
                          </span>

                          <h3
                            className="text-sm sm:text-base font-bold text-gray-900 leading-tight mb-1 cursor-pointer hover:text-primary transition-colors line-clamp-2"
                            onClick={() => {
                              if (bookmark.content_type === 'book') navigate(`/book/${bookmark.content_id}`);
                              else if (bookmark.content_type === 'poem') navigate('/poems');
                            }}
                          >
                            {detail.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
                            {detail.description || detail.content || 'No description available'}
                          </p>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => handleUnsave(bookmark)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                          title="Remove"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>

                      {/* Footer */}
                      <div className="mt-auto pt-2 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          {detail.average_rating > 0 && (
                            <span className="flex items-center gap-1">
                              <FiHeart size={12} className="text-red-400" />
                              <span>{detail.average_rating}★</span>
                            </span>
                          )}
                          {detail.review_count > 0 && (
                            <span className="flex items-center gap-1">
                              <FiMessageCircle size={12} />
                              <span>{detail.review_count} reviews</span>
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-gray-400">
                          Saved {new Date(bookmark.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedItems;
