import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft, FiStar, FiTrash2, FiEdit } from 'react-icons/fi';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookDetails();
    fetchReviews();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await api.get(`/books/${id}/`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/books/${id}/reviews/`);
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
      await api.post(`/books/${id}/reviews/`, {
        user_id: user.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      
      setShowReviewModal(false);
      fetchReviews();
      fetchBookDetails();
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
      await api.delete(`/books/${id}/reviews/user/`, {
        data: { user_id: user.id }
      });
      
      setUserReview(null);
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
      fetchBookDetails();
      alert('Review deleted successfully!');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const openReader = () => {
    if (book.content_url) {
      window.open(book.content_url, '_blank');
    } else {
      alert('No file available to read');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Book not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <FiArrowLeft />
        <span>Back to Library</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Cover Image */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {book.cover_image_url ? (
              <img
                src={book.cover_image_url}
                alt={book.title}
                className="w-full rounded-lg shadow-2xl"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-darker rounded-lg flex items-center justify-center">
                <span className="text-8xl">📚</span>
              </div>
            )}
            
            {/* Read Button */}
            <button
              onClick={openReader}
              className="w-full mt-6 bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>📖</span>
              <span>{book.is_paid ? 'Buy & Read' : 'Read Now'}</span>
            </button>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2">
          {/* Title & Author */}
          <h1 className="text-4xl font-bold text-white mb-4">{book.title}</h1>
          {book.author_name && (
            <p className="text-xl text-gray-400 mb-6">by {book.author_name}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 mb-6">
            {book.category_name && (
              <span className="px-4 py-2 bg-primary text-white rounded-full text-sm">
                📂 {book.category_name}
              </span>
            )}
            {book.genre_display && (
              <span className="px-4 py-2 bg-accent text-white rounded-full text-sm">
                🎭 {book.genre_display}
              </span>
            )}
            {book.language && (
              <span className="px-4 py-2 bg-success text-white rounded-full text-sm">
                🌐 {book.language}
              </span>
            )}
            {book.published_year && (
              <span className="px-4 py-2 bg-dark border border-gray-700 text-gray-300 rounded-full text-sm">
                📅 {book.published_year}
              </span>
            )}
          </div>

          {/* Price */}
          {book.is_paid && book.price && (
            <div className="bg-dark border-l-4 border-success p-4 rounded-lg mb-6">
              <p className="text-gray-400 text-sm mb-1">Price</p>
              <p className="text-3xl font-bold text-success">₹{book.price}</p>
            </div>
          )}

          {/* Description */}
          {book.description && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">📖 About this book</h2>
              <p className="text-gray-300 leading-relaxed">{book.description}</p>
            </div>
          )}

          {/* Reviews Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Reviews & Ratings</h2>
              {book.average_rating > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-yellow-500">
                    <FiStar className="fill-current" />
                    <span className="ml-1 text-lg font-bold">{book.average_rating}</span>
                  </div>
                  <span className="text-gray-400">({book.review_count} reviews)</span>
                </div>
              )}
            </div>

            {/* Write Review Button */}
            <button
              onClick={() => setShowReviewModal(true)}
              className="w-full mb-6 bg-dark hover:bg-gray-800 border border-gray-700 text-primary font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>{userReview ? '✏️' : '⭐'}</span>
              <span>{userReview ? 'Edit Your Review' : 'Write a Review'}</span>
            </button>

            {/* User's Review */}
            {userReview && (
              <div className="bg-dark border-2 border-primary p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-primary font-semibold">Your Review</span>
                  <button
                    onClick={handleDeleteReview}
                    className="text-red-400 hover:text-red-300 flex items-center space-x-1"
                  >
                    <FiTrash2 size={16} />
                    <span className="text-sm">Delete</span>
                  </button>
                </div>
                <div className="flex items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FiStar
                      key={star}
                      className={star <= userReview.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}
                    />
                  ))}
                </div>
                {userReview.comment && (
                  <p className="text-gray-300">{userReview.comment}</p>
                )}
              </div>
            )}

            {/* All Reviews */}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">All Reviews ({reviews.length})</h3>
                {reviews.map(review => (
                  <div key={review.id} className="bg-dark p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">{review.user_name}</span>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <FiStar
                            key={star}
                            size={14}
                            className={star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-gray-300 mb-2">{review.comment}</p>
                    )}
                    <p className="text-gray-500 text-sm">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                No reviews yet. Be the first to review!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">
              {userReview ? 'Edit Review' : 'Write a Review'}
            </h3>
            
            <form onSubmit={handleSubmitReview}>
              {/* Rating */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="text-3xl focus:outline-none"
                    >
                      <FiStar
                        className={star <= reviewForm.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Comment (optional)</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-3 bg-darker border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary resize-none"
                  rows="4"
                  placeholder="Share your thoughts about this book..."
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
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
};

export default BookDetail;
