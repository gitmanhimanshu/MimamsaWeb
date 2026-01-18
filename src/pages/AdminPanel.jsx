import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FiBook, FiUsers, FiFileText, FiList, FiTrash2, FiEye, FiEyeOff, FiPlus } from 'react-icons/fi';
import AddBookModal from '../components/admin/AddBookModal';
import AddAuthorModal from '../components/admin/AddAuthorModal';
import AddPoemModal from '../components/admin/AddPoemModal';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [poems, setPoems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [poemCategories, setPoemCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalBooks: 0, totalAuthors: 0, totalPoems: 0, totalUsers: 0 });
  const [showBookModal, setShowBookModal] = useState(false);
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [showPoemModal, setShowPoemModal] = useState(false);

  useEffect(() => {
    fetchData();
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [categoriesRes, poemCategoriesRes, genresRes] = await Promise.all([
        api.get('/categories/'), api.get('/poem-categories/'), api.get('/genres/')
      ]);
      setCategories(categoriesRes.data);
      setPoemCategories(poemCategoriesRes.data);
      setGenres(genresRes.data);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksRes, authorsRes, poemsRes] = await Promise.all([
        api.get('/books/?show_all=true'), api.get('/authors/'), api.get('/poems/')
      ]);
      setBooks(booksRes.data);
      setAuthors(authorsRes.data);
      setPoems(poemsRes.data);
      setStats({ totalBooks: booksRes.data.length, totalAuthors: authorsRes.data.length, totalPoems: poemsRes.data.length, totalUsers: '-' });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (formData) => {
    try {
      await api.post('/books/', { ...formData, user_id: user.id });
      alert('Book added successfully!');
      setShowBookModal(false);
      fetchData();
    } catch (error) {
      alert('Failed to add book');
    }
  };

  const handleAddAuthor = async (formData) => {
    try {
      await api.post('/authors/', { ...formData, user_id: user.id });
      alert('Author added successfully!');
      setShowAuthorModal(false);
      fetchData();
      fetchMetadata();
    } catch (error) {
      alert('Failed to add author');
    }
  };

  const handleAddPoem = async (formData) => {
    try {
      await api.post('/poems/', { ...formData, user_id: user.id });
      alert('Poem added successfully!');
      setShowPoemModal(false);
      fetchData();
    } catch (error) {
      alert('Failed to add poem');
    }
  };

  const toggleBookStatus = async (bookId, currentStatus) => {
    if (!confirm(`${currentStatus ? 'Deactivate' : 'Activate'} this book?`)) return;
    try {
      await api.put(`/books/${bookId}/`, { user_id: user.id, is_active: !currentStatus });
      alert('Book status updated!');
      fetchData();
    } catch (error) {
      alert('Failed to update');
    }
  };

  const deleteBook = async (bookId) => {
    if (!confirm('Delete this book permanently?')) return;
    try {
      await api.delete(`/books/${bookId}/`, { data: { user_id: user.id } });
      alert('Book deleted!');
      fetchData();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const deleteAuthor = async (authorId) => {
    if (!confirm('Delete this author?')) return;
    try {
      await api.delete(`/authors/${authorId}/`, { data: { user_id: user.id } });
      alert('Author deleted!');
      fetchData();
      fetchMetadata();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const deletePoem = async (poemId) => {
    if (!confirm('Delete this poem?')) return;
    try {
      await api.delete(`/poems/${poemId}/`, { data: { user_id: user.id } });
      alert('Poem deleted!');
      fetchData();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiList },
    { id: 'books', label: 'Manage Books', icon: FiBook },
    { id: 'authors', label: 'Manage Authors', icon: FiUsers },
    { id: 'poems', label: 'Manage Poems', icon: FiFileText },
  ];

  if (loading && books.length === 0) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Panel</h1>
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-dark text-gray-300 hover:bg-gray-800'}`}>
              <Icon size={18} /><span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-dark rounded-lg p-6 border border-gray-800">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-darker rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400">Total Books</h3>
                  <FiBook className="text-primary" size={24} />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalBooks}</p>
              </div>
              <div className="bg-darker rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400">Total Authors</h3>
                  <FiUsers className="text-accent" size={24} />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalAuthors}</p>
              </div>
              <div className="bg-darker rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400">Total Poems</h3>
                  <FiFileText className="text-success" size={24} />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalPoems}</p>
              </div>
              <div className="bg-darker rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-400">Total Users</h3>
                  <FiUsers className="text-yellow-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="bg-primary/10 border border-primary rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={() => setShowBookModal(true)}
                  className="bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <FiPlus /><span>Add New Book</span>
                </button>
                <button onClick={() => setShowAuthorModal(true)}
                  className="bg-accent hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <FiPlus /><span>Add New Author</span>
                </button>
                <button onClick={() => setShowPoemModal(true)}
                  className="bg-success hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <FiPlus /><span>Add New Poem</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'books' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Manage Books ({books.length})</h2>
              <button onClick={() => setShowBookModal(true)}
                className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <FiPlus /><span>Add Book</span>
              </button>
            </div>
            {books.length === 0 ? (
              <div className="bg-darker rounded-lg p-8 text-center border border-gray-700">
                <FiBook size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No books found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {books.map(book => (
                  <div key={book.id} className="bg-darker rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{book.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${book.is_active ? 'bg-green-900/30 text-green-400 border border-green-500' : 'bg-red-900/30 text-red-400 border border-red-500'}`}>
                            {book.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{book.author_name || 'No author'} • {book.category_name || 'No category'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => toggleBookStatus(book.id, book.is_active)}
                          className={`p-2 rounded-lg transition-colors ${book.is_active ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50' : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'}`}>
                          {book.is_active ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                        <button onClick={() => deleteBook(book.id)}
                          className="p-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'authors' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Manage Authors ({authors.length})</h2>
              <button onClick={() => setShowAuthorModal(true)}
                className="bg-accent hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <FiPlus /><span>Add Author</span>
              </button>
            </div>
            {authors.length === 0 ? (
              <div className="bg-darker rounded-lg p-8 text-center border border-gray-700">
                <FiUsers size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No authors found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {authors.map(author => (
                  <div key={author.id} className="bg-darker rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white">{author.name}</h3>
                      <button onClick={() => deleteAuthor(author.id)}
                        className="p-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    {author.bio && <p className="text-gray-400 text-sm line-clamp-2">{author.bio}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'poems' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Manage Poems ({poems.length})</h2>
              <button onClick={() => setShowPoemModal(true)}
                className="bg-success hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <FiPlus /><span>Add Poem</span>
              </button>
            </div>
            {poems.length === 0 ? (
              <div className="bg-darker rounded-lg p-8 text-center border border-gray-700">
                <FiFileText size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No poems found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {poems.map(poem => (
                  <div key={poem.id} className="bg-darker rounded-lg p-4 border border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{poem.title}</h3>
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">{poem.content}</p>
                        <p className="text-gray-500 text-xs">{poem.author_name || 'Anonymous'} • {poem.category_name || 'No category'}</p>
                      </div>
                      <button onClick={() => deletePoem(poem.id)}
                        className="p-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <AddBookModal show={showBookModal} onClose={() => setShowBookModal(false)} onSubmit={handleAddBook}
        authors={authors} categories={categories} genres={genres} />
      <AddAuthorModal show={showAuthorModal} onClose={() => setShowAuthorModal(false)} onSubmit={handleAddAuthor} />
      <AddPoemModal show={showPoemModal} onClose={() => setShowPoemModal(false)} onSubmit={handleAddPoem}
        authors={authors} poemCategories={poemCategories} />
    </div>
  );
};

export default AdminPanel;
