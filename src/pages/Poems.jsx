import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft, FiStar, FiTrash2, FiEdit3 } from 'react-icons/fi';
import AddUserPoemModal from '../components/AddUserPoemModal';

const Poems = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [poems, setPoems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Review states
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showAddPoemModal, setShowAddPoemModal] = useState(false);
  const [myPoems, setMyPoems] = useState([]);
  const [showMyPoems, setShowMyPoems] = useState(false);

  useEffect(() => {
    fetchData();
    fetchMyPoems();
  }, []);

  useEffect(() => {
    if (selectedPoem) {
      fetchReviews();
    }
  }, [selectedPoem]);

  const fetchData = async () => {
    try {
      const [categoriesRes, poemsRes] = await Promise.all([
        api.get('/poem-categories/'),
        api.get('/poems/')
      ]);
      setCategories(categoriesRes.data);
      setPoems(poemsRes.data);
    } catch (error) {
      console.error('Error fetching poems:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPoems = async () => {
    try {
      const response = await api.get(`/user-poems/?user_id=${user.id}`);
      setMyPoems(response.data);
    } catch (error) {
      console.error('Error fetching my poems:', error);
    }
  };

  const fetchReviews = async () => {
    if (!selectedPoem) return;
    
    try {
      const response = await api.get(`/poems/${selectedPoem.id}/reviews/`);
      setReviews(response.data);
      
      const myReview = response.data.find(r => r.user === user.id);
      setUserReview(myReview || null);
      if (myReview) {
        setReviewForm({ rating: myReview.rating, comment: myReview.comment || '' });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.post(`/poems/${selectedPoem.id}/reviews/`, {
        user_id: user.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      
      setShowReviewModal(false);
      fetchReviews();
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!confirm('Are you sure you want to delete your review?')) return;
    
    try {
      await api.delete(`/poems/${selectedPoem.id}/reviews/user/`, {
        data: { user_id: user.id }
      });
      
      setUserReview(null);
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
      alert('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const getFilteredPoems = () => {
    if (showMyPoems) return myPoems;
    if (!selectedCategory) return poems;
    return poems.filter(p => p.category === selectedCategory);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Poem Detail View
  if (selectedPoem) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => setSelectedPoem(null)}
          className="flex items-center space-x-2 text-gray-700 hover:text-primary mb-6 transition-colors font-semibold"
        >
          <FiArrowLeft />
          <span>Back to Poems</span>
        </button>

        {/* Poem Content */}
        <div className="bg-white rounded-xl p-8 mb-8 shadow-lg border-2 border-orange-200">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{selectedPoem.title}</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            {selectedPoem.author_name && (
              <div>
                <p className="text-xs text-gray-500">Written by</p>
                <p className="text-primary font-semibold text-lg">{selectedPoem.author_name}</p>
              </div>
            )}
            {selectedPoem.category_name && (
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{selectedPoem.category_icon}</span>
                <span className="text-primary font-semibold">{selectedPoem.category_name}</span>
              </div>
            )}
          </div>

          <div className="bg-orange-50 rounded-xl p-6 mb-6 border border-orange-200">
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap font-serif">
              {selectedPoem.content}
            </p>
          </div>

          <p className="text-gray-600 text-center font-medium">
            {new Date(selectedPoem.created_at).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Reviews & Ratings</h2>
            {selectedPoem.average_rating > 0 && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-yellow-500">
                  <FiStar className="fill-current" />
                  <span className="ml-1 text-lg font-bold">{selectedPoem.average_rating}</span>
                </div>
                <span className="text-gray-600">({selectedPoem.review_count} reviews)</span>
              </div>
            )}
          </div>

          {/* Write Review Button */}
          <button
            onClick={() => setShowReviewModal(true)}
            className="w-full mb-6 bg-orange-50 hover:bg-orange-100 border-2 border-primary text-primary font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <span>{userReview ? '✏️' : '⭐'}</span>
            <span>{userReview ? 'Edit Your Review' : 'Write a Review'}</span>
          </button>

          {/* User's Review */}
          {userReview && (
            <div className="bg-orange-50 border-2 border-primary p-4 rounded-xl mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-primary font-bold">Your Review</span>
                <button
                  onClick={handleDeleteReview}
                  className="text-red-600 hover:text-red-700 flex items-center space-x-1 font-semibold"
                >
                  <FiTrash2 size={16} />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
              <div className="flex items-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <FiStar
                    key={star}
                    className={star <= userReview.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}
                  />
                ))}
              </div>
              {userReview.comment && (
                <p className="text-gray-700">{userReview.comment}</p>
              )}
            </div>
          )}

          {/* All Reviews */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">All Reviews ({reviews.length})</h3>
              {reviews.map(review => (
                <div key={review.id} className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-800 font-semibold">{review.user_name}</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <FiStar
                          key={star}
                          size={14}
                          className={star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                  )}
                  <p className="text-gray-500 text-sm">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8 bg-orange-50 rounded-xl">
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border-2 border-orange-200 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {userReview ? 'Edit Review' : 'Write a Review'}
              </h3>
              
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-semibold">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="text-3xl focus:outline-none"
                      >
                        <FiStar
                          className={star <= reviewForm.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2 font-semibold">Comment (optional)</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full px-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-800 focus:outline-none focus:border-primary resize-none"
                    rows="4"
                    placeholder="Share your thoughts about this poem..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-primary hover:bg-orange-600 text-white rounded-xl transition-colors disabled:opacity-50 font-semibold"
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Poems List View
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">कविताएँ (Poems)</h1>
        <button
          onClick={() => setShowAddPoemModal(true)}
          className="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center space-x-2 shadow-lg"
        >
          <FiEdit3 size={20} />
          <span>Write Your Poem</span>
        </button>
      </div>

      {/* My Poems Section */}
      {myPoems.length > 0 && (
        <div className="mb-8">
          <button
            onClick={() => {
              setShowMyPoems(!showMyPoems);
              setSelectedCategory(null);
            }}
            className="w-full bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all border-2 border-orange-200 hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-2xl">
                  ✍️
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-primary">My Poems</h3>
                  <p className="text-gray-600">{myPoems.length} poems written by you</p>
                </div>
              </div>
              <span className="text-2xl text-primary font-bold">
                {showMyPoems ? '▼' : '▶'}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Categories */}
      {!showMyPoems && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">श्रेणियाँ</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm ${
                !selectedCategory
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-orange-50'
              }`}
            >
              सभी
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 shadow-sm ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-orange-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="bg-orange-100 text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                  {cat.poems_count || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Poems Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {showMyPoems
            ? 'मेरी कविताएँ'
            : selectedCategory
              ? categories.find(c => c.id === selectedCategory)?.name || 'कविताएँ'
              : 'सभी कविताएँ'}
        </h2>
        
        {getFilteredPoems().length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <p className="text-6xl mb-4">📝</p>
            <p className="text-gray-600 text-lg">कोई कविता नहीं मिली</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredPoems().map(poem => (
              <div
                key={poem.id}
                onClick={() => setSelectedPoem(poem)}
                className="bg-white rounded-xl p-6 border-2 border-orange-100 hover:border-primary transition-all cursor-pointer hover:transform hover:scale-105 shadow-md hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex-1 line-clamp-2">
                    {poem.title}
                  </h3>
                  {poem.category_icon && (
                    <span className="text-2xl ml-2">{poem.category_icon}</span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {poem.content}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-orange-100">
                  <div>
                    {poem.author_name ? (
                      <>
                        <p className="text-xs text-gray-500">Written by</p>
                        <p className="text-primary font-semibold">{poem.author_name}</p>
                      </>
                    ) : (
                      <p className="text-primary font-semibold">Anonymous</p>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">
                    {new Date(poem.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add User Poem Modal */}
      <AddUserPoemModal
        show={showAddPoemModal}
        onClose={() => setShowAddPoemModal(false)}
        onSuccess={() => {
          fetchData();
          fetchMyPoems();
          setSelectedCategory(null);
        }}
      />
    </div>
  );
};

export default Poems;
