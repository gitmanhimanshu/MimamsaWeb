import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const AddUserPoemModal = ({ show, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    genre: 'poetry',
    language: 'Hindi',
  });

  // Static options - no API calls needed
  const genres = [
    { value: 'poetry', label: 'Poetry' },
    { value: 'classical_poetry', label: 'Classical Poetry' },
    { value: 'modern_poetry', label: 'Modern Poetry' },
    { value: 'ghazal', label: 'Ghazal' },
    { value: 'free_verse', label: 'Free Verse' }
  ];

  const categories = [
    { id: 'love', name: 'प्रेम कविता', icon: '💕' },
    { id: 'nature', name: 'प्रकृति', icon: '🌿' },
    { id: 'patriotic', name: 'देशभक्ति', icon: '🇮🇳' },
    { id: 'spiritual', name: 'आध्यात्मिक', icon: '🕉️' },
    { id: 'social', name: 'सामाजिक', icon: '👥' },
    { id: 'motivational', name: 'प्रेरणादायक', icon: '💪' },
    { id: 'sad', name: 'दुःख', icon: '😢' },
    { id: 'funny', name: 'हास्य', icon: '😄' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.content.trim()) {
      addToast('Please fill in title and content', 'info');
      return;
    }

    try {
      setLoading(true);
      await api.post('/user-poems/', {
        ...form,
        user_id: user.id,
      });
      
      addToast('Your poem has been published!', 'success');
      setForm({ title: '', content: '', category: '', genre: 'poetry', language: 'Hindi' });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting poem:', error);
      addToast('Failed to publish poem', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-5 sm:p-6 my-20">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <h3 className="text-xl font-bold text-gray-900">Write Your Poem ✍️</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Title *</label>
            <input
              type="text"
              placeholder="Enter poem title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Your Poem *</label>
            <textarea
              placeholder="Write your poem here..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              rows="12"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Genre *</label>
              <select
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              >
                {genres.map((genre) => (
                  <option key={genre.value} value={genre.value}>
                    {genre.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Language</label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
                <option value="Sanskrit">Sanskrit</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
            <p className="text-gray-700 text-sm">
              📝 Your poem will be visible to all users once published. Your name will be shown as the author.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Poem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserPoemModal;
