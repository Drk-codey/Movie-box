// API Service layer for movie data

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'your_tmdb_key_here';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

class MovieAPIService {
  constructor() {
    this.tmdbKey = TMDB_API_KEY;
  }

  // Generic fetch wrapper with error handling
  async fetchData(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.Response === 'False') {
        throw new Error(data.Error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  // ===== TMDb API METHODS (Better for modern movie apps) =====
  
  // Get popular movies
  async getPopularMovies(page = 1) {
    const url = `${TMDB_BASE_URL}/movie/popular?api_key=${this.tmdbKey}&page=${page}&append_to_response=credits,country`;
    const data = await this.fetchData(url);

    return {
      movies: data.results.map(this.transformTMDbMovie),
      currentPage: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    };
  }

  // Get now playing movies
  async getNowPlayingMovies(page = 1) {
    const url = `${TMDB_BASE_URL}/movie/now_playing?api_key=${this.tmdbKey}&page=${page}`;
    const data = await this.fetchData(url);

    return {
      movies: data.results.map(this.transformTMDbMovie),
      currentPage: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    };
  }

  // Get upcoming movies
  async getUpcomingMovies(page = 1) {
    const url = `${TMDB_BASE_URL}/movie/upcoming?api_key=${this.tmdbKey}&page=${page}`;
    const data = await this.fetchData(url);

    return {
      movies: data.results.map(this.transformTMDbMovie),
      currentPage: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    };
  }

  // Search movies in TMDb
  async searchTMDbMovies(query, page = 1) {
    const params = new URLSearchParams({
      api_key: this.tmdbKey,
      query,
      page: page.toString(),
    });

    const url = `${TMDB_BASE_URL}/search/movie?${params}`;
    const data = await this.fetchData(url);

    return {
      movies: data.results.map(this.transformTMDbMovie),
      currentPage: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    };
  }

  // Get movie details from TMDb
  async getTMDbMovieById(movieId) {
    const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${this.tmdbKey}&append_to_response=credits,reviews,videos`;
    const movie = await this.fetchData(url);

    return this.transformTMDbMovieDetails(movie);
  }

  // Get movies by genre
  async getMoviesByGenre(genreId, page = 1) {
    const url = `${TMDB_BASE_URL}/discover/movie?api_key=${this.tmdbKey}&with_genres=${genreId}&page=${page}`;
    const data = await this.fetchData(url);

    return {
      movies: data.results.map(this.transformTMDbMovie),
      currentPage: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    };
  }

  // Get genres list
  async getGenres() {
    const url = `${TMDB_BASE_URL}/genre/movie/list?api_key=${this.tmdbKey}`;
    const data = await this.fetchData(url);
    return data.genres;
  }

  // ===== DATA TRANSFORMATION METHODS =====

  // Transform TMDb movie to our app's format
  transformTMDbMovie(movie) {
    return {
      id: movie.id,
      imdbId: movie.imdb_id,
      title: movie.title,
      year: new Date(movie.release_date).getFullYear(),
      releaseDate: movie.release_date,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
      backdrop: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : null,
      overview: movie.overview,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      popularity: movie.popularity,
      genreIds: movie.genre_ids,
      originalTitle: movie.original_title,
      originalLanguage: movie.original_language,
      adult: movie.adult,
      productionCountries: movie.production_countries,
    };
  }

  // Transform detailed TMDb movie
  transformTMDbMovieDetails(movie) {
    return {
      id: movie.id,
      imdbId: movie.imdb_id,
      title: movie.title,
      year: new Date(movie.release_date).getFullYear(),
      releaseDate: movie.release_date,
      runtime: movie.runtime,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
      backdrop: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}` : null,
      overview: movie.overview,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      popularity: movie.popularity,
      genres: movie.genres,
      productionCompanies: movie.production_companies,
      productionCountries: movie.production_countries,
      budget: movie.budget,
      revenue: movie.revenue,
      tagline: movie.tagline,
      status: movie.status,
      originalTitle: movie.original_title,
      originalLanguage: movie.original_language,
      homepage: movie.homepage,
      // Additional data from append_to_response
      cast: movie.credits?.cast?.slice(0, 10) || [],
      crew: movie.credits?.crew || [],
      director: movie.credits?.crew?.find(person => person.job === 'Director'),
      reviews: movie.reviews?.results?.slice(0, 5) || [],
      videos: movie.videos?.results || [],
      trailer: movie.videos?.results?.find(video => video.type === 'Trailer' && video.site === 'YouTube'),
    };
  }

  // Transform OMDB movie to our app's format
  transformOMDbMovie(movie) {
    return {
      id: movie.imdbID,
      imdbId: movie.imdbID,
      title: movie.Title,
      year: parseInt(movie.Year),
      releaseDate: movie.Released,
      runtime: movie.Runtime,
      poster: movie.Poster !== 'N/A' ? movie.Poster : null,
      plot: movie.Plot,
      director: movie.Director,
      writer: movie.Writer,
      actors: movie.Actors,
      genre: movie.Genre,
      language: movie.Language,
      country: movie.Country,
      awards: movie.Awards,
      imdbRating: parseFloat(movie.imdbRating) || 0,
      imdbVotes: movie.imdbVotes,
      type: movie.Type,
      dvd: movie.DVD,
      boxOffice: movie.BoxOffice,
      production: movie.Production,
      website: movie.Website,
      // Ratings from different sources
      ratings: movie.Ratings?.reduce((acc, rating) => {
        const source = rating.Source.toLowerCase();
        if (source.includes('imdb')) acc.imdb = rating.Value;
        if (source.includes('rotten')) acc.rottenTomatoes = rating.Value;
        if (source.includes('metacritic')) acc.metacritic = rating.Value;
        return acc;
      }, {}) || {},
    };
  }
}

// Create and export a singleton instance
export const movieAPI = new MovieAPIService();
export default movieAPI;