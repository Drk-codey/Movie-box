// src/components/Profile/FavoritesSection.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useMovies } from '../../hooks/redux';
import { fetchMovieDetails, toggleFavorite } from '../../store/slices/moviesSlice';
import Card from '../UI/Card';

const FavoritesSection = () => {
  const dispatch = useDispatch();
  const { favorites, popularMovies, isLoading } = useMovies();
  
  const [sortBy, setSortBy] = useState('recent'); // recent, title, rating
  const [filterGenre, setFilterGenre] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  // Get favorite movies from popularMovies based on favorites array
  const favoriteMovies = popularMovies.filter(movie => favorites.includes(movie.id));

  // Sort favorites
  const sortedFavorites = [...favoriteMovies].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'rating':
        return (b.rating || b.vote_average || 0) - (a.rating || a.vote_average || 0);
      case 'recent':
      default:
        return 0; // Keep original order (most recently added)
    }
  });

  const handleRemoveFavorite = (movieId) => {
    dispatch(toggleFavorite(movieId));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      favoriteMovies.forEach(movie => {
        dispatch(toggleFavorite(movie.id));
      });
    }
  };

  // Empty state
  if (favoriteMovies.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-6">
          <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Start building your collection of favorite movies. Click the heart icon on any movie to add it here!
        </p>
        <Link
          to="/movies"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Browse Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">My Favorites</h2>
          <p className="text-gray-600">
            {favoriteMovies.length} {favoriteMovies.length === 1 ? 'movie' : 'movies'} in your collection
          </p>
        </div>

        <button
          onClick={handleClearAll}
          className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear All
        </button>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Sort By */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
            >
              <option value="recent">Recently Added</option>
              <option value="title">Title (A-Z)</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="ml-auto flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Movies Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedFavorites.map((movie) => (
            <div key={movie.id} className="relative group mx-auto w-full flex justify-center">
              <Card movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedFavorites.map((movie) => (
            <div key={movie.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex gap-4 p-4">
                <Link to={`/movie/${movie.id}`} className="flex-shrink-0">
                  <img
                    src={movie.poster || 'https://via.placeholder.com/150x225/374151/ffffff?text=No+Image'}
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded-lg"
                  />
                </Link>
                
                <div className="flex-1 min-w-0">
                  <Link to={`/movie/${movie.id}`}>
                    <h3 className="text-lg font-bold text-gray-900 hover:text-red-600 transition-colors mb-1">
                      {movie.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span>{movie.year || 'N/A'}</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {(movie.rating || movie.vote_average || 0).toFixed(1)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {movie.overview || movie.plot || 'No description available.'}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {movie.genres && movie.genres.slice(0, 3).map((genre, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {genre.name || genre}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col gap-2">
                  <Link
                    to={`/movie/${movie.id}`}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemoveFavorite(movie.id)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;