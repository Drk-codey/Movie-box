import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { 
  fetchPopularMovies, 
  searchMovies, 
  fetchGenres,
  fetchMoviesByGenre,
  clearSearchResults,
  setSearchQuery 
} from '../store/slices/moviesSlice';
import { useMovies } from '../hooks/redux';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Card from '../Components/UI/Card'; 
 
const Movies = () => { 
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('popular');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { 
    popularMovies, 
    searchResults, 
    genres,
    searchQuery,
    pagination,
    isLoading, 
    error 
  } = useMovies();

  const getCurrentMovies = () => {
    switch (activeCategory) {
      case 'search':
        return searchResults || [];
      case 'genre':
        return popularMovies || []; // In real app, would have separate state for genre results
      case 'popular':
      default:
        return popularMovies || [];
    }
  };

  const currentMovies = getCurrentMovies();
  console.log(currentMovies);

  // Load data on component mount
  useEffect(() => {
    // Load genres for filter dropdown
    if (genres.length === 0) {
      dispatch(fetchGenres());
    }

    // Check URL params for initial search
    const searchParam = searchParams.get('search');
    const genreParam = searchParams.get('genre');

    if (searchParam) {
      setActiveCategory('search');
      setSearchInput(searchParam);
      dispatch(setSearchQuery(searchParam));
      dispatch(searchMovies({ query: searchParam, page: 1 }));
    } else if (genreParam) {
      setActiveCategory('genre');
      setSelectedGenre(genreParam);
      dispatch(fetchMoviesByGenre({ genreId: genreParam, page: 1 }));
    } else {
      // Default to popular movies
      setActiveCategory('popular');
      if (popularMovies.length === 0) {
        dispatch(fetchPopularMovies(1));
      }
    }
  }, [dispatch, searchParams, genres.length, popularMovies.length]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveCategory('search');
      setSearchParams({ search: searchInput.trim() });
      dispatch(clearSearchResults());
      dispatch(searchMovies({ query: searchInput.trim(), page: 1 }));
    }
  };

  // Handle category changes
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchParams({});
    
    switch (category) {
      case 'popular':
        dispatch(clearSearchResults());
        if (popularMovies.length === 0) {
          dispatch(fetchPopularMovies(1));
        }
        break;
      case 'search':
        // Keep current search results
        break;
      default:
        break;
    }
  };

  // Handle genre filter
  const handleGenreChange = (genreId) => {
    if (genreId) {
      setSelectedGenre(genreId);
      setActiveCategory('genre');
      setSearchParams({ genre: genreId });
      dispatch(fetchMoviesByGenre({ genreId, page: 1 }));
    } else {
      setSelectedGenre('');
      handleCategoryChange('popular');
    }
  };

  // Handle load more movies
  const handleLoadMore = () => {
    const nextPage = pagination.currentPage + 1;
    
    switch (activeCategory) {
      case 'search':
        dispatch(searchMovies({ query: searchQuery, page: nextPage }));
        break;
      case 'genre':
        dispatch(fetchMoviesByGenre({ genreId: selectedGenre, page: nextPage }));
        break;
      case 'popular':
      default:
        dispatch(fetchPopularMovies(nextPage));
        break;
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    dispatch(clearSearchResults());
    setSearchParams({});
    handleCategoryChange('popular');
  };

  // Get current loading state
  const isCurrentlyLoading = () => {
    switch (activeCategory) {
      case 'search':
        return isLoading.search;
      case 'genre':
        return isLoading.popular; // In real app, would have isLoading.genre
      default:
        return isLoading.popular;
    }
  };

  // Get current error
  const getCurrentError = () => {
    switch (activeCategory) {
      case 'search':
        return error.search;
      case 'genre':
        return error.popular;
      default:
        return error.popular;
    }
  };

  // Safe genre name getter
  const getGenreName = () => {
    if (!genres || !selectedGenre) return 'Genre';
    const genre = genres.find(g => g.id.toString() === selectedGenre);
    return genre?.name || 'Genre';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Main Content */}
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {activeCategory === 'search' && searchQuery 
                ? `Search Results for "${searchQuery}"`
                : activeCategory === 'genre' && selectedGenre
                  ? `${getGenreName()} Movies`
                  : 'Popular Movies'
              }
            </h1>
            <p className="text-gray-600">
              {activeCategory === 'search' 
                ? `Found ${pagination.totalResults || 0} results`
                : `Discover the best movies`
              }
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              
              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search for movies..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                    {searchInput && (
                      <button
                        type="button"
                        onClick={() => setSearchInput('')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!searchInput.trim() || isLoading.search}
                      className="p-1 text-red-500 hover:text-red-600 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>

              {/* Category Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleCategoryChange('popular')}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeCategory === 'popular'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Popular
                </button>
                
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="px-4 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>

              {/* Genre Filter */}
              <select
                value={selectedGenre}
                onChange={(e) => handleGenreChange(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors min-w-[150px]"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Section */}
          {getCurrentError() ? (
            // Error State
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <div className="text-red-600 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">Something went wrong</h3>
              <p className="text-red-600 mb-6">{getCurrentError()}</p>
              <button
                onClick={() => {
                  switch (activeCategory) {
                    case 'search':
                      dispatch(searchMovies({ query: searchQuery, page: 1 }));
                      break;
                    case 'genre':
                      dispatch(fetchMoviesByGenre({ genreId: selectedGenre, page: 1 }));
                      break;
                    default:
                      dispatch(fetchPopularMovies(1));
                      break;
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : isCurrentlyLoading() && currentMovies.length === 0 ? (
            // Loading State (First Load)
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 h-96 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : currentMovies.length === 0 ? (
            // Empty State
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h5a1 1 0 110 2h-1v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6H2a1 1 0 110-2h5zM6 6v14h12V6H6zm5-2V2H9v2h6z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No movies found</h3>
              <p className="text-gray-600 mb-6">
                {activeCategory === 'search' 
                  ? `We couldn't find any movies matching "${searchQuery}"`
                  : 'No movies available at the moment'
                }
              </p>
              {activeCategory === 'search' && (
                <button
                  onClick={handleClearSearch}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Browse Popular Movies
                </button>
              )}
            </div>
          ) : (
            // Movies Grid
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {currentMovies.map((movie) => (
                  <Card key={movie.id} movie={movie} />
                ))}
              </div>

              {/* Pagination / Load More */}
              {pagination.currentPage < pagination.totalPages && (
                <div className="text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isCurrentlyLoading()}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                  >
                    {isCurrentlyLoading() ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Loading More...
                      </>
                    ) : (
                      <>
                        Load More Movies
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                  <p className="text-gray-600 text-sm mt-4">
                    Showing {currentMovies.length} of {pagination.totalResults} movies
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
 
export default Movies;
 