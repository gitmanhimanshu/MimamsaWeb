import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AddUserPoemModal = ({ show, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    language: 'Hindi',
  });

  useEffect(() => {
    if (show) {
      fetchCategories();
    }
  }, [show]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/poem-categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.content.trim()) {
      alert('Please fill in title and content');
      return;
    }

    try {
      setLoading(true);
      await api.post('/user-poems/', {
        ...form,
        user_id: user.id,
      });
      
      alert('Your poem has been published!');
      setForm({ title: '', content: '', category: '', language: 'Hindi' });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting poem:', error);
      alert('Failed to publish poem');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full border-2 border-orange-200 shadow-2xl my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Write Your Poem ✍️</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 transition-colors">
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
              className="w-full px-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-800 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-semibold">Your Poem *</label>
            <textarea
              placeholder="Write your poem here..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-800 focus:outline-none focus:border-primary resize-none"
              rows="12"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-800 focus:outline-none focus:border-primary"
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
              <label className="block text-gray-700 mb-2 font-semibold">Language</label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full px-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-800 focus:outline-none focus:border-primary"
              >
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
                <option value="Sanskrit">Sanskrit</option>
              </select>
            </div>
          </div>

          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
            <p className="text-gray-700 text-sm">
              📝 Your poem will be visible to all users once published. Your name will be shown as the author.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary hover:bg-orange-600 text-white rounded-xl transition-colors disabled:opacity-50 font-bold shadow-lg"
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
