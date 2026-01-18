import { FiX } from 'react-icons/fi';
import { useState } from 'react';

const AddPoemModal = ({ show, onClose, onSubmit, authors, poemCategories }) => {
  const [form, setForm] = useState({
    title: '', content: '', author: '', category: '', language: 'Hindi', background_image_url: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ title: '', content: '', author: '', category: '', language: 'Hindi', background_image_url: '' });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-dark rounded-lg p-6 max-w-2xl w-full border border-gray-700 my-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Add New Poem</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Poem Title *" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
            className="w-full px-4 py-2 bg-darker border border-gray-700 rounded-lg text-white" required />
          <textarea placeholder="Poem Content *" value={form.content} onChange={(e) => setForm({...form, content: e.target.value})}
            className="w-full px-4 py-2 bg-darker border border-gray-700 rounded-lg text-white" rows="8" required />
          <select value={form.author} onChange={(e) => setForm({...form, author: e.target.value})}
            className="w-full px-4 py-2 bg-darker border border-gray-700 rounded-lg text-white">
            <option value="">Select Author</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
            className="w-full px-4 py-2 bg-darker border border-gray-700 rounded-lg text-white">
            <option value="">Select Category</option>
            {poemCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button type="submit"
            className="w-full bg-success hover:bg-green-600 text-white py-3 rounded-lg">
            Add Poem
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPoemModal;
