import { useState } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import api from '../../services/api';

const AddShortStoryModal = ({ show, onClose, onSubmit, authors }) => {
  const [formData, setFormData] = useState({
    title: '', content: '', author: '', genre: 'fiction', language: 'Hindi',
    cover_image_url: '', reading_time: 5
  });
  const [uploading, setUploading] = useState(false);

  const genres = [
    { value: 'fiction', label: 'Fiction' },
    { value: 'non_fiction', label: 'Non-Fiction' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'romance', label: 'Romance' },
    { value: 'horror', label: 'Horror' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'drama', label: 'Drama' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'thriller', label: 'Thriller' },
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
      setFormData({ ...formData, cover_image_url: res.data.url });
      alert('Image uploaded!');
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', content: '', author: '', genre: 'fiction', language: 'Hindi', cover_image_url: '', reading_time: 5 });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-primary text-white p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold">Add Short Story</h2>
          <button onClick={onClose} className="hover:bg-orange-600 p-1 rounded"><FiX size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required
              className="w-full px-4 py-2 border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Content *</label>
            <textarea name="content" value={formData.content} onChange={handleChange} required rows={8}
              className="w-full px-4 py-2 border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Author</label>
            <select name="author" value={formData.author} onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select Author</option>
              {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Genre</label>
              <select name="genre" value={formData.genre} onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                {genres.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Language</label>
              <input type="text" name="language" value={formData.language} onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Reading Time (minutes)</label>
            <input type="number" name="reading_time" value={formData.reading_time} onChange={handleChange} min="1"
              className="w-full px-4 py-2 border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Cover Image</label>
            <div className="flex items-center space-x-3">
              <label className="flex-1 px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg cursor-pointer hover:bg-orange-100 flex items-center justify-center space-x-2">
                <FiUpload /><span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            {formData.cover_image_url && <p className="text-sm text-green-600 mt-2">✓ Image uploaded</p>}
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="submit" className="flex-1 bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors">
              Add Story
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShortStoryModal;
