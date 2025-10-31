import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPopularMovies } from '../store/slices/moviesSlice';
import { useMovies } from '../hooks/redux';
import Tvlogo from "../../src/assets/tv.png";
import Poster from "../../src/assets/Poster.png";
import Tomatologo from "../../src/assets/tomato-img.svg";
import ImdbLogo from "../../src/assets/imdb-img.svg";
import PlayButton from "../../src/assets/play-button.svg";

const FALLBACK_BACKDROP = Poster;
const AUTO_PLAY_INTERVAL = 10000; // 10 seconds PER MOVIE
const Hero = () => {
  const dispatch = useDispatch();
  const { popularMovies, isLoading } = useMovies();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch popular movies when component mounts
  useEffect(() => {
    // Only fetch if there is no popular movies yet
    if (popularMovies.length === 0) {
      dispatch(fetchPopularMovies(1));
    }
  }, [dispatch, popularMovies.length]);

  // Get top 5 movies for the hero section
  const featuredMovies = popularMovies.slice(0, 5);
  const currentMovie = featuredMovies[currentIndex] || null;

  // Auto-play movies
  useEffect(() => {
    if (isPaused || featuredMovies.length === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, currentIndex, featuredMovies.length]);

  // Handle next movie
  const handleNext = () => {
    if (isTransitioning || fetchPopularMovies.length === 0) return; // Prevent multiple clicks during transition
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredMovies.length);
      setIsTransitioning(false);
    }, 300); // Transition duration
  };

  // Handle movie selection by clicking indicators
  const handleSelectMovie = (index) => {
    if (isTransitioning || index === currentIndex) return; // Prevent multiple clicks during transition or selecting the same movie

    setIsTransitioning(true);
    setIsPaused(true); // Pause auto-play when user manually selects a movie
    
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    

      // Resume auto-play after a delay
      setTimeout(() => {
        setIsPaused(false);
      }, 10000); // Resume after 10 seconds

    }, 300);
  };

   // Format rating
  const formatRating = (rating) => {
    if (!rating) return 'N/A';
    return typeof rating === 'number' ? rating.toFixed(1) : rating;
  };

   const getRottenTomatoesRating = (rating) => {
    if (!rating) return 'N/A';
    return Math.round((rating / 10) * 100);
  };

  // Loading state 
  if (isLoading.popular && featuredMovies.length === 0) {
    return (
      <div className="relative top-0 w-full max-h-[1000px] h-[600px] lg:h-[800px] text-white flex flex-col justify-center gap-6 px-6">
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="bg-gray-300 w-full h-full animate-pulse"></div>
        </div>
        <div className="max-w-7xl w-full mx-auto flex flex-col gap-8 -border">
          <div className="max-w-[404px] flex flex-col gap-3 -border">
            <div className="h-10 bg-gray-300 rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6 mb-4 animate-pulse"></div>
            <div className="h-10 bg-gray-300 rounded w-1/2 mb-4 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // No movies available
  if (featuredMovies.length === 0) {
    return (
      <div className="relative top-0 w-full h-[600px] lg:h-[800px] bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">No featured movies available</p>
      </div>
    );
  }

  return (
    <div 
      className="relative top-0 w-full max-h-[1000px] h-[600px] lg:h-[700px] text-white flex flex-col justify-center gap-6 px-6 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Fade Transition */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        {featuredMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'} ${isTransitioning ? 'transition-opacity duration-300' : ''}`}            
          >
            <img
              src={movie.backdrop || movie.poster || FALLBACK_BACKDROP}
              alt={movie.title}
              className="size-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Movie Content with slide animation */}
      <div className="max-w-7xl w-full mx-auto flex flex-col gap-8 realtive z-10">
        <div 
          className={`max-w-[450px] flex flex-col gap-3 -border isTransitioning ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0' } transition-all duration-500`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
            {currentMovie?.title || 'Featured Movie'}
          </h1>

          <div className="flex items-center gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg">
              <img src={ImdbLogo} alt="IMDb Logo" className="h-5" />
              <p className="font-semibold">
                {formatRating(currentMovie?.rating || currentMovie?.vote_average)} / 10
              </p>
            </div>

            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg">
              <img src={Tomatologo} alt="Rotten Tomatoes Logo" className="h-5" />
              <p className="font-semibold">
                {getRottenTomatoesRating(currentMovie?.rating || currentMovie?.vote_average)}%
              </p>
            </div>

            {currentMovie?.year && (
              <div className="bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg">
                <p className="font-semibold">{currentMovie.year}</p>
              </div>
            )}
          </div>

          <p className="max-w-2xl text-base md:text-lg leading-relaxed text-white/90 drop-shadow-md line-clamp-3">
            {currentMovie?.overview ||
              currentMovie?.plot ||
              'No description available for this movie.'}
          </p>

          {/* Genres */}
          {currentMovie?.genres && currentMovie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentMovie.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre.id || genre}
                  className="px-3 py-1 bg-red-600/80 backdrop-blur-sm rounded-full text-sm font-medium"
                >
                  {genre.name || genre}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-4 mt-2">
            <button
              onClick={() => {
                if (currentMovie?.trailer) {
                  window.open(
                    `https://www.youtube.com/watch?v=${currentMovie.trailer.key}`,
                    '_blank'
                  );
                } else {
                  // Fallback: search for trailer
                  window.open(
                    `https://www.youtube.com/results?search_query=${encodeURIComponent(
                      currentMovie?.title + ' trailer'
                    )}`,
                    '_blank'
                  );
                }
              }}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <img src={PlayButton} alt="Play" className="w-5 h-5" />
              <span>Watch Trailer</span>
            </button>

            <button
              onClick={() => (window.location.href = `/movie/${currentMovie?.id}`)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-bold transition-all duration-300 border border-white/30"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute max-sm:bottom-4 max-sm:left-1/2 max-sm:-translate-x-1/2 sm:right-5 sm:top-1/2 sm:-translate-y-1/2 flex sm:flex-col max-sm:gap-3 sm:gap-4 z-20">
        {featuredMovies.map((movie, index) => (
          <button
            key={movie.id}
            onClick={() => handleSelectMovie(index)}
            className="flex items-center max-sm:flex-col gap-2 group cursor-pointer transition-all duration-300 hover:scale-110"
            aria-label={`View ${movie.title}`}
          >
            {/* Line/Dot Indicator */}
            <span
              className={`transition-all duration-500 ease-in-out bg-white max-sm:rotate-90 ${
                index === currentIndex
                  ? 'w-5 h-2 opacity-100 rounded-full shadow-lg shadow-white/50' // Active: Long line
                  : 'w-2 h-2 opacity-60 rounded-full group-hover:opacity-80 group-hover:w-3 group-hover:h-3' // Inactive: Dot
              }`}
            ></span>

            {/* Number */}
            <p
              className={`text-sm font-semibold transition-all duration-300 ${
                index === currentIndex
                  ? 'text-white text-lg scale-110 drop-shadow-lg'
                  : 'text-white/60 group-hover:text-white/80'
              }`}
            >
              {index + 1}
            </p>
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      {!isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
          <div
            className="h-full bg-red-600 transition-all duration-100 ease-linear"
            style={{
              width: '0%',
              animation: `progress ${AUTO_PLAY_INTERVAL}ms linear infinite`,
            }}
          ></div>
        </div>
      )}

      {/* CSS Animation for Progress Bar */}
      <style>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;
