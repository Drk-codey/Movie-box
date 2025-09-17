import React from 'react';
import RightArrow from '../../src/assets/right-arrow.svg';
import Card from './UI/Card';
 
const FeaturedMovie = () => {
  const items = Array.from({ length: 12 });

  return (
    <section className='px-6 py-5'>
      <div className='max-w-7xl w-full mx-auto my-12 flex flex-col justify-between gap-8'>
        <div className='flex justify-between items-center w-full md:w-auto'>
          <h2 className='text-3xl md:text-4xl'>Featured Movie</h2>
          <button className='flex items-center gap-2 text-red-500'>
            <p>See more</p>
            <img src={RightArrow} alt="Right Arrow" />
          </button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-10 max-sm:place-items-center space-y-8'>
          {items.map((_, index) => (
            <Card key={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
 
export default FeaturedMovie;
 