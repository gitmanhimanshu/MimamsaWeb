import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FiBook, FiFileText, FiHeadphones, FiVideo, FiImage, FiX, FiHeart, FiMessageCircle, FiRepeat, FiShare, FiMoreHorizontal, FiSend } from 'react-icons/fi';

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

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      console.log('🔄 Fetching feed with user_id:', user?.id);
      const response = await api.get(`/feed/?user_id=${user?.id || ''}`);
      console.log('✅ Feed fetched successfully:', response.data);
      setFeed(response.data.items);
    } catch (error) {
      console.error('❌ Error fetching feed:', error);
      console.error('Error details:', error.response?.data);
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

    console.log('❤️ Toggling like for:', item);
    try {
      const payload = {
        user_id: user.id,
        content_type: item.type,
        content_id: item.id
      };
      console.log('📤 Sending like request:', payload);
      
      const response = await api.post('/likes/toggle/', payload);
      console.log('✅ Like response:', response.data);

      // Update feed with new like status
      setFeed(feed.map(post => {
        if (post.type === item.type && post.id === item.id) {
          return {
            ...post,
            user_liked: response.data.liked,
            like_count: response.data.liked ? post.like_count + 1 : post.like_count - 1
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('❌ Error toggling like:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to like post: ' + (error.response?.data?.error || error.message));
    }
  };

  const openComments = async (item, e) => {
    e.stopPropagation();
    console.log('💬 Opening comments for:', item);
    setSelectedPost(item);
    setCommentModalOpen(true);
    setLoadingComments(true);

    try {
      const response = await api.get(`/comments/?content_type=${item.type}&content_id=${item.id}`);
      console.log('✅ Comments fetched:', response.data);
      setComments(response.data.comments);
    } catch (error) {
      console.error('❌ Error fetching comments:', error);
      console.error('Error details:', error.response?.data);
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

    console.log('💬 Adding comment:', newComment);
    try {
      const payload = {
        user_id: user.id,
        content_type: selectedPost.type,
        content_id: selectedPost.id,
        text: newComment
      };
      console.log('📤 Sending comment request:', payload);
      
      const response = await api.post('/comments/', payload);
      console.log('✅ Comment added:', response.data);

      setComments([response.data.comment, ...comments]);
      setNewComment('');

      // Update comment count in feed
      setFeed(feed.map(post => {
        if (post.type === selectedPost.type && post.id === selectedPost.id) {
          return { ...post, comment_count: post.comment_count + 1 };
        }
        return post;
      }));
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to add comment: ' + (error.response?.data?.error || error.message));
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'book': return <FiBook size={18} />;
      case 'poem': return <FiFileText size={18} />;
      case 'story': return <FiFileText size={18} />;
      case 'audiobook': return <FiHeadphones size={18} />;
      case 'video': return <FiVideo size={18} />;
      case 'image': return <FiImage size={18} />;
      default: return <FiBook size={18} />;
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

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'book': return 'bg-blue-100 text-blue-700';
      case 'poem': return 'bg-purple-100 text-purple-700';
      case 'story': return 'bg-green-100 text-green-700';
      case 'audiobook': return 'bg-orange-100 text-orange-700';
      case 'video': return 'bg-red-100 text-red-700';
      case 'image': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredFeed = filter === 'all' ? feed : feed.filter(item => item.type === filter);

  const handleItemClick = (item) => {
    if (item.type === 'image') {
      setSelectedImage(item);
    } else if (item.type === 'video') {
      setSelectedVideo(item);
    } else if (item.type === 'book') {
      window.location.href = `/book/${item.id}`;
    } else if (item.type === 'poem') {
      window.location.href = '/poems';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">Home</h1>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
          {['all', 'book', 'poem', 'story', 'audiobook', 'video', 'image'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex-shrink-0 px-4 py-4 font-semibold text-sm transition-colors relative ${
                filter === type
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {type === 'all' ? 'For you' : getTypeLabel(type)}
              {filter === type && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Feed - Twitter-like Posts */}
      <div className="divide-y divide-gray-200">
        {filteredFeed.map((item) => (
          <article
            key={`${item.type}-${item.id}`}
            className="p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex space-x-3">
              {/* Author Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-orange-600 flex items-center justify-center text-white font-bold">
                  {item.author_name?.[0]?.toUpperCase() || 'A'}
                </div>
              </div>

              {/* Post Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900 hover:underline">
                      {item.author_name || 'Anonymous'}
                    </span>
                    <span className="text-gray-500 text-sm">
                      @{item.author_name?.toLowerCase().replace(/\s+/g, '') || 'anonymous'}
                    </span>
                    <span className="text-gray-500 text-sm">·</span>
                    <span className="text-gray-500 text-sm">{formatDate(item.created_at)}</span>
                  </div>
                  <button className="text-gray-500 hover:text-primary p-2 hover:bg-orange-50 rounded-full transition-colors">
                    <FiMoreHorizontal size={18} />
                  </button>
                </div>

                {/* Type Badge */}
                <div className="mb-2">
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(item.type)}`}>
                    {getIcon(item.type)}
                    <span>{getTypeLabel(item.type)}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-gray-900 mb-2 cursor-pointer hover:underline" onClick={() => handleItemClick(item)}>
                  {item.title}
                </h3>

                {/* Cover Image */}
                {item.cover_image && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 cursor-pointer" onClick={() => handleItemClick(item)}>
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      className="w-full max-h-96 object-cover"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-3 max-w-md">
                  <button 
                    onClick={(e) => openComments(item, e)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 group"
                  >
                    <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                      <FiMessageCircle size={18} />
                    </div>
                    <span className="text-sm">{item.comment_count || 0}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 group">
                    <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                      <FiRepeat size={18} />
                    </div>
                    <span className="text-sm">0</span>
                  </button>
                  
                  <button 
                    onClick={(e) => handleLike(item, e)}
                    className={`flex items-center space-x-2 group ${item.user_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                  >
                    <div className={`p-2 rounded-full transition-colors ${item.user_liked ? 'bg-red-50' : 'group-hover:bg-red-50'}`}>
                      <FiHeart size={18} fill={item.user_liked ? 'currentColor' : 'none'} />
                    </div>
                    <span className="text-sm">{item.like_count || 0}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-primary group">
                    <div className="p-2 rounded-full group-hover:bg-orange-50 transition-colors">
                      <FiShare size={18} />
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
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No content found</p>
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
            <div className="flex-1 flex items-center justify-center mb-4">
              <img
                src={selectedImage.cover_image}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div 
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {selectedImage.title}
              </h2>
              <div className="flex items-center space-x-4 text-white/80 text-sm sm:text-base">
                <span>{selectedImage.author_name}</span>
                <span>·</span>
                <span>{new Date(selectedImage.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
          >
            <FiX size={24} />
          </button>
          
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-black rounded-lg overflow-hidden mb-4">
              <video 
                controls 
                autoPlay
                className="w-full max-h-[70vh]"
                src={selectedVideo.cover_image}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {selectedVideo.title}
              </h2>
              <div className="flex items-center space-x-4 text-white/80 text-sm sm:text-base">
                <span>{selectedVideo.author_name}</span>
                <span>·</span>
                <span>{new Date(selectedVideo.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {commentModalOpen && selectedPost && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setCommentModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Comments</h2>
              <button
                onClick={() => setCommentModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      {comment.user_photo ? (
                        <img src={comment.user_photo} alt={comment.user_name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-orange-600 flex items-center justify-center text-white font-bold">
                          {comment.user_name?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-2xl px-4 py-2">
                        <p className="font-semibold text-gray-900 text-sm">{comment.user_name}</p>
                        <p className="text-gray-800">{comment.text}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-4">
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  {user?.profile_photo ? (
                    <img src={user.profile_photo} alt={user.username} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-orange-600 flex items-center justify-center text-white font-bold">
                      {user?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="Write a comment..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-primary text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSend size={18} />
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
