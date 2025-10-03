import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import  useMovieAPI  from "../../service/movieApi";
import useMovieAPI from "../../service/movieApis";

// ===== ASYNC THUNKS FOR API CALLS =====

// Search movies
export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      if (!query.trim()) {
        return rejectWithValue('Search query cannot be empty');
      }

      const result = await useMovieAPI.searchTMDbMovies(query, page);
      return { ...result, searchQuery: query };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Popular movies
export const fetchPopularMovies = createAsyncThunk(
  "movies/fetchPopularMovies",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await useMovieAPI.getPopularMovies(page); // Call the API method
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// fetchPopularMovies();

// Get now playing movies
export const fetchNowPlayingMovies = createAsyncThunk(
  'movies/fetchNowPlayingMovies',
  async (page = 1, { rejectWithValue }) => {
    try {
      return await useMovieAPI.getNowPlayingMovies(page);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get upcoming movies
export const fetchUpcomingMovies = createAsyncThunk(
  'movies/fetchUpcomingMovies',
  async (page = 1, { rejectWithValue }) => {
    try {
      return await useMovieAPI.getUpcomingMovies(page);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get movie details
export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async ({ movieId }, { rejectWithValue }) => {
    try {
      const movie =  await useMovieAPI.getTMDbMovieById(movieId);
      return movie;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get movies by genre
export const fetchMoviesByGenre = createAsyncThunk(
  'movies/fetchMoviesByGenre',
  async ({ genreId, page = 1 }, { rejectWithValue }) => {
    try {
      return await useMovieAPI.getMoviesByGenre(genreId, page);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get genres list
export const fetchGenres = createAsyncThunk(
  'movies/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      return await useMovieAPI.getGenres();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Toggle favorites
export const toggleFavorite = createAsyncThunk(
  
);

// ===== INITIAL STATE =====
const initialState = {
  // Movie collections
  popularMovies: [],
  nowPlayingMovies: [],
  upcomingMovies: [],
  searchResults: [],
  
  // Single movie data
  currentMovie: null,
  
  // User data
  favorites: [],
  watchlist: [],
  
  // Genres
  genres: [],
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
  },
  
  // Search
  searchQuery: '',
  
  // Filters
  filters: {
    genre: null,
    year: null,
    rating: null,
    sortBy: 'popularity.desc',
  },
  
  // Loading states
  isLoading: {
    search: false,
    popular: false,
    nowPlaying: false,
    upcoming: false,
    details: false,
    genres: false,
    favorites: false,
  },
  
  // Error states
  errors: {
    search: null,
    popular: null,
    nowPlaying: null,
    upcoming: null,
    details: null,
    genres: null,
    favorites: null,
  },
};

// ===== SLICE DEFINITION =====
const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    // Clear specific errors
    clearError: (state, action) => {
      const errorType = action.payload;
      if (errorType && state.errors[errorType] !== undefined) {
        state.errors[errorType] = null;
      } else {
        // Clear all errors
        Object.keys(state.errors).forEach(key => {
          state.errors[key] = null;
        });
      }
    },

    // Set filters
    setFilters: (state, aciton) => {
      state.filters = {...state.filters, ...aciton.payload }
    },

    // Clear current movie
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    },

    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
      state.pagination = initialState.pagination;
    },

    // Set search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    // Add to favorites locally (before API call)
    addToFavoritesLocal: (state, action) => {
      const movieId = action.payload;
      if (!state.favorites.includes(movieId)) {
        state.favorites.push(movieId);
      }
    },

    // Remove from favorites locally
    removeFromFavoritesLocal: (state, action) => {
      const movieId = action.payload;
      state.favorites = state.favorites.filter(id => id !== movieId);
      },
  },

  extraReducers: (builder) => {
    builder
    // ===== SEARCH MOVIES =====
      .addCase(searchMovies.pending, (state) => {
        state.isLoading.search = true;
        state.errors.search = null;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.isLoading.search = false;
        state.searchResults = action.payload.movies;
        state.searchQuery = action.payload.searchQuery;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalResults: action.payload.totalResults,
        };
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.isLoading.search = false;
        state.errors.search = action.payload;
        state.searchResults = [];
      })

      // ===== POPULAR MOVIES =====
      .addCase(fetchPopularMovies.pending, (state) => {
        state.isLoading.popular = true;
        state.errors.popular = null;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.isLoading.popular = false;
        if (action.payload.currentPage === 1) {
          state.popularMovies = action.payload.movies;
        } else {
          // Append for pagination
          state.popularMovies = [...state.popularMovies, ...action.payload.movies];
        }
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalResults: action.payload.totalResults,
        };
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.isLoading.popular = false;
        state.errors.popular = action.payload;
      })

      // ===== NOW PLAYING MOVIES =====
      .addCase(fetchNowPlayingMovies.pending, (state) => {
        state.isLoading.nowPlaying = true;
        state.errors.nowPlaying = null;
      })
      .addCase(fetchNowPlayingMovies.fulfilled, (state, action) => {
        state.isLoading.nowPlaying = false;
        state.nowPlayingMovies = action.payload.movies;
      })
      .addCase(fetchNowPlayingMovies.rejected, (state, action) => {
        state.isLoading.nowPlaying = false;
        state.errors.nowPlaying = action.payload;
      })

       // ===== UPCOMING MOVIES =====
      .addCase(fetchUpcomingMovies.pending, (state) => {
        state.isLoading.upcoming = true;
        state.errors.upcoming = null;
      })
      .addCase(fetchUpcomingMovies.fulfilled, (state, action) => {
        state.isLoading.upcoming = false;
        state.upcomingMovies = action.payload.movies;
      })
      .addCase(fetchUpcomingMovies.rejected, (state, action) => {
        state.isLoading.upcoming = false;
        state.errors.upcoming = action.payload;
      })

       // ===== MOVIE DETAILS =====
      .addCase(fetchMovieDetails.pending, (state) => {
        state.isLoading.details = true;
        state.errors.details = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.isLoading.details = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.isLoading.details = false;
        state.errors.details = action.payload;
      })
      
      // ===== GENRES =====
      .addCase(fetchGenres.pending, (state) => {
        state.isLoading.genres = true;
        state.errors.genres = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.isLoading.genres = false;
        state.genres = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.isLoading.genres = false;
        state.errors.genres = action.payload;
      })

      // ===== TOGGLE FAVORITE =====
      .addCase(toggleFavorite.pending, (state) => {
        state.isLoading.favorites = true;
        state.errors.favorites = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.isLoading.favorites = false;
        const { movieId, isFavorite } = action.payload;
        
        if (isFavorite) {
          if (!state.favorites.includes(movieId)) {
            state.favorites.push(movieId);
          }
        } else {
          state.favorites = state.favorites.filter(id => id !== movieId);
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.isLoading.favorites = false;
        state.errors.favorites = action.payload;
      });
  }
});

export const {
  clearError,
  setFilters,
  clearCurrentMovie,
  clearSearchResults,
  setSearchQuery,
  addToFavoritesLocal,
  removeFromFavoritesLocal,
} = moviesSlice.actions;

export default moviesSlice.reducer;