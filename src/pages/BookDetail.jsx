import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiArrowLeft, FiStar, FiTrash2, FiBookmark, FiDownload, FiShare2 } from 'react-icons/fi';

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
    <div className="min-h-screen bg-darker pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-darker/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-white">Book Details</h1>
          <button className="text-gray-400 hover:text-white transition-colors">
            <FiShare2 size={24} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Book Cover */}
        <div className="flex justify-center mb-6">
          {book.cover_image_url ? (
            <img
              src={book.cover_image_url}
              alt={book.title}
              className="w-48 md:w-64 rounded-2xl shadow-2xl"
            />
          ) : (
            <div className="w-48 md:w-64 aspect-[2/3] bg-dark rounded-2xl flex items-center justify-center">
              <span className="text-6xl">📚</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-3">
          {book.title}
        </h2>

        {/* Author */}
        {book.author_name && (
          <p className="text-lg text-primary text-center mb-4 italic">
            by {book.author_name}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map(star => (
              <FiStar
                key={star}
                size={20}
                className={star <= Math.round(book.average_rating || 0) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}
              />
            ))}
          </div>
          <span className="text-white font-semibold">
            {book.average_rating > 0 ? book.average_rating.toFixed(1) : '0.0'}
          </span>
          <span className="text-gray-400">
            ({book.review_count || 0} reviews)
          </span>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-dark rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">CATEGORY</p>
            <p className="text-primary font-semibold">{book.category_name || 'N/A'}</p>
          </div>
          <div className="bg-dark rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">PAGES</p>
            <p className="text-primary font-semibold">{book.pages || '342'}</p>
          </div>
          <div className="bg-dark rounded-xl p-4 text-center">
            <p className="text-gray-400 text-sm mb-1">LANGUAGE</p>
            <p className="text-primary font-semibold">{book.language || 'Hindi'}</p>
          </div>
        </div>

        {/* Synopsis */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Synopsis</h3>
          <p className="text-gray-300 leading-relaxed">
            {book.description || 'No description available for this book.'}
          </p>
        </div>

        {/* Additional Info */}
        {(book.genre_display || book.published_year) && (
          <div className="flex flex-wrap gap-3 mb-8">
            {book.genre_display && (
              <span className="px-4 py-2 bg-dark text-gray-300 rounded-full text-sm">
                🎭 {book.genre_display}
              </span>
            )}
            {book.published_year && (
              <span className="px-4 py-2 bg-dark text-gray-300 rounded-full text-sm">
                📅 {book.published_year}
              </span>
            )}
            {book.is_paid && book.price && (
              <span className="px-4 py-2 bg-success text-white rounded-full text-sm font-semibold">
                ₹{book.price}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={openReader}
            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-lg"
          >
            <span className="text-xl">📖</span>
            <span className="text-lg">Read Now</span>
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-dark hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 border border-gray-700">
              <FiBookmark size={18} />
              <span>Save</span>
            </button>
            <button className="bg-dark hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 border border-gray-700">
              <FiDownload size={18} />
              <span>Offline</span>
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Reviews</h3>
            <button
              onClick={() => setShowReviewModal(true)}
              className="text-primary hover:text-blue-400 font-semibold flex items-center space-x-1"
            >
              <FiStar size={18} />
              <span>{userReview ? 'Edit' : 'Write'}</span>
            </button>
          </div>

          {/* User's Review */}
          {userReview && (
            <div className="bg-dark border-2 border-primary p-4 rounded-xl mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-primary font-semibold">Your Review</span>
                <button
                  onClick={handleDeleteReview}
                  className="text-red-400 hover:text-red-300 flex items-center space-x-1"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              <div className="flex items-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <FiStar
                    key={star}
                    size={16}
                    className={star <= userReview.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}
                  />
                ))}
              </div>
              {userReview.comment && (
                <p className="text-gray-300 text-sm">{userReview.comment}</p>
              )}
            </div>
          )}

          {/* All Reviews */}
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map(review => (
                <div key={review.id} className="bg-dark p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold text-sm">{review.user_name}</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <FiStar
                          key={star}
                          size={12}
                          className={star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-300 text-sm mb-2">{review.comment}</p>
                  )}
                  <p className="text-gray-500 text-xs">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-dark p-8 rounded-xl text-center">
              <p className="text-gray-400">No reviews yet. Be the first to review!</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-darker rounded-2xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">
              {userReview ? 'Edit Review' : 'Write a Review'}
            </h3>
            
            <form onSubmit={handleSubmitReview}>
              {/* Rating */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-3 font-semibold">Rating</label>
                <div className="flex justify-center space-x-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="text-4xl focus:outline-none transition-transform hover:scale-110"
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
                <label className="block text-gray-300 mb-2 font-semibold">Comment (optional)</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-3 bg-dark border border-gray-700 rounded-xl text-white focus:outline-none focus:border-primary resize-none"
                  rows="4"
                  placeholder="Share your thoughts about this book..."
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-3 bg-dark hover:bg-gray-800 text-white rounded-xl transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-primary hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-50 font-semibold"
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
