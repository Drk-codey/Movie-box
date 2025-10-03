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
} from '../store/slices/moviesSlice';import { useMovies } from '../hooks/redux';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import Card from '../components/UI/Card';
 
const Movies = () => {
  return (
    <div>Movies</div>
  )
}
 
export default Movies;
 