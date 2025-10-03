// src/pages/MovieDetail.jsx - Complete movie detail page
import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMovieDetails, toggleFavorite, clearCurrentMovie } from '../store/slices/moviesSlice';
import { useMovies, useAuth } from '../hooks/redux';
// import Header from '../components/Header';
import Footer from '../Components/Footer';

const FALLBACK_BACKDROP = 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=No+Backdrop';
const FALLBACK_POSTER = 'https://via.placeholder.com/500x750/374151/ffffff?text=No+Poster';

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentMovie, favorites, isLoading, errors } = useMovies();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Fetch movie details when component mounts
    dispatch(fetchMovieDetails({ movieId: id, useOMDB: false }));

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentMovie());
    };
  }, [dispatch, id]);

  const isFavorite = favorites.includes(parseInt(id));

  const handleFavoriteToggle = () => {
    if (isAuthenticated) {
      dispatch(toggleFavorite(parseInt(id)));
    } else {
      navigate('/signin', { state: { from: `/movie/${id}` } });
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading State
  if (isLoading.details && !currentMovie) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading movie details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (errors.details) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* <Header /> */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md px-6">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
            <p className="text-gray-400 mb-6">{errors.details}</p>
            <button
              onClick={() => navigate('/movies')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Browse Movies
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No Movie Data
  if (!currentMovie) {
    return null;
  }

  const movie = currentMovie;

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      {/* Hero Section with Backdrop */}
      <div className="relative pt-20">
        {/* Backdrop Image */}
        <div className="absolute inset-0 h-[600px]">
          <img
            src={movie.backdrop || FALLBACK_BACKDROP}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = FALLBACK_BACKDROP;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>

        {/* Movie Content */}
        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-12">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={movie.poster || FALLBACK_POSTER}
                alt={movie.title}
                className="w-full lg:w-80 rounded-lg shadow-2xl"
                onError={(e) => {
                  e.target.src = FALLBACK_POSTER;
                }}
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 text-white">
              {/* Title and Year */}
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {movie.title}
              </h1>
              
              {movie.tagline && (
                <p className="text-xl text-gray-300 italic mb-4">"{movie.tagline}"</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-lg mb-6">
                <span className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold">{movie.rating?.toFixed(1) || 'N/A'}</span>
                  <span className="text-gray-400">/ 10</span>
                </span>
                
                <span>•</span>
                <span>{movie.year}</span>
                
                {movie.runtime && (
                  <>
                    <span>•</span>
                    <span>{formatRuntime(movie.runtime)}</span>
                  </>
                )}
                
                {movie.status && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                      {movie.status}
                    </span>
                  </>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-red-600 rounded-full text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Overview</h2>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {movie.overview || 'No overview available.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                {movie.trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${movie.trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    Watch Trailer
                  </a>
                )}
                
                <button
                  onClick={handleFavoriteToggle}
                  disabled={isLoading.favorites}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isFavorite
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <svg className={`w-5 h-5 ${isFavorite ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>

                {movie.homepage && (
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Official Website
                  </a>
                )}
              </div>

              {/* Credits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {movie.director && (
                  <div>
                    <span className="text-gray-400">Director:</span>
                    <span className="ml-2 text-red-400 font-medium">{movie.director.name}</span>
                  </div>
                )}
                
                {movie.budget > 0 && (
                  <div>
                    <span className="text-gray-400">Budget:</span>
                    <span className="ml-2">{formatCurrency(movie.budget)}</span>
                  </div>
                )}
                
                {movie.revenue > 0 && (
                  <div>
                    <span className="text-gray-400">Revenue:</span>
                    <span className="ml-2">{formatCurrency(movie.revenue)}</span>
                  </div>
                )}
                
                {movie.releaseDate && (
                  <div>
                    <span className="text-gray-400">Release Date:</span>
                    <span className="ml-2">{formatDate(movie.releaseDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {movie.cast && movie.cast.length > 0 && (
        <div className="bg-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-6">Top Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movie.cast.slice(0, 10).map((person) => (
                <div key={person.id} className="text-center">
                  <div className="mb-3 overflow-hidden rounded-lg">
                    <img
                      src={person.profile_path ? `https://image.tmdb.org/t/p/w200${person.profile_path}` : 'https://via.placeholder.com/200x300/374151/ffffff?text=No+Image'}
                      alt={person.name}
                      className="w-full h-auto"
                    />
                  </div>
                  <h3 className="font-semibold text-white text-sm">{person.name}</h3>
                  <p className="text-gray-400 text-xs">{person.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      {movie.reviews && movie.reviews.length > 0 && (
        <div className="bg-gray-900 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-6">Reviews</h2>
            <div className="space-y-6">
              {movie.reviews.map((review) => (
                <div key={review.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                        {review.author.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{review.author}</h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    {review.author_details?.rating && (
                      <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold">{review.author_details.rating}/10</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-300 leading-relaxed line-clamp-4">
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MovieDetail;