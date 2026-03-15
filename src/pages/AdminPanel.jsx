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
      const [categoriesRes, genresRes] = await Promise.all([
        api.get('/categories/'), api.get('/genres/')
      ]);
      setCategories(categoriesRes.data);
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
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Admin Panel</h1>
      <div className="flex space-x-1 sm:space-x-2 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors text-sm sm:text-base ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-orange-50 border border-primary'}`}>
              <Icon size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-lg p-4 sm:p-6 border-2 border-primary shadow-lg">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-orange-50 rounded-lg p-3 sm:p-6 border-2 border-primary shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold text-xs sm:text-sm">Total Books</h3>
                  <FiBook className="text-primary" size={20} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalBooks}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 sm:p-6 border-2 border-primary shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold text-xs sm:text-sm">Total Authors</h3>
                  <FiUsers className="text-primary" size={20} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalAuthors}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 sm:p-6 border-2 border-primary shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold text-xs sm:text-sm">Total Poems</h3>
                  <FiFileText className="text-primary" size={20} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalPoems}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-3 sm:p-6 border-2 border-primary shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold text-xs sm:text-sm">Total Users</h3>
                  <FiUsers className="text-primary" size={20} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="bg-orange-50 border-2 border-primary rounded-lg p-4 sm:p-6 shadow-md">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <button onClick={() => setShowBookModal(true)}
                  className="bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-md text-sm sm:text-base">
                  <FiPlus /><span>Add New Book</span>
                </button>
                <button onClick={() => setShowAuthorModal(true)}
                  className="bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-md text-sm sm:text-base">
                  <FiPlus /><span>Add New Author</span>
                </button>
                <button onClick={() => setShowPoemModal(true)}
                  className="bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-md text-sm sm:text-base">
                  <FiPlus /><span>Add New Poem</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'books' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Books ({books.length})</h2>
              <button onClick={() => setShowBookModal(true)}
                className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 shadow-md text-sm sm:text-base">
                <FiPlus /><span>Add Book</span>
              </button>
            </div>
            {books.length === 0 ? (
              <div className="bg-orange-50 rounded-lg p-6 sm:p-8 text-center border-2 border-primary">
                <FiBook size={48} className="mx-auto mb-4 text-primary" />
                <p className="text-gray-600">No books found</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {books.map(book => (
                  <div key={book.id} className="bg-orange-50 rounded-lg p-3 sm:p-4 border-2 border-primary shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">{book.title}</h3>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold self-start ${book.is_active ? 'bg-green-100 text-green-700 border-2 border-green-500' : 'bg-red-100 text-red-700 border-2 border-red-500'}`}>
                            {book.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{book.author_name || 'No author'} • {book.category_name || 'No category'}</p>
                      </div>
                      <div className="flex items-center space-x-2 self-end sm:self-start">
                        <button onClick={() => toggleBookStatus(book.id, book.is_active)}
                          className={`p-2 rounded-lg transition-colors ${book.is_active ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-2 border-yellow-500' : 'bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-500'}`}>
                          {book.is_active ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                        <button onClick={() => deleteBook(book.id)}
                          className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors border-2 border-red-500">
                          <FiTrash2 size={16} />
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Authors ({authors.length})</h2>
              <button onClick={() => setShowAuthorModal(true)}
                className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 shadow-md text-sm sm:text-base">
                <FiPlus /><span>Add Author</span>
              </button>
            </div>
            {authors.length === 0 ? (
              <div className="bg-orange-50 rounded-lg p-6 sm:p-8 text-center border-2 border-primary">
                <FiUsers size={48} className="mx-auto mb-4 text-primary" />
                <p className="text-gray-600">No authors found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {authors.map(author => (
                  <div key={author.id} className="bg-orange-50 rounded-lg p-3 sm:p-4 border-2 border-primary shadow-md">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex-1 pr-2">{author.name}</h3>
                      <button onClick={() => deleteAuthor(author.id)}
                        className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors border-2 border-red-500 flex-shrink-0">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                    {author.bio && <p className="text-gray-600 text-sm line-clamp-2">{author.bio}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'poems' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Poems ({poems.length})</h2>
              <button onClick={() => setShowPoemModal(true)}
                className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 shadow-md text-sm sm:text-base">
                <FiPlus /><span>Add Poem</span>
              </button>
            </div>
            {poems.length === 0 ? (
              <div className="bg-orange-50 rounded-lg p-6 sm:p-8 text-center border-2 border-primary">
                <FiFileText size={48} className="mx-auto mb-4 text-primary" />
                <p className="text-gray-600">No poems found</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {poems.map(poem => (
                  <div key={poem.id} className="bg-orange-50 rounded-lg p-3 sm:p-4 border-2 border-primary shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{poem.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{poem.content}</p>
                        <p className="text-gray-500 text-xs">{poem.author_name || 'Anonymous'} • {poem.category_name || 'No category'}</p>
                      </div>
                      <button onClick={() => deletePoem(poem.id)}
                        className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors border-2 border-red-500 self-end sm:self-start flex-shrink-0">
                        <FiTrash2 size={16} />
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
        authors={authors} />
    </div>
  );
};

export default AdminPanel;
