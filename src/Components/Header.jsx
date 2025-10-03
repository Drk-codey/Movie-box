import React from 'react';
import { Link } from 'react-router-dom';
import Tvlogo from '/src/assets/tv.png';
import menuAlt from '/src/assets/menu-alt.svg';
import searchIcon from '/src/assets/search-icon.svg';
 
const Header = () => {
  return (
    <div className='fixed top-0 left-0 w-full p-5 z-50 text-white'>
      <div className='max-w-7xl mx-auto flex justify-between -border'>
        <div className='flex items-center gap-2'>
          <img src={Tvlogo} className='w-11 h-11' alt="Tv logo" />
          <p className='text-2xl'>MovieBox</p>
        </div>

        <div className='hidden md:flex items-center max-w-96 md:w-[525px] px-2 border rounded-xl'>
          <input type="text" className='w-full py-2 outline-none' placeholder='What do you want to watch?' />
          <img src={searchIcon} alt="Search Icon" className='w-6 h-7 cursor-pointer' />
        </div>
        
        <div className='flex items-center gap-5'>
          <button>
            <p className='cursor-pointer'>Sign in</p>
          </button>
          <button className=' bg-red-600 p-1 rounded-full cursor-pointer'>
            <img src={menuAlt} alt="" />
          </button>
        </div>
      </div>
    </div>
  )
}
 
export default Header;
 