import { FiX, FiUpload } from 'react-icons/fi';
import { useState } from 'react';

const AddPoemModal = ({ show, onClose, onSubmit, authors }) => {
  const [form, setForm] = useState({
    title: '', description: '', content: '', author: '', category: '', genre: 'poetry', language: 'Hindi', background_image_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // Static categories
  const categories = [
    { value: 'love', label: 'प्रेम कविता' },
    { value: 'nature', label: 'प्रकृति' },
    { value: 'patriotic', label: 'देशभक्ति' },
    { value: 'spiritual', label: 'आध्यात्मिक' },
    { value: 'social', label: 'सामाजिक' },
    { value: 'motivational', label: 'प्रेरणादायक' },
    { value: 'sad', label: 'दुःख' },
    { value: 'funny', label: 'हास्य' }
  ];

  // Static genres
  const genres = [
    { value: 'poetry', label: 'Poetry' },
    { value: 'classical_poetry', label: 'Classical Poetry' },
    { value: 'modern_poetry', label: 'Modern Poetry' },
    { value: 'ghazal', label: 'Ghazal' },
    { value: 'free_verse', label: 'Free Verse' }
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'punch_data');
    formData.append('cloud_name', 'dbizsbr3w');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dbizsbr3w/image/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setForm({ ...form, background_image_url: data.secure_url });
      setImagePreview(data.secure_url);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ title: '', description: '', content: '', author: '', category: '', genre: 'poetry', language: 'Hindi', background_image_url: '' });
    setImagePreview('');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full border-2 border-primary shadow-lg my-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Add New Poem</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800"><FiX size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Poem Title *" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
            className="w-full px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary" required />
          
          <textarea placeholder="Short Description (optional)" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
            className="w-full px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary" rows="2" />
          
          <textarea placeholder="Poem Content *" value={form.content} onChange={(e) => setForm({...form, content: e.target.value})}
            className="w-full px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary" rows="8" required />
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image (optional)</label>
            <div className="flex items-center space-x-4">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg hover:bg-orange-100 transition-colors">
                  <FiUpload />
                  <span className="text-sm font-semibold text-gray-700">
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            {imagePreview && (
              <div className="mt-3">
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg border-2 border-primary" />
              </div>
            )}
          </div>

          <select value={form.author} onChange={(e) => setForm({...form, author: e.target.value})}
            className="w-full px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select Author</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
            className="w-full px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <select value={form.genre} onChange={(e) => setForm({...form, genre: e.target.value})}
            className="w-full px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select Genre</option>
            {genres.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
          <button type="submit" disabled={uploading}
            className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-lg font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
            Add Poem
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPoemModal;
