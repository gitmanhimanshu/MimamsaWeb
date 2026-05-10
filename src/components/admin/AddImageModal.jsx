import { useState } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import api, { uploadImage } from '../../services/api';
import { useToast } from '../../components/Toast';

const AddImageModal = ({ show, onClose, onSubmit, authors }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    title: '', description: '', author: '', category: 'other',
    language: 'Hindi', image_url: '', tags: ''
  });
  const [uploading, setUploading] = useState(false);

  const categories = [
    { value: 'book_cover', label: 'Book Cover' },
    { value: 'author_photo', label: 'Author Photo' },
    { value: 'illustration', label: 'Illustration' },
    { value: 'artwork', label: 'Artwork' },
    { value: 'calligraphy', label: 'Calligraphy' },
    { value: 'manuscript', label: 'Manuscript' },
    { value: 'historical', label: 'Historical' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file', 'error');
      return;
    }

    try {
      setUploading(true);
      const result = await uploadImage(file);
      setFormData({ ...formData, image_url: result.url });
      addToast('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      addToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', description: '', author: '', category: 'other', language: 'Hindi', image_url: '', tags: '' });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 flex justify-between items-center border-b border-gray-100 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800">Add Image</h2>
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
            <label className="block text-gray-700 font-medium mb-2">Tags (comma-separated)</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleChange}
              placeholder="e.g., art, culture, history"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Upload Image *</label>
            <div className="flex items-center space-x-3">
              <label className="flex-1 px-4 py-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-orange-50/30 transition-colors flex items-center justify-center space-x-2">
                <FiUpload /><span className="font-medium text-gray-700">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} required={!formData.image_url} />
              </label>
            </div>
            {formData.image_url && (
              <div className="mt-3">
                <img src={formData.image_url} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-gray-200" />
                <p className="text-sm text-green-600 mt-2 font-medium">✓ Image uploaded</p>
              </div>
            )}
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="submit" disabled={uploading || !formData.image_url} className="flex-1 bg-primary text-white rounded-xl py-2.5 font-semibold hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50">
              Add Image
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

export default AddImageModal;
