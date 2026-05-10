import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FiX, FiTrash2, FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';

const STORY_DURATION = 5000; // 5 seconds per story

const StoryViewer = ({ userId, onClose }) => {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedProgressRef = useRef(0);

  useEffect(() => {
    fetchUserStories();
  }, [userId]);

  const fetchUserStories = async () => {
    try {
      const response = await api.get(`/stories/user/${userId}/?viewer_id=${user?.id || ''}`);
      setStories(response.data.stories || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setLoading(false);
    }
  };

  const markAsViewed = useCallback(async (storyId) => {
    if (!user?.id) return;
    try {
      await api.get(`/stories/${storyId}/?user_id=${user.id}`);
    } catch (error) {
      console.error('Error marking story as viewed:', error);
    }
  }, [user]);

  // Progress bar animation
  useEffect(() => {
    if (stories.length === 0 || isPaused) return;

    startTimeRef.current = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const totalProgress = pausedProgressRef.current + elapsed;
      const pct = Math.min((totalProgress / STORY_DURATION) * 100, 100);
      setProgress(pct);

      if (totalProgress >= STORY_DURATION) {
        goToNext();
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentIndex, stories.length, isPaused]);

  const goToNext = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    pausedProgressRef.current = 0;
    setProgress(0);

    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goToPrev = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    pausedProgressRef.current = 0;
    setProgress(0);

    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handlePause = () => {
    setIsPaused(true);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    pausedProgressRef.current += Date.now() - (startTimeRef.current || Date.now());
  };

  const handleResume = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now();
  };

  const handleDelete = async (storyId) => {
    if (!window.confirm('Delete this story?')) return;
    try {
      await api.delete(`/stories/${storyId}/`, { data: { user_id: user.id } });
      const filtered = stories.filter((_, i) => i !== currentIndex);
      if (filtered.length === 0) {
        onClose();
      } else {
        setStories(filtered);
        if (currentIndex >= filtered.length) {
          setCurrentIndex(filtered.length - 1);
        }
        pausedProgressRef.current = 0;
        setProgress(0);
      }
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, onClose]);

  // Mark current story as viewed when it appears
  useEffect(() => {
    if (stories[currentIndex]) {
      markAsViewed(stories[currentIndex].id);
    }
  }, [currentIndex, stories, markAsViewed]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-lg mb-4">No stories available</p>
          <button onClick={onClose} className="text-gray-400 hover:text-white">Close</button>
        </div>
      </div>
    );
  }

  const currentStory = stories[currentIndex];
  const isOwnStory = user?.id === currentStory?.user;

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-50 p-2.5 text-white/90 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-colors active:scale-95"
      >
        <FiX size={24} className="sm:hidden" />
        <FiX size={28} className="hidden sm:block" />
      </button>

      {/* Progress Bars */}
      <div className="absolute top-3 left-3 right-3 z-40 flex gap-1.5">
        {stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-[3px] sm:h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-none"
              style={{
                width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Story Info */}
      <div className="absolute top-8 left-4 right-20 z-40 flex items-center gap-3">
        {currentStory?.user_photo ? (
          <img src={currentStory.user_photo} alt="" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white/50" />
        ) : (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-sm sm:text-base border-2 border-white/50">
            {currentStory?.user_name?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <p className="text-white font-semibold text-sm shadow-black drop-shadow-md">{currentStory?.user_name}</p>
          <p className="text-white/70 text-xs">{currentStory?.time_left} left</p>
        </div>
        {isOwnStory && (
          <button
            onClick={() => handleDelete(currentStory.id)}
            className="p-2 text-white/70 hover:text-red-400 hover:bg-white/10 rounded-full transition-colors"
          >
            <FiTrash2 size={18} />
          </button>
        )}
        <div className="flex items-center gap-1 text-white/70 text-xs">
          <FiEye size={14} />
          <span>{currentStory?.viewer_count || 0}</span>
        </div>
      </div>

      {/* Story Content */}
      <div
        className="relative w-full h-full max-w-md mx-auto"
        onMouseDown={handlePause}
        onMouseUp={handleResume}
        onTouchStart={handlePause}
        onTouchEnd={handleResume}
      >
        {/* Background Image */}
        {currentStory?.image_url ? (
          <img
            src={currentStory.image_url}
            alt="Story"
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: currentStory?.background_color || '#FF7700' }}
          />
        )}

        {/* Caption Overlay */}
        {currentStory?.caption && (
          <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
            <p
              className="text-white text-center text-2xl sm:text-3xl font-bold drop-shadow-lg leading-relaxed break-words max-w-full"
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)',
                fontStyle: currentStory.font_style === 'italic' ? 'italic' : 'normal',
                fontFamily: currentStory.font_style === 'serif' ? 'serif' : 'sans-serif',
              }}
            >
              {currentStory.caption}
            </p>
          </div>
        )}

        {/* Navigation Zones */}
        <div className="absolute inset-0 flex">
          <button
            onClick={goToPrev}
            className="w-1/3 h-full cursor-pointer"
            aria-label="Previous story"
          />
          <div className="w-1/3 h-full" />
          <button
            onClick={goToNext}
            className="w-1/3 h-full cursor-pointer"
            aria-label="Next story"
          />
        </div>
      </div>

      {/* Navigation Arrows (visible on desktop) */}
      {currentIndex > 0 && (
        <button
          onClick={goToPrev}
          className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full items-center justify-center text-white transition-colors"
        >
          <FiChevronLeft size={24} />
        </button>
      )}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={goToNext}
          className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full items-center justify-center text-white transition-colors"
        >
          <FiChevronRight size={24} />
        </button>
      )}

      {/* Pause indicator */}
      {isPaused && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur rounded-full text-white text-sm font-medium">
          Paused
        </div>
      )}
    </div>
  );
};

export default StoryViewer;
