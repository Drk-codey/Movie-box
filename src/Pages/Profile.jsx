import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth, useMovies } from '../hooks/redux';
import { logoutUser } from '../store/slices/authSlide';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

// Import sub-components
import ProfileOverview from '../Components/Profile/ProfileOverview';
import FavoritesSection from '../Components/Profile/FavoriteSection';
import WatchlistSection from '../Components/Profile/WatchlistSection';
import SettingsSection from '../Components/Profile/SettingsSection';


const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

   const { favorites } = useMovies();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: '/profile' } });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const tabs = [
    {
      id: 'overview',
      name: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'favorites',
      name: 'My Favorites',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: 'watchlist',
      name: 'Watchlist',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProfileOverview user={user} />;
      case 'favorites':
        return <FavoritesSection />;
      case 'watchlist':
        return <WatchlistSection />;
      case 'settings':
        return <SettingsSection user={user} onLogout={handleLogout} />;
      default:
        return <ProfileOverview user={user} />;
    }
  };

  useEffect(() => {
    const tab = searchParams.get('tab') || 'overview';
    setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/profile?tab=${tabId}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
    
      {/* Profile Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left text-white flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{user.name}</h1>
              <p className="text-white/90 text-lg mb-4">{user.email}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold">Member since {new Date(user.createdAt).getFullYear()}</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold">🎬 Movie Enthusiast</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{favorites.length !== 0 ? favorites.length : '0'}</div>
                <div className="text-sm text-white/80">Favorites</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">0</div>
                <div className="text-sm text-white/80">Watchlist</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">0</div>
                <div className="text-sm text-white/80">Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b -sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'text-red-600 border-red-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderTabContent()}
      </div>

      <div className="text-center mt-8 bg-red-600 pt-6">
        <Footer />
      </div>
    </div>
  )
}
 
export default Profile;
 