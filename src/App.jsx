import { Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import NotFound from './Pages/NotFound';


function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies" element={<div>Movie Page</div>} />
      <Route path="/contact" element={<div>Contact Page</div>} />
      <Route path="/upcoming" element={<div>Upcoming Page</div>} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
