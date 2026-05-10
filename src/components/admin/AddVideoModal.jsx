import { useState } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import api from '../../services/api';
import { useToast } from '../../components/Toast';

const AddVideoModal = ({ show, onClose, onSubmit, authors }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    title: '', description: '', author: '', category: 'literature',
    language: 'Hindi', thumbnail_url: '', video_url: '', duration: 0
  });
  const [uploading, setUploading] = useState(false);

  const categories = [
    { value: 'literature', label: 'Literature' },
    { value: 'poetry_reading', label: 'Poetry Reading' },
    { value: 'author_interview', label: 'Author Interview' },
    { value: 'book_review', label: 'Book Review' },
    { value: 'writing_tips', label: 'Writing Tips' },
    { value: 'storytelling', label: 'Storytelling' },
    { value: 'documentary', label: 'Documentary' },
    { value: 'educational', label: 'Educational' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await api.post('/upload-image/', data);
      setFormData({ ...formData, thumbnail_url: res.data.url });
      addToast('Thumbnail uploaded!', 'success');
    } catch (error) {
      addToast('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', description: '', author: '', category: 'literature', language: 'Hindi', thumbnail_url: '', video_url: '', duration: 0 });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 flex justify-between items-center border-b border-gray-100 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800">Add Video</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-100"><FiX size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Author</label>
            <select name="author" value={formData.author} onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
              <option value="">Select Author</option>
              {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Language</label>
              <input type="text" name="language" value={formData.language} onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Video URL *</label>
            <input type="url" name="video_url" value={formData.video_url} onChange={handleChange} required
              placeholder="https://youtube.com/watch?v=... or direct video URL"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Duration (minutes)</label>
            <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="0"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Thumbnail Image</label>
            <div className="flex items-center space-x-3">
              <label className="flex-1 px-4 py-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-orange-50/30 transition-colors flex items-center justify-center space-x-2">
                <FiUpload /><span className="font-medium text-gray-700">{uploading ? 'Uploading...' : 'Upload Thumbnail'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            {formData.thumbnail_url && <p className="text-sm text-green-600 mt-2 font-medium">✓ Thumbnail uploaded</p>}
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 bg-primary text-white rounded-xl py-2.5 font-semibold hover:bg-orange-600 transition-colors shadow-sm">
              Add Video
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-2.5 font-semibold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVideoModal;
