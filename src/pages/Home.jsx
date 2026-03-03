import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FiSearch, FiFilter, FiX, FiStar } from 'react-icons/fi';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, selectedCategory, selectedAuthor, selectedGenre, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksRes, categoriesRes, authorsRes, genresRes] = await Promise.all([
        api.get('/books/'),
        api.get('/categories/'),
        api.get('/authors/'),
        api.get('/genres/')
      ]);
      
      setBooks(booksRes.data);
      setCategories(categoriesRes.data);
      setAuthors(authorsRes.data);
      setGenres(genresRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = [...books];

    if (selectedCategory) {
      filtered = filtered.filter(book => book.category === parseInt(selectedCategory));
    }

    if (selectedAuthor) {
      filtered = filtered.filter(book => book.author === parseInt(selectedAuthor));
    }

    if (selectedGenre) {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        (book.author_name && book.author_name.toLowerCase().includes(query)) ||
        (book.category_name && book.category_name.toLowerCase().includes(query))
      );
    }

    setFilteredBooks(filtered);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedAuthor('');
    setSelectedGenre('');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory || selectedAuthor || selectedGenre;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Digital Library</h1>
        <p className="text-gray-700">Explore our collection of books</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, authors..."
            className="w-full pl-12 pr-12 py-3 bg-white border-2 border-orange-200 rounded-xl text-gray-800 focus:outline-none focus:border-primary transition-colors shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <FiX />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-orange-200 rounded-xl text-gray-700 hover:text-primary hover:border-primary transition-colors shadow-sm font-semibold"
          >
            <FiFilter />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-bold">
                {[selectedCategory, selectedAuthor, selectedGenre].filter(Boolean).length}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-primary hover:text-orange-600 font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border-2 border-orange-200 rounded-xl shadow-sm">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-800 focus:outline-none focus:border-primary"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
              <select
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full px-3 py-2 bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-800 focus:outline-none focus:border-primary"
              >
                <option value="">All Authors</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>{author.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Genre</label>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-3 py-2 bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-800 focus:outline-none focus:border-primary"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre.value} value={genre.value}>{genre.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-gray-700 font-semibold">
          {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
        </p>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <p className="text-6xl mb-4">📚</p>
          <p className="text-gray-600 text-lg">No books found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map(book => (
            <Link
              key={book.id}
              to={`/book/${book.id}`}
              className="bg-white rounded-xl overflow-hidden border-2 border-orange-100 hover:border-primary transition-all duration-300 hover:transform hover:scale-105 shadow-md hover:shadow-xl"
            >
              <div className="relative h-64 bg-orange-50">
                {book.cover_image_url ? (
                  <img
                    src={book.cover_image_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    📚
                  </div>
                )}
                {book.is_paid && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                    Paid
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-gray-800 font-bold text-lg mb-2 line-clamp-2">
                  {book.title}
                </h3>
                {book.author_name && (
                  <p className="text-gray-600 text-sm mb-2">by {book.author_name}</p>
                )}
                <div className="flex items-center justify-between">
                  {book.category_name && (
                    <span className="text-xs text-gray-600 font-semibold">{book.category_name}</span>
                  )}
                  {book.average_rating > 0 && (
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <FiStar className="fill-current" size={14} />
                      <span className="text-xs font-bold">{book.average_rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
