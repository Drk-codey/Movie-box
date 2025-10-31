// src/components/Profile/WatchlistSection.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../UI/Card';

const WatchlistSection = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [sortBy, setSortBy] = useState('added'); // added, priority, title
  const [filterStatus, setFilterStatus] = useState('all'); // all, planned, watching, completed
  const [viewMode, setViewMode] = useState('grid');

  const statusOptions = [
    { value: 'all', label: 'All', color: 'gray' },
    { value: 'planned', label: 'Plan to Watch', color: 'blue' },
    { value: 'watching', label: 'Watching', color: 'green' },
    { value: 'completed', label: 'Completed', color: 'purple' },
  ];

  const handleChangeStatus = (movieId, newStatus) => {
    setWatchlist(prev =>
      prev.map(item =>
        item.id === movieId ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleRemoveFromWatchlist = (movieId) => {
    setWatchlist(prev => prev.filter(item => item.id !== movieId));
  };

  const handleMarkAsWatched = (movieId) => {
    handleChangeStatus(movieId, 'completed');
  };

  const filteredWatchlist = watchlist.filter(item =>
    filterStatus === 'all' ? true : item.status === filterStatus
  );

  // Empty state
  if (watchlist.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mb-6">
          <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Watchlist is Empty</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Keep track of movies you want to watch. Add movies to your watchlist and never forget what to watch next!
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Movies
          </Link>
          <Link
            to="/upcoming"
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upcoming Movies
          </Link>
        </div>

        {/* Tips Card */}
        <div className="mt-12 max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-6 text-left">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-3xl">💡</div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Pro Tips:</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Click the "+" icon on any movie card to add it to your watchlist</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Organize movies by status: Plan to Watch, Watching, or Completed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>Get reminders when movies from your watchlist become available</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header with Stats */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">My Watchlist</h2>
            <p className="text-gray-600">
              {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} to watch
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Movie
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export List
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusOptions.map((status) => {
            const count = watchlist.filter(item => 
              status.value === 'all' ? true : item.status === status.value
            ).length;
            
            return (
              <div
                key={status.value}
                className={`p-4 rounded-lg border-2 ${
                  filterStatus === status.value
                    ? `border-${status.color}-500 bg-${status.color}-50`
                    : 'border-gray-200 bg-gray-50'
                } cursor-pointer hover:border-${status.color}-400 transition-colors`}
                onClick={() => setFilterStatus(status.value)}
              >
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{status.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
            >
              <option value="added">Date Added</option>
              <option value="priority">Priority</option>
              <option value="title">Title (A-Z)</option>
              <option value="release">Release Date</option>
            </select>
          </div>

          {/* View Mode */}
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

      {/* Empty Filtered State */}
      {filteredWatchlist.length === 0 && watchlist.length > 0 && (
        <div className="bg-white rounded-xl p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No movies found</h3>
          <p className="text-gray-600">Try changing your filters</p>
        </div>
      )}

      {/* Watchlist Display (Placeholder - similar structure to Favorites) */}
      {filteredWatchlist.length > 0 && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}>
          {/* Movies will be displayed here similar to Favorites */}
          <div className="bg-white rounded-xl p-12 text-center col-span-full">
            <p className="text-gray-600">Watchlist movies will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchlistSection;