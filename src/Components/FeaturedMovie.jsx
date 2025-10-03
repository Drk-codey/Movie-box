import React, { useEffect } from 'react';
import RightArrow from '../../src/assets/right-arrow.svg';
import Card from './UI/Card';
import { useDispatch } from 'react-redux';
import { useMovies } from '../hooks/redux';
import { fetchPopularMovies } from '../store/slices/moviesSlice';
import { Link } from 'react-router-dom';
 
const FeaturedMovie = () => {
  const dispatch = useDispatch();
  const { popularMovies, isLoading, error } = useMovies();
  // const items = Array.from({ length: 12 });

  // Fetch popular movies when component mounts
  useEffect(() => {
    // Only fetch if there is no popular movies yet
    if (popularMovies.length === 0) {
      dispatch(fetchPopularMovies(1));
    }
  }, [dispatch, popularMovies.length]);

  // Show loading state
  if (isLoading.popular && popularMovies.length === 0) {
    return (
      <section className="px-6 py-5">
        <div className='max-w-7xl w-full mx-auto my-12'>
          <div className='flex justify-between items-center w-full md:w-auto'>
            <h2 className='text-3xl md:text-4xl'>Featured Movies</h2>
          </div>

          {/* Loading skeleton */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-10'>
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
        </div>
      </section>
    )
  }

  // Show error state
  if (error.popular) {
    return (
      <section className='px-6 py-5'>
        <div className='max-w-7xl w-full mx-auto my-12'>
          <div className='flex justify-between items-center w-full md:w-auto mb-8'>
            <h2 className='text-3xl md:text-4xl font-bold'>Featured Movies</h2>
          </div>
        </div>

        <div className='max-w-7xl w-full mx-auto my-12 bg-red-50 border border-red-200 rounded-lg p-6 text-center'>
          <div className='text-red-600 mb-2'>
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-red-800 mb-1'>Unable to Load Movies</h3>
          <p className='text-red-600 mb-4'>{error.popular}</p>
          <button 
            onClick={() => dispatch(fetchPopularMovies(1))}
            className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors'
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className='px-6 py-5'>
      <div className='max-w-7xl w-full mx-auto my-12 flex flex-col justify-between gap-8'>
        <div className='flex justify-between items-center w-full md:w-auto'>
          <h2 className='text-3xl md:text-4xl'>Featured Movies</h2>
          <Link to="/movies" className='flex items-center gap-2 text-red-500'>
            <span>See more</span>
            <img src={RightArrow} alt="Right Arrow" className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-10 max-sm:place-items-center space-y-6'>
          {popularMovies.slice(0, 12).map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Load More Button */}
        {popularMovies.length > 0 && (
          <div className="text-center">
            <button
              onClick={() => dispatch(fetchPopularMovies(1))}
              disabled={isLoading.popular}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
            >
              {isLoading.popular ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading...
                </>
              ) : (
                'Refresh Movies'
              )}
            </button>
          </div>
        )}

      </div>
    </section>
  )
}
 
export default FeaturedMovie;
 