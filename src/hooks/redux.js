import { useDispatch, useSelector } from 'react-redux';

// Custom hook for typed dispatch (JavaScript version)
export const useAppDispatch = () => useDispatch();

// Custom hook for typed selector (JavaScript version)
export const useAppSelector = useSelector;

// Specific selector hooks for common use cases
export const useAuth = () => {
  return useSelector((state) => ({
    user: state.auth.user,
    token: state.auth.token,
    isAuthenticated: state.auth.isAuthenticated,
    isLoading: state.auth.isLoading,
    error: state.auth.error,
  }));
};

export const useMovies = () => {
  return useSelector((state) => ({
    movies: state.movies.movies,
    featuredMovies: state.movies.featuredMovies,
    popularMovies: state.movies.popularMovies,
    currentMovie: state.movies.currentMovie,
    favorites: state.movies.favorites,
    pagination: state.movies.pagination,
    filters: state.movies.filters,
    isLoading: state.movies.isLoading,
    error: state.movies.errors,
  }));
};