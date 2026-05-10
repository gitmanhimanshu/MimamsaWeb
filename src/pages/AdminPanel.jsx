import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../services/api';
import { FiBook, FiUsers, FiFileText, FiList, FiTrash2, FiEye, FiEyeOff, FiPlus, FiMusic, FiVideo, FiBookOpen, FiEdit, FiImage } from 'react-icons/fi';
import AddBookModal from '../components/admin/AddBookModal';
import AddAuthorModal from '../components/admin/AddAuthorModal';
import EditAuthorModal from '../components/admin/EditAuthorModal';
import AddPoemModal from '../components/admin/AddPoemModal';
import AddShortStoryModal from '../components/admin/AddShortStoryModal';
import AddAudiobookModal from '../components/admin/AddAudiobookModal';
import AddVideoModal from '../components/admin/AddVideoModal';
import AddImageModal from '../components/admin/AddImageModal';

const AdminPanel = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [poems, setPoems] = useState([]);
  const [stories, setStories] = useState([]);
  const [audiobooks, setAudiobooks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalBooks: 0, totalAuthors: 0, totalPoems: 0, totalStories: 0, totalAudiobooks: 0, totalVideos: 0, totalImages: 0 });
  const [showBookModal, setShowBookModal] = useState(false);
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [showEditAuthorModal, setShowEditAuthorModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [showPoemModal, setShowPoemModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showAudiobookModal, setShowAudiobookModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

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
      const [booksRes, authorsRes, poemsRes, storiesRes, audiobooksRes, videosRes, imagesRes] = await Promise.all([
        api.get('/books/?show_all=true'), 
        api.get('/authors/'), 
        api.get('/poems/'),
        api.get('/stories/'),
        api.get('/audiobooks/'),
        api.get('/videos/'),
        api.get('/images/')
      ]);
      setBooks(booksRes.data);
      setAuthors(authorsRes.data);
      setPoems(poemsRes.data);
      setStories(storiesRes.data);
      setAudiobooks(audiobooksRes.data);
      setVideos(videosRes.data);
      setImages(imagesRes.data);
      setStats({ 
        totalBooks: booksRes.data.length, 
        totalAuthors: authorsRes.data.length, 
        totalPoems: poemsRes.data.length,
        totalStories: storiesRes.data.length,
        totalAudiobooks: audiobooksRes.data.length,
        totalVideos: videosRes.data.length,
        totalImages: imagesRes.data.length
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (formData) => {
    try {
      await api.post('/books/', { ...formData, user_id: user.id });
      addToast('Book added successfully!', 'success');
      setShowBookModal(false);
      fetchData();
    } catch (error) {
      addToast('Failed to add book', 'error');
    }
  };

  const handleAddAuthor = async (formData) => {
    try {
      await api.post('/authors/', { ...formData, user_id: user.id });
      addToast('Author added successfully!', 'success');
      setShowAuthorModal(false);
      fetchData();
      fetchMetadata();
    } catch (error) {
      addToast('Failed to add author', 'error');
    }
  };

  const handleEditAuthor = async (formData) => {
    try {
      await api.put(`/authors/${editingAuthor.id}/`, { ...formData, user_id: user.id });
      addToast('Author updated successfully!', 'success');
      setShowEditAuthorModal(false);
      setEditingAuthor(null);
      fetchData();
      fetchMetadata();
    } catch (error) {
      addToast('Failed to update author', 'error');
    }
  };

  const openEditAuthor = (author) => {
    setEditingAuthor(author);
    setShowEditAuthorModal(true);
  };

  const handleAddPoem = async (formData) => {
    try {
      await api.post('/poems/', { ...formData, user_id: user.id });
      addToast('Poem added successfully!', 'success');
      setShowPoemModal(false);
      fetchData();
    } catch (error) {
      addToast('Failed to add poem', 'error');
    }
  };

  const handleAddStory = async (formData) => {
    try {
      await api.post('/stories/', { ...formData, user_id: user.id });
      addToast('Story added successfully!', 'success');
      setShowStoryModal(false);
      fetchData();
    } catch (error) {
      addToast('Failed to add story', 'error');
    }
  };

  const handleAddAudiobook = async (formData) => {
    try {
      await api.post('/audiobooks/', { ...formData, user_id: user.id });
      addToast('Audiobook added successfully!', 'success');
      setShowAudiobookModal(false);
      fetchData();
    } catch (error) {
      addToast('Failed to add audiobook', 'error');
    }
  };

  const handleAddVideo = async (formData) => {
    try {
      await api.post('/videos/', { ...formData, user_id: user.id });
      addToast('Video added successfully!', 'success');
      setShowVideoModal(false);
      fetchData();
    } catch (error) {
      addToast('Failed to add video', 'error');
    }
  };

  const handleAddImage = async (formData) => {
    try {
      await api.post('/images/', { ...formData, user_id: user.id });
      addToast('Image added successfully!', 'success');
      setShowImageModal(false);
      fetchData();
    } catch (error) {
      addToast('Failed to add image', 'error');
    }
  };

  const toggleBookStatus = async (bookId, currentStatus) => {
    if (!confirm(`${currentStatus ? 'Deactivate' : 'Activate'} this book?`)) return;
    try {
      await api.put(`/books/${bookId}/`, { user_id: user.id, is_active: !currentStatus });
      addToast('Book status updated!', 'success');
      fetchData();
    } catch (error) {
      addToast('Failed to update', 'error');
    }
  };

  const deleteBook = async (bookId) => {
    if (!confirm('Delete this book permanently?')) return;
    try {
      await api.delete(`/books/${bookId}/`, { data: { user_id: user.id } });
      addToast('Book deleted!', 'success');
      fetchData();
    } catch (error) {
      addToast('Failed to delete', 'error');
    }
  };

  const deleteAuthor = async (authorId) => {
    if (!confirm('Delete this author?')) return;
    try {
      await api.delete(`/authors/${authorId}/`, { data: { user_id: user.id } });
      addToast('Author deleted!', 'success');
      fetchData();
      fetchMetadata();
    } catch (error) {
      addToast('Failed to delete', 'error');
    }
  };

  const deletePoem = async (poemId) => {
    if (!confirm('Delete this poem?')) return;
    try {
      await api.delete(`/poems/${poemId}/`, { data: { user_id: user.id } });
      addToast('Poem deleted!', 'success');
      fetchData();
    } catch (error) {
      addToast('Failed to delete', 'error');
    }
  };

  const deleteStory = async (storyId) => {
    if (!confirm('Delete this story?')) return;
    try {
      await api.delete(`/stories/${storyId}/`, { data: { user_id: user.id } });
      addToast('Story deleted!', 'success');
      fetchData();
    } catch (error) {
      addToast('Failed to delete', 'error');
    }
  };

  const deleteAudiobook = async (audiobookId) => {
    if (!confirm('Delete this audiobook?')) return;
    try {
      await api.delete(`/audiobooks/${audiobookId}/`, { data: { user_id: user.id } });
      addToast('Audiobook deleted!', 'success');
      fetchData();
    } catch (error) {
      addToast('Failed to delete', 'error');
    }
  };

  const deleteVideo = async (videoId) => {
    if (!confirm('Delete this video?')) return;
    try {
      await api.delete(`/videos/${videoId}/`, { data: { user_id: user.id } });
      addToast('Video deleted!', 'success');
      fetchData();
    } catch (error) {
      addToast('Failed to delete', 'error');
    }
  };

  const deleteImage = async (imageId) => {
    if (!confirm('Delete this image?')) return;
    try {
      await api.delete(`/images/${imageId}/`, { data: { user_id: user.id } });
      addToast('Image deleted!', 'success');
      fetchData();
    } catch (error) {
      addToast('Failed to delete', 'error');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiList },
    { id: 'books', label: 'Manage Books', icon: FiBook },
    { id: 'authors', label: 'Manage Authors', icon: FiUsers },
    { id: 'poems', label: 'Manage Poems', icon: FiFileText },
    { id: 'stories', label: 'Short Stories', icon: FiBookOpen },
    { id: 'audiobooks', label: 'Audiobooks', icon: FiMusic },
    { id: 'videos', label: 'Videos', icon: FiVideo },
    { id: 'images', label: 'Images', icon: FiImage },
  ];

  if (loading && books.length === 0) {
    return <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50/30 to-white"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Admin Panel</h1>
      <div className="flex space-x-1 sm:space-x-2 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActiveTab = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all text-sm sm:text-base ${
                isActiveTab 
                  ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-lg transform scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-lg'
              }`}>
              <Icon size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-lg p-4 sm:p-6">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm border-l-4 border-l-primary">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold text-xs sm:text-sm">Total Books</h3>
                  <FiBook className="text-primary" size={20} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalBooks}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm border-l-4 border-l-primary">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold text-xs sm:text-sm">Total Poems</h3>
                  <FiFileText className="text-primary" size={20} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalPoems}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm border-l-4 border-l-primary">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold text-xs sm:text-sm">Short Stories</h3>
                  <FiBookOpen className="text-primary" size={20} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalStories}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm border-l-4 border-l-primary">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold text-xs sm:text-sm">Audiobooks</h3>
                  <FiMusic className="text-primary" size={20} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalAudiobooks}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm border-l-4 border-l-primary">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold text-xs sm:text-sm">Videos</h3>
                  <FiVideo className="text-primary" size={20} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalVideos}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm border-l-4 border-l-primary">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold text-xs sm:text-sm">Images</h3>
                  <FiImage className="text-primary" size={20} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalImages}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm border-l-4 border-l-primary">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-semibold text-xs sm:text-sm">Total Authors</h3>
                  <FiUsers className="text-primary" size={20} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalAuthors}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <button onClick={() => setShowBookModal(true)}
                  className="bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm sm:text-base">
                  <FiPlus /><span>Add Book</span>
                </button>
                <button onClick={() => setShowPoemModal(true)}
                  className="bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm sm:text-base">
                  <FiPlus /><span>Add Poem</span>
                </button>
                <button onClick={() => setShowStoryModal(true)}
                  className="bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm sm:text-base">
                  <FiPlus /><span>Add Story</span>
                </button>
                <button onClick={() => setShowAudiobookModal(true)}
                  className="bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm sm:text-base">
                  <FiPlus /><span>Add Audiobook</span>
                </button>
                <button onClick={() => setShowVideoModal(true)}
                  className="bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm sm:text-base">
                  <FiPlus /><span>Add Video</span>
                </button>
                <button onClick={() => setShowImageModal(true)}
                  className="bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm sm:text-base">
                  <FiPlus /><span>Add Image</span>
                </button>
                <button onClick={() => setShowAuthorModal(true)}
                  className="bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm sm:text-base">
                  <FiPlus /><span>Add Author</span>
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
                className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm sm:text-base">
                <FiPlus /><span>Add Book</span>
              </button>
            </div>
            {books.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <FiBook size={48} className="mx-auto mb-4 text-primary" />
                <p className="text-gray-600">No books found</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {books.map(book => (
                  <div key={book.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">{book.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${book.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                            {book.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{book.author_name || 'No author'} • {book.category_name || 'No category'}</p>
                      </div>
                      <div className="flex items-center space-x-2 self-end sm:self-start">
                        <button onClick={() => toggleBookStatus(book.id, book.is_active)}
                          className={`p-2 rounded-lg transition-colors ${book.is_active ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}`}>
                          {book.is_active ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                        <button onClick={() => deleteBook(book.id)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm sm:text-base">
                <FiPlus /><span>Add Author</span>
              </button>
            </div>
            {authors.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <FiUsers size={48} className="mx-auto mb-4 text-primary" />
                <p className="text-gray-600">No authors found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {authors.map(author => (
                  <div key={author.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-2">
                        {author.photo_url && (
                          <img src={author.photo_url} alt={author.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200 mb-2" />
                        )}
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">{author.name}</h3>
                      </div>
                      <div className="flex space-x-2 flex-shrink-0">
                        <button onClick={() => openEditAuthor(author)}
                          className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <FiEdit size={14} />
                        </button>
                        <button onClick={() => deleteAuthor(author.id)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
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
                className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm sm:text-base">
                <FiPlus /><span>Add Poem</span>
              </button>
            </div>
            {poems.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <FiFileText size={48} className="mx-auto mb-4 text-primary" />
                <p className="text-gray-600">No poems found</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {poems.map(poem => (
                  <div key={poem.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{poem.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{poem.content}</p>
                        <p className="text-gray-500 text-xs">{poem.author_name || 'Anonymous'} • {poem.category_name || 'No category'}</p>
                      </div>
                      <button onClick={() => deletePoem(poem.id)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-start flex-shrink-0">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stories' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Short Stories ({stories.length})</h2>
              <button onClick={() => setShowStoryModal(true)}
                className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm sm:text-base">
                <FiPlus /><span>Add Story</span>
              </button>
            </div>
            {stories.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <FiBookOpen size={48} className="mx-auto mb-4 text-primary" />
                <p className="text-gray-600">No stories found</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {stories.map(story => (
                  <div key={story.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{story.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{story.content}</p>
                        <p className="text-gray-500 text-xs">{story.author_name} • {story.genre} • {story.reading_time} min read</p>
                      </div>
                      <button onClick={() => deleteStory(story.id)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-start flex-shrink-0">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'audiobooks' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Audiobooks ({audiobooks.length})</h2>
              <button onClick={() => setShowAudiobookModal(true)}
                className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm sm:text-base">
                <FiPlus /><span>Add Audiobook</span>
              </button>
            </div>
            {audiobooks.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <FiMusic size={48} className="mx-auto mb-4 text-primary" />
                <p className="text-gray-600">No audiobooks found</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {audiobooks.map(audiobook => (
                  <div key={audiobook.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{audiobook.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{audiobook.description}</p>
                        <p className="text-gray-500 text-xs">{audiobook.author_name} • Narrator: {audiobook.narrator || 'N/A'} • {audiobook.duration} min</p>
                      </div>
                      <button onClick={() => deleteAudiobook(audiobook.id)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-start flex-shrink-0">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Videos ({videos.length})</h2>
              <button onClick={() => setShowVideoModal(true)}
                className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm sm:text-base">
                <FiPlus /><span>Add Video</span>
              </button>
            </div>
            {videos.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <FiVideo size={48} className="mx-auto mb-4 text-primary" />
                <p className="text-gray-600">No videos found</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {videos.map(video => (
                  <div key={video.id} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{video.title}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{video.description}</p>
                        <p className="text-gray-500 text-xs">{video.author_name} • {video.category} • {video.duration} min</p>
                      </div>
                      <button onClick={() => deleteVideo(video.id)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-start flex-shrink-0">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'images' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Manage Images ({images.length})</h2>
              <button onClick={() => setShowImageModal(true)}
                className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm sm:text-base">
                <FiPlus /><span>Add Image</span>
              </button>
            </div>
            {images.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <FiImage size={48} className="mx-auto mb-4 text-primary" />
                <p className="text-gray-600">No images found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {images.map(image => (
                  <div key={image.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    {image.image_url && (
                      <img src={image.image_url} alt={image.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-3">
                      <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">{image.title}</h3>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">{image.description}</p>
                      <p className="text-gray-500 text-xs mb-2">{image.author_name || 'No author'} • {image.category}</p>
                      {image.tags && (
                        <p className="text-orange-600 text-xs mb-2">🏷️ {image.tags}</p>
                      )}
                      <button onClick={() => deleteImage(image.id)}
                        className="w-full p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-semibold">
                          Delete
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
      <EditAuthorModal show={showEditAuthorModal} onClose={() => { setShowEditAuthorModal(false); setEditingAuthor(null); }} 
        onSubmit={handleEditAuthor} author={editingAuthor} />
      <AddPoemModal show={showPoemModal} onClose={() => setShowPoemModal(false)} onSubmit={handleAddPoem}
        authors={authors} />
      <AddShortStoryModal show={showStoryModal} onClose={() => setShowStoryModal(false)} onSubmit={handleAddStory}
        authors={authors} />
      <AddAudiobookModal show={showAudiobookModal} onClose={() => setShowAudiobookModal(false)} onSubmit={handleAddAudiobook}
        authors={authors} />
      <AddVideoModal show={showVideoModal} onClose={() => setShowVideoModal(false)} onSubmit={handleAddVideo}
        authors={authors} />
      <AddImageModal show={showImageModal} onClose={() => setShowImageModal(false)} onSubmit={handleAddImage}
        authors={authors} />
    </div>
  );
};

export default AdminPanel;
