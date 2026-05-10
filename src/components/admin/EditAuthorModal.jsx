import { FiX } from 'react-icons/fi';
import { uploadImage } from '../../services/api';
import { useState, useEffect } from 'react';
import { useToast } from '../../components/Toast';

const EditAuthorModal = ({ show, onClose, onSubmit, author }) => {
  const { addToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', photo_url: '' });

  useEffect(() => {
    if (author) {
      setForm({
        name: author.name || '',
        bio: author.bio || '',
        photo_url: author.photo_url || ''
      });
    }
  }, [author]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadImage(file);
      setForm({ ...form, photo_url: result.url });
      addToast('Photo uploaded!', 'success');
    } catch (error) {
      addToast('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!show || !author) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Edit Author</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800"><FiX size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Author Name *" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required />
          <textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" rows="3" />
          <div>
            <label className="block text-gray-700 font-medium mb-2">Photo</label>
            {form.photo_url && (
              <div className="mb-2">
                <img src={form.photo_url} alt="Author" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            {form.photo_url && <p className="text-green-600 text-sm mt-1 font-medium">✓ Photo uploaded</p>}
          </div>
          <div className="flex space-x-3">
            <button type="submit" disabled={uploading}
              className="flex-1 bg-primary text-white rounded-xl py-2.5 font-semibold hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50">
              {uploading ? 'Uploading...' : 'Update Author'}
            </button>
            <button type="button" onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-2.5 font-semibold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAuthorModal;
