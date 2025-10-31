// src/components/Profile/ProfileOverview.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../../hooks/redux';

const ProfileOverview = ({ user }) => {
     const { favorites } = useMovies();
  
  const stats = [
    {
      label: 'Movies Watched',
      value: '0',
      icon: '🎬',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Favorites',
      value: favorites.length !== 0 ? favorites.length : '0',
      icon: '❤️',
      color: 'bg-red-50 text-red-600',
    },
    {
      label: 'Watchlist',
      value: '0',
      icon: '📋',
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Reviews Written',
      value: '0',
      icon: '✍️',
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  const recentActivity = [
    {
      action: 'Joined MovieBox',
      date: new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      icon: '🎉',
    },
  ];

  const achievements = [
    {
      title: 'First Steps',
      description: 'Created your MovieBox account',
      icon: '🌟',
      earned: true,
    },
    {
      title: 'Movie Buff',
      description: 'Add 10 movies to favorites',
      icon: '🎭',
      earned: false,
      progress: '0/10',
    },
    {
      title: 'Critic',
      description: 'Write 5 movie reviews',
      icon: '📝',
      earned: false,
      progress: '0/5',
    },
    {
      title: 'Binge Watcher',
      description: 'Add 20 movies to watchlist',
      icon: '🍿',
      earned: false,
      progress: '0/20',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{stat.icon}</span>
              <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center text-2xl font-bold`}>
                {stat.value}
              </div>
            </div>
            <h3 className="text-gray-700 font-medium">{stat.label}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Link to="#" className="text-red-600 hover:text-red-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity</p>
                <p className="text-sm mt-2">Start exploring movies!</p>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <span className="text-3xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Account Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
              </div>
              <Link to="/profile?tab=settings" className="text-red-600 hover:text-red-700 text-sm">
                Edit
              </Link>
            </div>

            <div className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>
              <span className="text-green-600 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
          <span className="text-sm text-gray-600">1 of {achievements.length} earned</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border-2 transition-all ${
                achievement.earned
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
                  : 'bg-gray-50 border-gray-200 opacity-75'
              }`}
            >
              <div className="text-center">
                <div className={`text-5xl mb-3 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                {!achievement.earned && achievement.progress && (
                  <div className="mt-3">
                    <div className="bg-gray-200 rounded-full h-2 mb-1">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500">{achievement.progress}</p>
                  </div>
                )}
                {achievement.earned && (
                  <span className="inline-block mt-2 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                    ✓ Earned
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Start Your Movie Journey</h2>
        <p className="text-white/90 mb-6">
          Discover amazing movies, create your watchlist, and share your thoughts with reviews!
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/movies"
            className="px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Movies
          </Link>
          <Link
            to="/upcoming"
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30"
          >
            See Upcoming
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;