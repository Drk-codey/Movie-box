import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleFavorite } from '../../store/slices/moviesSlice';
// import { AuthGuard } from '../ProtectedRoute';
// Fallback image for movies without a poster
const FALLBACK_POSTER = 'https://via.placeholder.com/300x450/374151/ffffff?text=No+Image';

 
const Card = ({ movie }) => {
  const dispatch = useDispatch();
  const { favorites, isLoading } = useSelector((state) => state.movies);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // Handle missing movie data
  if (!movie) {
    return (
      <div className="max-w-80 max-sm:w-[95%] bg-gray-100 rounded-lg animate-pulse">
        <div className="h-96 bg-gray-300 rounded-t-lg"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.includes(movie.id);

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please sign in to add favorites');
      return;    
    }

    console.log(movie.id);
    dispatch(toggleFavorite(movie.id));
  };

  const formatRating = (rating) => {
    if (typeof rating === 'number') {
      return rating.toFixed(1);
    }
    return rating || 'N/A';
  };

  const getMovieType = () => {
    if (movie.type) return movie.type;
    if (movie.runtime && movie.runtime > 60) return 'Movie';
    if (movie.relaseDate) return 'Movie';
    return 'Movie';
  }

  // console.log(movie)

  // const const getMovieYear = () => {
  //   if (movie.year) return movie.year;
  //   if (movie.releaseDate) {
  //     return new Date(movie.releaseDate).getFullYear();
  //   }
  //   return 'Unknown';
  // };

  const getGenresDisplay = () => {
    if (movie.genres && Array.isArray(movie.genres)) {
      return movie.genres.slice(0, 2).map(genre => genre.name || genre).join(', ');
    }
    if (movie.genre && typeof movie.genre === 'string') {
      return movie.genre.split(', ').slice(0, 2).join(', ');
    }
    return '';
  };

  const getDescription = () => {
    return movie.overview || movie.plot || movie.description || 'No description available.';
  };

  const getRatingData = () => {
    // Handle different rating formats from different APIs
    if (movie.rating || movie.vote_average) {
      return {
        imdb: formatRating(movie.rating || movie.vote_average),
        source: movie.vote_count ? `${movie.vote_count} votes` : '/ 10',
      };
    }
    if (movie.imdbRating) {
      return {
        imdb: formatRating(movie.imdbRating),
        source: '/ 10',
      };
    }
    if (movie.ratings?.imdb) {
      return {
        imdb: movie.ratings.imdb,
        source: '/ 10',
      };
    }
    return {
      imdb: 'N/A',
      source: '/ 10',
    };
  };

  const ratingData = getRatingData();


  return (
    <div
      to={`/movie/${movie.id}`}
      className='group block max-w-80 max-sm:w-[95%] bg-white  rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105'
    >
       {/* Movie Poster */}
      <div className='relative h-96 overflow-hidden bg-gray-200'>
        <img 
          src={movie.poster || FALLBACK_POSTER} 
          alt={movie.title || 'Movie poster'}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
          loading="lazy"
          onError={(e) => {
            e.target.src = FALLBACK_POSTER;
          }}
        />

        {/* Overlay Controls */}
        <div className='absolute top-3 left-3 flex justify-between items-center w-[calc(100%-24px)] z-20'>
          {/* Movie Type Badge */}
          <div className='px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/20'>
            <p className='text-white text-sm font-medium'>{getMovieType()}</p>
          </div>
          
          {/* Favorite Button - Only show for authenticated users */}
          {/* <AuthGuard 
            fallback={
              <div className='w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-60'>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            }
            >
            </AuthGuard> */}
            <button 
              onClick={handleFavoriteToggle}
              // disabled={isLoading.favorites}
              className={`w-9 h-9 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-black/60 hover:bg-red-500/80 text-white'
              } ${isLoading.favorites ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              type="button"
            >
              <svg 
                className={`w-5 h-5 transition-all duration-200 ${
                  isFavorite ? 'fill-current' : 'stroke-current fill-none'
                }`}
                viewBox="0 0 24 24" 
                strokeWidth="2"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
            </button>

          {/* Gradient Overlay */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" /> */}
        </div>

        {/* Movie Info */}
        
        
      </div>
      <div className='p-4 flex flex-col gap-3'>
          <p className='text-gray-600 text-sm font-medium'>
            {movie.country || ''} {`${movie.country ? ',' : ''}`} {movie.year}
            {movie.runtime && ` • ${movie.runtime} min`}
          </p>
          
          <Link to={`/movie/${movie.id}`}>
            <h2 className='text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight'>
              {movie.title || movie.Title || 'Untitled Movie'}
            </h2>
          </Link>
          
          {getGenresDisplay() && (
            <div className="flex flex-wrap gap-1">
              {getGenresDisplay().split(', ').map((genre, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          <div className='flex items-center justify-between gap-4 text-xs'>
            <div className='flex items-center gap-2'>
              <div className=" bg-yellow-400 p-0.75 rounded text-black text-xs font-bold flex items-center justify-center">
                <p>IMDb</p>
              </div>
              <p className="font-semibold text-gray-700">
                {ratingData.imdb} {ratingData.source}
              </p>
            </div>

            {movie.popularity && (
              <div className='flex items-center gap-2'>
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                <p className="font-semibold text-gray-700">
                  {Math.round(movie.popularity)}
                </p>
              </div>
            )}
          </div>
        
          <p className='text-gray-600 text-sm line-clamp-3 leading-relaxed'>
            {getDescription()}
          </p>
        </div>
    </div>
  )
}
 
export default Card;
 