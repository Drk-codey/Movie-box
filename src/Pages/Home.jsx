import React from 'react';
import Header from '../Components/Header';
import Hero from '../Components/Hero';
import FeaturedMovie from '../Components/FeaturedMovie';
import Footer from '../Components/Footer';
 
const Home = () => {
  return (
    <div>
      <Header />
      <Hero />
      <FeaturedMovie />
      <Footer />
    </div>
  )
}
 
export default Home;
