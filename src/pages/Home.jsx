import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FiBook, FiFileText, FiHeadphones, FiVideo, FiImage, FiX, FiHeart, FiMessageCircle, FiRepeat, FiShare, FiSend, FiBookmark } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';

const Home = () => {
  const { user } = useAuth();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [expandedPoems, setExpandedPoems] = useState({});

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await api.get(`/feed/?user_id=${user?.id || ''}`);
      setFeed(response.data.items);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (item, e) => {
    e.stopPropagation();
    if (!user) {
      alert('Please login to like posts');
      return;
    }

    try {
      const response = await api.post('/likes/toggle/', {
        user_id: user.id,
        content_type: item.type,
        content_id: item.id
      });

      setFeed(feed.map(post => {
        if (post.type === item.type && post.id === item.id) {
          return {
            ...post,
            user_liked: response.data.liked,
            like_count: response.data.liked ? (post.like_count || 0) + 1 : Math.max((post.like_count || 0) - 1, 0)
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const openComments = async (item, e) => {
    e.stopPropagation();
    setSelectedPost(item);
    setCommentModalOpen(true);
    setLoadingComments(true);

    try {
      const response = await api.get(`/comments/?content_type=${item.type}&content_id=${item.id}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      alert('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;

    try {
      const response = await api.post('/comments/', {
        user_id: user.id,
        content_type: selectedPost.type,
        content_id: selectedPost.id,
        text: newComment
      });

      setComments([response.data.comment, ...comments]);
      setNewComment('');

      setFeed(feed.map(post => {
        if (post.type === selectedPost.type && post.id === selectedPost.id) {
          return { ...post, comment_count: (post.comment_count || 0) + 1 };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const toggleDescription = (itemKey) => {
    setExpandedDescriptions(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  const togglePoem = (itemKey) => {
    setExpandedPoems(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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

  const filteredFeed = filter === 'all' ? feed : feed.filter(item => item.type === filter);

  const handleItemClick = (item) => {
    if (item.type === 'image') setSelectedImage(item);
    else if (item.type === 'video') setSelectedVideo(item);
    else if (item.type === 'book') window.location.href = `/book/${item.id}`;
    else if (item.type === 'poem') window.location.href = '/poems';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="pb-16 lg:pb-0">
      {/* Header - Twitter Style */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-10">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
          {['all', 'book', 'poem', 'story', 'audiobook', 'video', 'image'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex-shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition-all relative ${
                filter === type ? 'text-gray-900' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="hidden sm:inline">{type === 'all' ? 'For you' : getTypeLabel(type)}</span>
              <span className="sm:hidden">{type === 'all' ? 'All' : getTypeLabel(type).split(' ')[0]}</span>
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
                <h3 className="text-xs sm:text-sm md:text-[15px] font-normal text-gray-900 mb-1.5 sm:mb-2 break-words leading-normal" onClick={() => handleItemClick(item)}>
                  {item.title}
                </h3>

                {/* Description */}
                {item.description && (
                  <div className="text-gray-700 text-xs sm:text-sm mb-1.5 sm:mb-2 leading-normal">
                    <p className="whitespace-pre-wrap break-words">
                      {expandedDescriptions[`${item.type}-${item.id}`] 
                        ? item.description 
                        : truncateText(item.description, 200)}
                    </p>
                    {item.description.length > 200 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDescription(`${item.type}-${item.id}`);
                        }}
                        className="text-primary hover:underline font-normal mt-0.5 sm:mt-1 text-xs sm:text-sm"
                      >
                        {expandedDescriptions[`${item.type}-${item.id}`] ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>
                )}

                {/* Poem Content */}
                {item.type === 'poem' && item.content && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-2 sm:mb-3 border border-orange-200/50">
                    <p className="text-gray-800 text-xs sm:text-sm italic whitespace-pre-wrap font-serif leading-relaxed break-words">
                      {expandedPoems[`${item.type}-${item.id}`] 
                        ? item.content 
                        : truncateText(item.content, 250)}
                    </p>
                    {item.content.length > 250 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePoem(`${item.type}-${item.id}`);
                        }}
                        className="text-primary hover:underline font-normal mt-1.5 sm:mt-2 text-xs sm:text-sm"
                      >
                        {expandedPoems[`${item.type}-${item.id}`] ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                )}

                {/* Cover Image */}
                {item.cover_image && (
                  <div className="mt-2 sm:mt-3 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200" onClick={() => handleItemClick(item)}>
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      className="w-full max-h-[400px] sm:max-h-[500px] object-cover"
                    />
                  </div>
                )}

                {/* Actions - Twitter Style */}
                <div className="flex items-center justify-between mt-2 sm:mt-3 max-w-md -ml-1 sm:-ml-2">
                  <button 
                    onClick={(e) => openComments(item, e)}
                    className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-blue-500 group"
                  >
                    <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                      <FiMessageCircle size={16} className="sm:hidden" />
                      <FiMessageCircle size={18} className="hidden sm:block" />
                    </div>
                    <span className="text-xs sm:text-sm group-hover:text-blue-500">{item.comment_count || 0}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-green-500 group">
                    <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-green-50 transition-colors">
                      <FiRepeat size={16} className="sm:hidden" />
                      <FiRepeat size={18} className="hidden sm:block" />
                    </div>
                    <span className="text-xs sm:text-sm group-hover:text-green-500">0</span>
                  </button>
                  
                  <button 
                    onClick={(e) => handleLike(item, e)}
                    className={`flex items-center space-x-1 sm:space-x-2 group ${item.user_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                  >
                    <div className={`p-1.5 sm:p-2 rounded-full transition-colors ${item.user_liked ? 'bg-red-50' : 'group-hover:bg-red-50'}`}>
                      <FiHeart size={16} fill={item.user_liked ? 'currentColor' : 'none'} className="sm:hidden" />
                      <FiHeart size={18} fill={item.user_liked ? 'currentColor' : 'none'} className="hidden sm:block" />
                    </div>
                    <span className={`text-xs sm:text-sm ${item.user_liked ? 'text-red-500' : 'group-hover:text-red-500'}`}>
                      {item.like_count || 0}
                    </span>
                  </button>
                  
                  <button className="flex items-center space-x-1 sm:space-x-2 text-gray-500 hover:text-primary group">
                    <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-orange-50 transition-colors">
                      <FiShare size={16} className="sm:hidden" />
                      <FiShare size={18} className="hidden sm:block" />
                    </div>
                  </button>

                  <button className="text-gray-500 hover:text-primary group">
                    <div className="p-1.5 sm:p-2 rounded-full group-hover:bg-orange-50 transition-colors">
                      <FiBookmark size={16} className="sm:hidden" />
                      <FiBookmark size={18} className="hidden sm:block" />
                    </div>
                  </button>
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

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors backdrop-blur-sm"
          >
            <FiX size={20} className="sm:hidden" />
            <FiX size={24} className="hidden sm:block" />
          </button>
          
          <div className="max-w-6xl w-full">
            <img
              src={selectedImage.cover_image}
              alt={selectedImage.title}
              className="w-full max-h-[75vh] sm:max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-3 sm:mt-4 text-center px-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">{selectedImage.title}</h2>
              <p className="text-gray-300 text-xs sm:text-sm mt-1">{selectedImage.author_name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors backdrop-blur-sm"
          >
            <FiX size={20} className="sm:hidden" />
            <FiX size={24} className="hidden sm:block" />
          </button>
          
          <div className="max-w-4xl w-full">
            <video 
              controls 
              autoPlay
              className="w-full rounded-lg"
              src={selectedVideo.cover_image}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-3 sm:mt-4 text-center px-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">{selectedVideo.title}</h2>
              <p className="text-gray-300 text-xs sm:text-sm mt-1">{selectedVideo.author_name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {commentModalOpen && selectedPost && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setCommentModalOpen(false)}
        >
          <div 
            className="bg-white rounded-xl sm:rounded-2xl max-w-xl w-full max-h-[85vh] sm:max-h-[80vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
              <h2 className="text-base sm:text-lg font-bold">Comments</h2>
              <button onClick={() => setCommentModalOpen(false)} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full">
                <FiX size={18} className="sm:hidden" />
                <FiX size={20} className="hidden sm:block" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {loadingComments ? (
                <div className="flex justify-center py-6 sm:py-8">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-primary border-t-transparent"></div>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <FiMessageCircle size={40} className="mx-auto mb-2 sm:mb-3 text-gray-300 sm:w-12 sm:h-12" />
                  <p className="font-semibold text-sm sm:text-base">No comments yet</p>
                  <p className="text-xs sm:text-sm mt-1">Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-2 sm:space-x-3">
                    <div className="flex-shrink-0">
                      {comment.user_photo ? (
                        <img src={comment.user_photo} alt={comment.user_name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                          {comment.user_name?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-xl sm:rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2">
                        <p className="font-semibold text-xs sm:text-sm">{comment.user_name}</p>
                        <p className="text-xs sm:text-sm text-gray-800 break-words">{comment.text}</p>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 ml-3 sm:ml-4">{formatDate(comment.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 sm:p-4 border-t">
              <div className="flex space-x-2 sm:space-x-3">
                <div className="flex-shrink-0">
                  {user?.profile_photo ? (
                    <img src={user.profile_photo} alt={user.username} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      {user?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex space-x-1.5 sm:space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary text-xs sm:text-sm"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSend size={14} className="sm:hidden" />
                    <FiSend size={18} className="hidden sm:block" />
                  </button>
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
