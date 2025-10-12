import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlide';
import { setFilters } from '../store/slices/moviesSlice';
import Tvlogo from '/src/assets/tv.png';
import menuAlt from '/src/assets/menu-alt.svg';
import searchIcon from '/src/assets/search-icon.svg';
 
const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(setFilters({ search: searchQuery.trim() }));
      navigate('/movies');
    }
  };

   const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      setIsProfileDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  return (
    <div className='fixed top-0 left-0 w-full p-5 z-50 text-white'>
      <div className='max-w-7xl mx-auto flex justify-between -border'>
        <Link to={`/`} className='flex items-center gap-2'>
          <img src={Tvlogo} className='w-11 h-11' alt="Tv logo" />
          <p className='text-2xl'>MovieBox</p>
        </Link>

        <div className='hidden md:flex flex-1 justify-center items-center gap-4'>
          {/* <nav className="flex flex-row space-x-4">
            <Link to="/movies" className="py-2 hover:text-red-400 transition-colors">Movies</Link>
            <Link to="/tv-series" className="py-2 hover:text-red-400 transition-colors">Tv series</Link>
            <Link to="/upcoming" className="py-2 hover:text-red-400 transition-colors">Upcoming</Link>
          </nav> */}

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className='hidden md:flex items-center max-w-96 md:w-[625px] px-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl focus-within:bg-white/20 transition-colors gap-3'
          >
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full bg-transparent py-2 outline-none placeholder-white/70 text-white' 
              placeholder='What do you want to watch?' 
            />
            <button type='submit' className='ml-2'>
              <img src={searchIcon} alt="Search Icon" className='w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity' />
            </button>
          </form>
        </div>

        {/* Navigation & User Menu */}
        <div className='flex items-center gap-5'>
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <span className="hidden sm:block">Welcome, {user?.name?.split(' ')[0] || 'User'}</span>
                <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-sm font-semibold" onClick={() => setIsMenuOpen(false)}>
                  {getUserInitials()}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-900 border border-red-400">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/profile?tab=favorites"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    My Favorites
                  </Link>
                  <Link
                    to="/profile?tab=watchlist"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Watchlist
                  </Link>
                  <Link
                    to="/profile?tab=settings"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <hr className="my-1 text-red-400" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/signin" className='cursor-pointer hover:text-red-400 transition-colors'>
                Sign in
              </Link>
              <Link to="/signup" className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md cursor-pointer transition-colors'>
                Sign up
              </Link>
            </>
        )}

           {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='bg-red-600 hover:bg-red-700 p-2 rounded-full cursor-pointer transition-colors md:hidden'
          >
            <img src={menuAlt} alt="Menu" className="w-5 h-5" />
          </button>
        </div>
      {/* </div> */}
        
        {/* <div className='flex items-center gap-5'>
          <Link to="/signin" className='hidden md:block'>
            <button>
              <p className='cursor-pointer'>Sign in</p>
            </button>
          </Link>
          <button className=' bg-red-600 p-1 rounded-full cursor-pointer'>
            <img src={menuAlt} alt="" />
          </button>
        </div> */}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 p-4 bg-black/80 backdrop-blur rounded-lg">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center mb-4 p-2 bg-white/10 rounded-lg">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full bg-transparent outline-none placeholder-white/70 text-white' 
              placeholder='Search movies...' 
            />
            <button type="submit">
              <img src={searchIcon} alt="Search" className='w-5 h-5 ml-2' />
            </button>
          </form>

          {/* Mobile Navigation */}
          <nav className="flex flex-col space-y-2">
            <Link to="/movies" className="py-2 hover:text-red-400 transition-colors">Movies</Link>
            <Link to="/tv-series" className="py-2 hover:text-red-400 transition-colors">Tv series</Link>
            <Link to="/upcoming" className="py-2 hover:text-red-400 transition-colors">Upcoming</Link>
            {isAuthenticated && (
              <>
                <Link to="/profile?tab=favorites" className="py-2 hover:text-red-400 transition-colors">Favorites</Link>
                <Link to="/profile" className="py-2 hover:text-red-400 transition-colors">Profile</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
 
export default Header;
 