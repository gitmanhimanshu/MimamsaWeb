import { FiX } from 'react-icons/fi';
import { uploadImage } from '../../services/api';
import { useState } from 'react';

const AddAuthorModal = ({ show, onClose, onSubmit }) => {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', photo_url: '' });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadImage(file);
      setForm({ ...form, photo_url: result.url });
      alert('Photo uploaded!');
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: '', bio: '', photo_url: '' });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark rounded-lg p-6 max-w-md w-full border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Add New Author</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Author Name *" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
            className="w-full px-4 py-2 bg-darker border border-gray-700 rounded-lg text-white" required />
          <textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})}
            className="w-full px-4 py-2 bg-darker border border-gray-700 rounded-lg text-white" rows="3" />
          <div>
            <label className="block text-gray-300 mb-2">Photo</label>
            <input type="file" accept="image/*" onChange={handleImageUpload}
              className="w-full px-4 py-2 bg-darker border border-gray-700 rounded-lg text-white" />
            {form.photo_url && <p className="text-green-400 text-sm mt-1">✓ Photo uploaded</p>}
          </div>
          <button type="submit" disabled={uploading}
            className="w-full bg-accent hover:bg-purple-600 text-white py-3 rounded-lg disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Add Author'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAuthorModal;
