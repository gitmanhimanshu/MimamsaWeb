import { FiX } from 'react-icons/fi';
import { uploadImage, uploadPDF } from '../../services/api';
import { useState } from 'react';

const AddBookModal = ({ show, onClose, onSubmit, authors, categories, genres }) => {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', author: '', category: '', genre: '',
    cover_image_url: '', content_url: '', file_type: 'pdf', language: 'Hindi',
    is_paid: false, price: '', published_year: ''
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadImage(file);
      setForm({ ...form, cover_image_url: result.url });
      alert('Image uploaded!');
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadPDF(file);
      setForm({ ...form, content_url: result.url });
      alert('File uploaded!');
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ title: '', description: '', author: '', category: '', genre: '', cover_image_url: '', content_url: '', file_type: 'pdf', language: 'Hindi', is_paid: false, price: '', published_year: '' });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full border-2 border-primary shadow-lg my-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Add New Book</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800"><FiX size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Title *" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
            className="w-full px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary" required />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
            className="w-full px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary" rows="3" />
          <select value={form.author} onChange={(e) => setForm({...form, author: e.target.value})}
            className="w-full px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select Author</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
            className="w-full px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={form.genre} onChange={(e) => setForm({...form, genre: e.target.value})}
            className="w-full px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select Genre</option>
            {genres.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Cover Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload}
              className="w-full px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary" />
            {form.cover_image_url && <p className="text-green-600 text-sm mt-1 font-semibold">✓ Image uploaded</p>}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Book File (PDF/EPUB)</label>
            <input type="file" accept=".pdf,.epub" onChange={handlePDFUpload}
              className="w-full px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary" />
            {form.content_url && <p className="text-green-600 text-sm mt-1 font-semibold">✓ File uploaded</p>}
          </div>
          <input type="number" placeholder="Published Year *" value={form.published_year} onChange={(e) => setForm({...form, published_year: e.target.value})}
            className="w-full px-4 py-2 bg-orange-50 border-2 border-primary rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary" required />
          <button type="submit" disabled={uploading}
            className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-lg disabled:opacity-50 font-semibold shadow-md">
            {uploading ? 'Uploading...' : 'Add Book'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
